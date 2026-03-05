import { Platform } from "react-native";
import httpAxios from "./httpAxios";

const UserService = {
  login: async (username, password) => {
    try {
      const res = await httpAxios.post("/user-login", {
        username,
        password,
      });
      return res.data.user;
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const res = await httpAxios.post("/user-logout");
      return res.data;
    } catch (error) {
      console.error("Logout error:", error.response?.data || error);
      throw error;
    }
  },

  register: async (data) => {
    try {
      const res = await httpAxios.post("/user-register", {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      return res.data.user;
    } catch (error) {
      console.error("Register error:", error.response?.data || error);
      throw error;
    }
  },
  updateProfile: async (userId, data) => {
    try {
      const formData = new FormData();

      // Luôn gửi các trường text
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      if (data.address) formData.append('address', data.address);

      // Chỉ append avatar nếu người dùng đã chọn ảnh mới (data.avatar là một URI)
      if (data.avatar && data.isAvatarChanged) {
        if (Platform.OS === 'web') {
          const response = await fetch(data.avatar);
          const blob = await response.blob();
          formData.append('avatar', blob, 'avatar.jpg');
        } else {
          const uri = data.avatar;
          const filename = uri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('avatar', {
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            name: filename,
            type: type,
          });
        }
      }

      const res = await httpAxios.post(`/user-update/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.user; // Trả về object user từ backend
    } catch (error) {
      console.error("Update profile service error:", error.response?.data || error);
      throw error;
    }
  },

  getProfile: async (email) => {
    try {
      const res = await httpAxios.get(`/user-row/${email}`);
      return res.data;
    } catch (error) {
      console.error("Get profile error:", error.response?.data || error);
      throw error;
    }
  },
  changePassword: async (userId, oldPassword, newPassword) => {
    try {
      const res = await httpAxios.post(`/user-change-password/${userId}`, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return res.data;
    } catch (error) {
      console.error("Change password error:", error.response?.data || error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await httpAxios.post("/user-forgot-password", {
        email,
      });
      return res.data;
    } catch (error) {
      console.error("Forgot password error:", error.response?.data || error);
      throw error;
    }
  },
  resetPassword: async (email, otp, newPassword) => {
    try {
      const res = await httpAxios.post("/user-reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
      return res.data;
    } catch (error) {
      console.error("Reset password error:", error.response?.data || error);
      throw error;
    }
  },

};

export default UserService;