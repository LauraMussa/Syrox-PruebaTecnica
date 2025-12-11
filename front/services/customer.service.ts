
const API_URL = process.env.NEXT_PUBLIC_API;

export const getAllCustomersService = async () => {
  try {
     const response = await fetch(`${API_URL}/customers`); 
    if (!response.ok) throw new Error("Error fetching customers");
    return await response.json();
  } catch (error) {
    throw error;
  }
};
