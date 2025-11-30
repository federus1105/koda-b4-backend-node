import { getPrisma } from '../pkg/libs/prisma.js';
import {GetUserByEmail, LoginUser, RegisterUser, SaveResetToken} from '../models/auth.models.js'
import jwt from 'jsonwebtoken';
import { generateRandomToken } from '../pkg/utils/genToken.js';
import { sendEmail } from '../pkg/utils/sendEmail.js';
import { hashPassword } from '../pkg/libs/hashPassword.js';
import redisClient from '../pkg/libs/redis.js';
const prisma = getPrisma();


/**
 * POST /auth/register
 * @summary Register
 * @tags Auth
 * @param {Register} request.body.required
 * @return {RegisterResponse} 201 - success response
 * @return {object} 409 - Email already registered
 */
export async function Register(req, res) {  
    const { email, fullname, password } = req.body;
    
    try {
    const result = await RegisterUser(email, password, fullname);

    const userResponse = { ...result.user, password: undefined, role: undefined };
    const accountResponse = {fullname: result.account.fullname}; 

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      results: {
        users: userResponse,
        account: accountResponse,
      },
    });

    } catch (error) {
    if (error.message.includes("already registered")) {
        return res.status(409).json({ 
        success: false, 
        message: err.message });
    }

    res.status(500).json({
     success: false,
     message: 'Internal server error',
     error: error.message
    });
 }
}


/**
 * POST /auth/login
 * @summary Login
 * @tags Auth
 * @param {Login} request.body.required
 * @return {LoginResponse} 200 - Successful login
 * @return {object} 401 - Invalid email or password
 */
export async function Login(req, res) {
  const { email, password } = req.body;
  try {
      const user = await LoginUser(email, password);
        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })
        res.status(200).json({
            success: true,
            message: 'Login successfully',
            results: {token}
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * POST /auth/forgot-password
 * @summary Forgot password
 * @tags Auth
 * @param {ForgotPassword} request.body.required
 * @return {object} 200 - success response
 */
export async function ForgotPassword(req, res) {
    try {
        const { email } = req.body;
    
        // --- GET USER BY EMAIL ---
        const userResult = await GetUserByEmail(email);

        const user = userResult.data;
    
        // --- GENERATE RANDOM TOKEN ---
        const token = await generateRandomToken(32);
        const key = `reset:pwd:${token}`;
    
        // --- SAVE TOKEN ---
        const saveResult = await SaveResetToken(key, user.id, 15 * 60);
        if (!saveResult.success) {
          return res.status(500).json({
            success: false,
            message: "Failed to save reset token",
          });
        }
    
        // --- RESET LINK ---
        const frontendURL = process.env.FRONTEND_RESET_URL || "http://localhost:8011/reset-password";
        const resetLink = `${frontendURL}`;
    
        // --- EMAIL BODY ---
        const emailBody = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #8B4513;">Reset Password</h2>
            <p>Halo,</p>
            <p>Gunakan token berikut untuk reset password:</p>
            <p style="font-size: 20px; font-weight: bold; color: #000;">${token}</p>
            <p>Atau klik tombol berikut:</p>
            <p>
              <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #8B4513; color: #fff; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </p>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
            <p>Salam,<br/>Tim Senja Kopi Kiri</p>
          </div>
        `;
    
        // --- SEND EMAIL ---
        try {
          await sendEmail({
            to: email,
            subject: "Reset Password",
            body: emailBody,
            bodyIsHTML: true,
          });
          console.log("Email sent to:", email);
        } catch (err) {
          console.error("SMTP ERROR:", err);
        }
    
        return res.status(200).json({
          success: true,
          message: "Reset link sent to email",
        });
    
      } catch (error) {
        console.error("ForgotPassword error:", error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
      }
}

/**
 * POST /auth/reset-password
 * @summary Reset password
 * @tags Auth
 * @param {ResetPassword} request.body.required
 * @return {object} 200 - success response
 */
export async function ResetPassword(req, res) {
    try {
        const { token, new_password } = req.body;
    
        // --- VALIDASI ---
        if (!token || token.trim() === "") {
          return res.status(400).json({ success: false, message: "Token is required" });
        }
        if (!new_password || new_password.trim() === "") {
          return res.status(400).json({ success: false, message: "New password is required" });
        }
    
        // --- GET USER ID FROM TOKEN REDIS ---
        const key = `reset:pwd:${token}`;
        const userIDStr = await redisClient.get(key);
        if (!userIDStr) {
          return res.status(400).json({
             success: false, 
             message: "Invalid or expired token" 
            });
        }

        const userID = Number(userIDStr);
    
        // --- HASH NEW PASSWORD ---
        const hashedPassword = await hashPassword(new_password);
    
        // --- UPDATE PASSWORD BY USER ID ---
        try {
          await prisma.users.update({
            where: { id: userID },
            data: { password: hashedPassword },
          });
        } catch (err) {
          console.error("Update password error:", err);
          return res.status(500).json({ 
            success: false, 
            message: "Failed to update password" 
        });
        }
    
        // --- DELETE TOKEN AFTER USED ---
        await redisClient.del(key);
    
        return res.status(200).json({
          success: true,
          message: "Password updated successfully",
          results: { iduser: userID },
        });
    
      } catch (error) {
        console.error("ResetPassword error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error", 
            error: error.message });
      }
}