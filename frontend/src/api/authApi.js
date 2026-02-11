import API from "./api";

/* LOGIN */
export const loginUser = (data) => API.post("/auth/login", data);

/* REGISTER ORG */
export const registerOrg = (data) => API.post("/auth/register-org", data);
