import { getPrisma } from '../pkg/libs/prisma.js';
import {RegisterUser} from '../models/auth.models.js'
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