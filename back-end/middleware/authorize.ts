import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    auth?: { username: string; role: string };
}

export const authorize = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.auth) {
            return res.status(401).json({ error: 'Access Denied.' });
        }

        if (!roles.includes(req.auth.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions.' });
        }

        next();
    };
};
