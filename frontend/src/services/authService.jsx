import axios from "axios";

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/auth/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
