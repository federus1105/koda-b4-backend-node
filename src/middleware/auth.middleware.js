import jwt from "jsonwebtoken";

/**
 * 
 * @param {Express("Express").Request} req 
 * @param {Express("Express").Response} res 
 * @param {import("express").NextFunction} next
 */
export function authMiddleware(req, res, next) {
const bearer = req.headers?.authorization ?? '';
const prefix = 'Bearer ';
if(!bearer.startsWith(prefix)) {
    res.status(401).json({
        success :false,
        message: "Unauthorized Access Missing token"
    })
    return
}
const token = bearer.substring(prefix.length);
try {
const payload = jwt.verify(token, process.env.JWT_SECRET)
req.jwtPayload = payload;
next()
} catch (error) {
    res.status(401).json({
        success: false,
        message: "Unauthorized"
    })
}
}

export function adminMiddleware(req, res, next) {
    const userRole = req.jwtPayload?.role;

    if (userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "only admin can access this resource"
        });
    }

    next();
}