import { getPrisma } from '../pkg/libs/prisma.js';
import {LoginUser, RegisterUser} from '../models/auth.models.js'
import jwt from 'jsonwebtoken';
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
            expiresIn: '15h',
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