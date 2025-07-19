import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 10;

export async function hashPassword(password) {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function validateHashedPassword(passwordReceived, passwordHashed) {
    return await bcrypt.compare(passwordReceived, passwordHashed);
}
