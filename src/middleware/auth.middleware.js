/**
 * 
 * @param {Express("Express").Request} req 
 * @param {Express("Express").Response} res 
 * @param {import( Express").NextFunction} next 
 */
function authMiddleware(req, res, next) {
const bearer = req.headers?.authorization ?? '';
const prefix = 'Beraer ';
if(!bearer.startWIth(prefix)) {
    res.status(401).json({
        success :false,
        message: "Unauthorized Access Missing token"
    })
    return
}
const token = bearer.substring(prefix.length);
try {
const payload = jwt.veify(token, process.env.JWT_SECRET)
req.jwtPayload =payload;
next()
} catch (error) {
    res.status(401).json({
        success: false,
        message: "Unauthorized"
    })
}
}

export default authMiddleware