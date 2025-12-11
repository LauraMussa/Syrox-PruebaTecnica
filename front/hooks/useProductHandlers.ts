import { useState, useRef } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { toast } from "sonner";
import { ProductFormValues } from "@/schemas/product.schema";
import { uploadImageToCloudinary } from "@/helpers/cloudinary.helperl";

type SetValue = UseFormSetValue<ProductFormValues>;
type Watch = UseFormWatch<ProductFormValues>;

export const useProductHandlers = (setValue: SetValue, watch: Watch) => {
  // para los inputs temporales
  const [tempColor, setTempColor] = useState("");
  const [tempSize, setTempSize] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentOptions = watch("options") || { color: [], tall: [] };
  const currentImages = watch("images") || [];

  const handleAddColor = () => {
    if (!tempColor.trim()) return;
    const newColors = [...(currentOptions.color || []), tempColor];
    setValue("options", { ...currentOptions, color: newColors }, { shouldValidate: true });
    setTempColor("");
  };

  const handleRemoveColor = (index: number) => {
    const newColors = currentOptions.color?.filter((_, i) => i !== index);
    setValue("options", { ...currentOptions, color: newColors });
  };

  const handleAddSize = () => {
    if (!tempSize.trim()) return;
    const newSizes = [...(currentOptions.talla || []), tempSize];
    setValue("options", { ...currentOptions, talla: newSizes });
    setTempSize("");
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = currentOptions.talla?.filter((_, i) => i !== index);
    setValue("options", { ...currentOptions, talla: newSizes });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading("Subiendo imagen...");

    try {
      const url = await uploadImageToCloudinary(file);
      setValue("images", [...currentImages, url]);
      toast.success("Imagen subida", { id: loadingToast });
    } catch (error) {
      toast.error("Error al subir imagen", { id: loadingToast });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("images", newImages);
  };

  return {
    tempColor,
    setTempColor,
    tempSize,
    setTempSize,
    fileInputRef,
    handleAddColor,
    handleRemoveColor,
    handleAddSize,
    handleRemoveSize,
    handleFileUpload,
    handleRemoveImage,
    currentOptions,
    currentImages,
  };
};
