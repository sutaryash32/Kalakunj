export function getCroppedImageFile(imageSrc, croppedAreaPixels, fileName = 'crop.jpg') {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas conversion failed'));
            return;
          }
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          resolve(file);
        },
        'image/jpeg',
        0.92
      );
    };
    image.onerror = () => reject(new Error('Image load failed'));
  });
}
