const API_URL = process.env.NEXT_PUBLIC_API;

export const getHistoryService = async () => {
  try {
    const response = await fetch(`${API_URL}/history`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Error historial");
    return await response.json();
  } catch (error) {
    throw error;
  }
};
