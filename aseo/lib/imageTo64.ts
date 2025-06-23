export const getBase64FromUrl = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      if (reader.result) resolve(reader.result.toString());
      else reject("Error al convertir imagen");
    };
  });
};
