import jwt from 'jsonwebtoken';
import { Role } from '../types';

const generateJwtToken = ({
    id,
    username,
    role,
}: {
    id: number;
    username: string;
    role: Role;
}): string => {
    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'pinnacle_app' };

    try {
        return jwt.sign({ id, username, role }, process.env.JWT_SECRET!, options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
};

export { generateJwtToken };

// File inspired by teachers solution
