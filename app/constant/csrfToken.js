// utils/csrfToken.js
import * as SecureStore from "expo-secure-store";

const CSRF_TOKEN_KEY = "csrfToken";

export const saveCsrfToken = async (token) => {
  await SecureStore.setItemAsync(CSRF_TOKEN_KEY, token);
};

export const getCsrfToken = async () => {
  return await SecureStore.getItemAsync(CSRF_TOKEN_KEY);
};

export const deleteCsrfToken = async () => {
  await SecureStore.deleteItemAsync(CSRF_TOKEN_KEY);
};
