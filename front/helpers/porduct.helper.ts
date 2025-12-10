// const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // 1. Mostrar loading o toast de "Subiendo..."
//     const loadingToast = toast.loading("Subiendo imagen...");

//     try {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("upload_preset", "tu_preset_aca"); // TU PRESET DE CLOUDINARY
//         // formData.append("folder", "productos"); // Opcional

//         // 2. Petición a Cloudinary (O a tu endpoint que sube a Cloudinary)
//         const res = await fetch("https://api.cloudinary.com/v1_1/TU_CLOUD_NAME/image/upload", {
//             method: "POST",
//             body: formData
//         });

//         const data = await res.json();

//         if (data.secure_url) {
//             // 3. Agregar la URL recibida al formulario
//             const currentImages = watch("images") || [];
//             setValue("images", [...currentImages, data.secure_url]);
            
//             toast.success("Imagen subida", { id: loadingToast });
//         } else {
//             throw new Error("No se recibió URL");
//         }
//     } catch (error) {
//         console.error(error);
//         toast.error("Error al subir imagen", { id: loadingToast });
//     } finally {
//         // Limpiar input para permitir subir el mismo archivo de nuevo si se quiere
//         if (fileInputRef.current) fileInputRef.current.value = "";
//     }
// };