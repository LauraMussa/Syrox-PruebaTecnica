
export const uploadImageToCloudinary = async (
  file: File,
  uploadPreset: string = "syrox_tech", 
  folder: string = "syroxtech/productos"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dvgnwrkvl/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("No se recibió URL de Cloudinary");
    }
  } catch (error) {
    console.error("Error en uploadImageToCloudinary:", error);
    throw error;
  }
};
