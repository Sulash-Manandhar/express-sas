import bcrypt from 'bcryptjs';

export async function encryptPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function decryptPassword(
    loginPassword: string,
    databasePassword: string,
) {
    return bcrypt.compare(loginPassword, databasePassword);
}
