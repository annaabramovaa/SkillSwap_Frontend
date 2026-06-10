import { api } from "./api";

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/users/login", {
      email,
      password,
    });

    const token = data.token;

    localStorage.setItem("token", token);

    return data;
  },
};