import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    auth?: { id: number; role: string };
}

export const authorizeOwnerOrAdmin = (resourceUserId: (req: AuthenticatedRequest) => number) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.auth) {
            return res.status(401).json({ error: 'Unauthorized: Missing token.' });
        }

        const userIdFromToken = req.auth.id;
        const userRole = req.auth.role;
        const userIdFromResource = resourceUserId(req);

        if (userRole === 'ADMIN' || userIdFromToken === userIdFromResource) {
            return next();
        }

        return res
            .status(403)
            .json({ error: 'Forbidden: You do not have access to this resource.' });
    };
};
