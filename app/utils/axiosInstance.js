import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { base_url } from "../constant/api";

const axiosInstance = axios.create({
  baseURL: base_url,
});

const ACCESS_EXPIRY_DURATION = 6 * 60 * 60 * 1000;

const clearAuthStorage = async () => {
  try {
    await AsyncStorage.multiRemove([
      "userData",
      "accessToken",
      "refreshToken",
      "accessTokenExpiry",
      "refreshTokenExpiry",
    ]);
  } catch (error) {
    console.warn("Failed to clear auth storage", error);
  }
};

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const isRefreshTokenExpired = async () => {
  try {
    const refreshExpiry = await AsyncStorage.getItem("refreshTokenExpiry");
    if (!refreshExpiry) return true;
    return Date.now() > parseInt(refreshExpiry, 10);
  } catch (error) {
    return true;
  }
};

export const isAccessTokenExpired = async () => {
  try {
    const accessExpiry = await AsyncStorage.getItem("accessTokenExpiry");
    if (!accessExpiry) return true;
    return Date.now() > parseInt(accessExpiry, 10);
  } catch (error) {
    return true;
  }
};

let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

const handleLogout = async () => {
  await clearAuthStorage();
  logoutHandler && logoutHandler();
};

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (refreshToken && (await isRefreshTokenExpired())) {
        await handleLogout();
        return Promise.reject(
          new Error("Session expired. Please login again."),
        );
      }

      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const res = await axios.post(`${base_url}/core/refresh-token/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;

        await AsyncStorage.setItem("accessToken", newAccessToken);
        await AsyncStorage.setItem(
          "accessTokenExpiry",
          (Date.now() + ACCESS_EXPIRY_DURATION).toString(),
        );

        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        if (err.response?.status === 401) {
          await handleLogout();
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
