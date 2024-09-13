import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

interface TokenPayload {
    [key: string]: any;
}

const tokenGenerator = (data: TokenPayload, expiresIn: string = '24h'): string => {
    if (!jwtSecret) {
        throw new Error('JWT secret is not defined in the environment variables');
    }

    const token = jwt.sign(data, jwtSecret, { expiresIn });
    return token;
};

const decodeToken = (token: string): TokenPayload | null => {
    if (!jwtSecret) {
        throw new Error('JWT secret is not defined in the environment variables');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error('Invalid or expired token:', error);
        return null;
    }
};

export { decodeToken, tokenGenerator };
