import api from "../api.js";

export const authApi = {
  register(details) {
    console.log(details)
    return api.post("/auth/register", details);
  },
  login(credentials) {
    return api.post("/auth/login", credentials);
  },
  logout() {
    return api.post("/auth/logout");
  },
  me(accessToken) {
    return api.get("/auth/me", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
  },
};
