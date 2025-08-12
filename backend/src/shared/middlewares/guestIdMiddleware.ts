import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function guestIdMiddleware(req: Request, res: Response, next: NextFunction) {
    const cookieName = 'guest_id';
    let guestId = req.cookies?.[cookieName];

    if (!guestId) {
        guestId = uuidv4();
        res.cookie(cookieName, guestId, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
        });
    }

    (req as any).guestId = guestId;
    next();
}
