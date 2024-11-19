import { Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

interface UserRequest extends Request {
    user?: JwtPayload | string;
}

export const requireSignIn = (req: UserRequest, res: Response, next: any) => {
    const token = req.cookies && req.cookies.token ? req.cookies.token : null;

    if (token === null) return res.sendStatus(401);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.sendStatus(500); // Internal Server Error if secret is not defined
    }

    verify(token, secret, (err: any, user: any) => {
        console.log(`Before: ${JSON.stringify(user)} and ${req.user}`)
        if (err) {
            console.log('JWT verification error:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        console.log(`After: ${JSON.stringify(user)} and ${JSON.stringify(req.user)}`)
        next();
    });
    
};
