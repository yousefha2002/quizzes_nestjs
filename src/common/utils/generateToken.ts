import * as jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    const token = jwt.sign(payload, 'token');
    return token;
};