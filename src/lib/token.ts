import Cookies from "js-cookie";

export const TOKEN_KEY = "sociality_token";

export const getToken = () => Cookies.get(TOKEN_KEY);

export const setToken = (token: string) =>
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

export const removeToken = () => Cookies.remove(TOKEN_KEY);
