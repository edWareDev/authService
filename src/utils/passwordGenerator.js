export const generatePassword = (length, config) => {
    const { allowUpperCase = true, allowLowerCase = true, allowNumbers = true, allowSymbols = true } = config || {};

    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allCharacters = `${allowUpperCase ? upperCase : ''}${allowLowerCase ? lowerCase : ''}${allowNumbers ? numbers : ''}${allowSymbols ? symbols : ''}`;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }
    return password;
};