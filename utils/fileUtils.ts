
/**
 * Converts a File object to a base64 encoded string along with its MIME type.
 * @param file The File object to convert.
 * @returns A promise that resolves to an object containing the mimeType and base64 data.
 */
export const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('File is not provided.'));
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(';')[0].split(':')[1];
      const data = result.split(',')[1];
      if (mimeType && data) {
        resolve({ mimeType, data });
      } else {
        reject(new Error('Failed to parse file data.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
