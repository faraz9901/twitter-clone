
const imageCompressor = (file: File, maxSizeMB?: number): Promise<Blob | null> => {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }

        if (!file.type.startsWith('image')) {
            resolve(null);
            return;
        }

        const maxSize = (maxSizeMB || 2) * 1024 * 1024; // 2MB in bytes

        if (file.size <= maxSize) {
            // File size is within the limit, no compression needed
            resolve(file);
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx?.drawImage(img, 0, 0);

                canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.5);

                canvas.remove();

            };

            img.onerror = (error) => {
                reject(error); // Reject the promise on image load error
            };

            img.src = event.target?.result as string;
        };

        reader.onerror = (error) => {
            reject(error); // Reject the promise on file read error
        };

        reader.readAsDataURL(file);
    });
};

export { imageCompressor }