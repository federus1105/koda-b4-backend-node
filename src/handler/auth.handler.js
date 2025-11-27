import { getPrisma } from '../pkg/libs/prisma.js';
const prisma = getPrisma();

export async function Register(req, res) {  
    const { email, fullname, password } = req.body;
    
    try {
    const result = await Register(email, password, fullname);

    const userResponse = { ...result.user, password: undefined };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userResponse,
        account: result.account,
      },
    });

    } catch (error) {
    if (err.message.includes("already registered")) {
      return res.status(409).json({ success: false, message: err.message });
    }
    res.status(500).json({
     success: false,
     message: 'Internal server error',
     error: error.message
        });
 }
}