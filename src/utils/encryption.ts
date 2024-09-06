import CryptoJS from 'crypto-js';

const secretKey = process.env.ENCRYPTION_KEY;

if (!secretKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
}

export const encrypt = (text: string): string => {
    if (!text) {
        throw new Error('Text to encrypt cannot be empty');
    }
    try {
        return CryptoJS.AES.encrypt(text, secretKey).toString();
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Encryption failed');
    }
};

export const decrypt = (cipherText: string): string => {
    if (!cipherText) {
        throw new Error('Ciphertext to decrypt cannot be empty');
    }
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
            throw new Error('Decryption resulted in empty string');
        }
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Decryption failed');
    }
};