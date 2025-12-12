import Cookies from "js-cookie";

export const getAuthHeaders = () => {
  const token = Cookies.get("auth-token"); 
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
