import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../services/UserService";

export const AuthContext = createContext();

const USER_STORAGE_KEY = "@user_data";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Load user data khi app khởi động
  useEffect(() => {
    loadUserData();
  }, []);

  // Load user từ AsyncStorage
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("✅ Loaded user from storage:", parsedUser.name, `(ID: ${parsedUser.id})`);
      }
    } catch (error) {
      console.error("❌ Error loading user data:", error);
    } finally {
      setInitializing(false);
    }
  };

  // Lưu user vào AsyncStorage
  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log("💾 Saved user to storage:", userData.name, `(ID: ${userData.id})`);
    } catch (error) {
      console.error("❌ Error saving user data:", error);
    }
  };

  const login = async (username, password, transferCartCallback) => {
    setLoading(true);
    try {
      const userData = await UserService.login(username, password);

      // Lưu user vào storage trước
      await saveUserData(userData);
      
      // Nếu có callback transfer cart, gọi nó
      if (transferCartCallback) {
        await transferCartCallback(userData.id);
      }

      // Cập nhật state SAU KHI đã transfer cart
      setUser(userData);

      console.log("✅ Login successful:", userData.name, `(ID: ${userData.id})`);
      return true;
    } catch (error) {
      console.error("❌ Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
  setLoading(true);
  try {
    await UserService.register(data);
    return { success: true };
  } catch (error) {
    const apiErrors = error.response?.data?.errors;
    return { success: false, errors: apiErrors };
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    setLoading(true);
    
    try {
      // Lấy user ID trước khi xóa
      const currentUserId = user?.id;
      console.log("🚪 Logging out user:", user?.name, `(ID: ${currentUserId})`);

      // Call API logout
      try {
        await UserService.logout();
      } catch (apiError) {
        console.error("⚠️ Logout API error (continuing anyway):", apiError);
      }

      // Danh sách các keys cần xóa
      const keysToRemove = [
        USER_STORAGE_KEY,        // User data
        "user",                  // Key rác (nếu có)
      ];

      // Xóa cart của user hiện tại (KHÔNG xóa guest cart)
      if (currentUserId) {
        keysToRemove.push(`@cart_items_${currentUserId}`);
      }

      // Xóa tất cả keys
      await AsyncStorage.multiRemove(keysToRemove);
      console.log("🗑️ Removed keys:", keysToRemove);

      // Reset state
      setUser(null);
      
      console.log("✅ Logout completed successfully");
      return true;
    } catch (error) {
      console.error("❌ Logout error:", error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thông tin user
  const updateUser = async (updatedUser) => {
    const newUser = { ...updatedUser };
    setUser(newUser);
    await saveUserData(newUser);
    console.log("✅ User updated:", newUser.name);
  };

  const updateProfile = async (userId, profileData) => {
    setLoading(true);
    try {
      const updatedUser = await UserService.updateProfile(userId, profileData);

      // Cập nhật state và storage
      setUser(updatedUser);
      await saveUserData(updatedUser);

      console.log("✅ Profile updated successfully:", updatedUser.name);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("❌ Update profile error:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initializing,
        login,
        register,
        logout,
        updateUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};