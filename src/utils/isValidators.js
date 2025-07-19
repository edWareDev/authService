export const isValidImageUrl = (str) => {
    // Regular expression to validate a URL format
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\\/\w.-]*)*\/?$/;

    // Regular expression to validate image file extensions
    const imageExtensionsPattern = /\.(png|jpg|jpeg|webp)$/i;

    try {
        // Check if the string matches the URL pattern
        const isUrl = urlPattern.test(str);

        // Check if the string ends with an image file extension
        const isImage = imageExtensionsPattern.test(str);

        // Return true only if both conditions are met
        return isUrl && isImage;
    } catch (error) {
        console.error("Error validating URL:", error);
        return false;
    }
};

/**
 * Valida si una cadena es una imagen base64 válida y retorna su buffer
 * Soporta los formatos: PNG, JPEG/JPG, WebP
 * @param {string} imageBase64 - Cadena en formato base64 con o sin prefijo data:image
 * @returns {Buffer|null} Buffer de la imagen si es válida, null si no lo es
 */
export const isBase64Image = (imageBase64) => {
    try {
        // Remover el prefijo "data:image/..." si existe y validar base64
        const base64Regex = /^data:image\/[a-zA-Z+]+;base64,/;
        const base64Data = imageBase64.replace(base64Regex, '');

        // Convertir a Buffer
        const buffer = Buffer.from(base64Data, 'base64');

        if (buffer.length < 12) { // Mínimo de bytes para validar
            return null;
        }

        // Crear buffers para las firmas una sola vez
        const signatures = {
            png: Uint8Array.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
            jpeg: Uint8Array.from([0xFF, 0xD8, 0xFF]),
            webp: {
                riff: Uint8Array.from([0x52, 0x49, 0x46, 0x46]),
                webp: Buffer.from('WEBP')
            }
        };

        // Comparar firmas
        const isPNG = Buffer.compare(
            buffer.subarray(0, 8),
            Buffer.from(signatures.png)
        ) === 0;

        const isJPEG = Buffer.compare(
            buffer.subarray(0, 3),
            Buffer.from(signatures.jpeg)
        ) === 0;

        const isWebP = Buffer.compare(
            buffer.subarray(0, 4),
            Buffer.from(signatures.webp.riff)
        ) === 0 && Buffer.compare(
            buffer.subarray(8, 12),
            signatures.webp.webp
        ) === 0;

        return (isPNG || isJPEG || isWebP) ? buffer : null;

    } catch (error) {
        console.error('Error validando imagen base64:', error);
        return null;
    }
};

/**
 * Valida si una cadena está en formato base64 válido
 * @param {string} str - Cadena a validar
 * @returns {boolean}
 */
export const isValidBase64 = (str) => {
    const base64Regex = /^data:image\/[a-zA-Z+]+;base64,/;
    const base64Data = str.replace(base64Regex, '');
    if (!base64Data) return false;

    try {
        // Verificar caracteres válidos de base64
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(base64Data)) return false;

        // La longitud debe ser múltiplo de 4
        if (base64Data.length % 4 !== 0) return false;

        return true;
    } catch {
        return false;
    }
};