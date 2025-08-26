import { cryptoConfig } from '../../../config/cryptoConfig.js';

const getKey = () => {
    return crypto.createHash('sha256').update(cryptoConfig.secret).digest(); // 32 bytes para AES-256
};

export const encrypt = (text) => {
    const key = getKey();
    const iv = crypto.randomBytes(cryptoConfig.initializationVectorLength); // Vector de inicialización (IV) de 16 bytes

    const cipher = crypto.createCipheriv(cryptoConfig.algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('base64');
};

export const decrypt = (encryptedText) => {
    const key = getKey();
    const [ivHex, encryptedBase64] = encryptedText.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(encryptedBase64, 'base64');

    const decipher = crypto.createDecipheriv(cryptoConfig.secret, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    return decrypted.toString('utf8');
};