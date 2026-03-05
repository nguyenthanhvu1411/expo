import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { storageUrl } from "../../config/api";

export default function AccountScreen() {
  const { user, logout } = useContext(AuthContext);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
  setLoggingOut(true);
  try {
    await logout();
    // Màn hình tự động chuyển, không cần alert
  } catch (error) {
    Alert.alert("Lỗi", "...");
    setLoggingOut(false);
  }
};

  // Màn hình khi chưa đăng nhập
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tài khoản</Text>

        <View style={styles.guestBox}>
          <FontAwesome5 name="user-circle" size={48} color="#999" />
          <Text style={styles.guestText}>Chưa đăng nhập</Text>
          <Text style={styles.guestSubtext}>
            Đăng nhập để trải nghiệm đầy đủ tính năng
          </Text>
        </View>

        <Link href="/account/login" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <FontAwesome5 name="sign-in-alt" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/account/register" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <FontAwesome5 name="user-plus" size={18} color="#111" />
            <Text style={styles.secondaryButtonText}>Đăng ký tài khoản</Text>
          </TouchableOpacity>
        </Link>

        {/* Các tính năng không cần đăng nhập */}
        <View style={styles.divider} />

        <Link href="/product" asChild>
          <TouchableOpacity style={styles.row}>
            <FontAwesome5 name="shopping-bag" size={20} color="#111" />
            <Text style={styles.rowText}>Sản phẩm</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" style={styles.chevron} />
          </TouchableOpacity>
        </Link>

        <Link href="/support" asChild>
          <TouchableOpacity style={styles.row}>
            <FontAwesome5 name="headset" size={20} color="#111" />
            <Text style={styles.rowText}>Hỗ trợ</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" style={styles.chevron} />
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  // Màn hình khi đã đăng nhập
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tài khoản</Text>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarCircle}>
          {user.avatar ? (
            <Image source={{ uri: storageUrl(user.avatar) }} style={styles.avatarImage} />
          ) : (
            <FontAwesome5 name="user" size={28} color="#fff" />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <Link href="/account/profile" asChild>
        <TouchableOpacity style={styles.row} disabled={loggingOut}>
          <FontAwesome5 name="user" size={20} color="#111" />
          <Text style={styles.rowText}>Thông tin cá nhân</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#999" style={styles.chevron} />
        </TouchableOpacity>
      </Link>

      <Link href="/account/myOrder" asChild>
        <TouchableOpacity style={styles.row} disabled={loggingOut}>
          <FontAwesome5 name="shopping-bag" size={20} color="#111" />
          <Text style={styles.rowText}>Đơn hàng của tôi</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#999" style={styles.chevron} />
        </TouchableOpacity>
      </Link>

      <Link href="/account/change-password" asChild>
        <TouchableOpacity style={styles.row} disabled={loggingOut}>
          <FontAwesome5 name="lock" size={20} color="#111" />
          <Text style={styles.rowText}>Đổi mật khẩu</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#999" style={styles.chevron} />
        </TouchableOpacity>
      </Link>

      <Link href="/account/settings" asChild>
        <TouchableOpacity style={styles.row} disabled={loggingOut}>
          <FontAwesome5 name="cog" size={20} color="#111" />
          <Text style={styles.rowText}>Cài đặt</Text>
          <FontAwesome5 name="chevron-right" size={16} color="#999" style={styles.chevron} />
        </TouchableOpacity>
      </Link>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.row, styles.logoutRow, loggingOut && styles.logoutRowDisabled]} 
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <>
            <ActivityIndicator size="small" color="#e53935" />
            <Text style={[styles.rowText, { color: "#e53935" }]}>Đang đăng xuất...</Text>
          </>
        ) : (
          <>
            <FontAwesome5 name="sign-out-alt" size={20} color="#e53935" />
            <Text style={[styles.rowText, { color: "#e53935" }]}>Đăng xuất</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  // Guest (Not Logged In) Styles
  guestBox: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    marginBottom: 20,
  },
  guestText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },
  guestSubtext: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  secondaryButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 20,
  },
  // Logged In Styles
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  // Common Row Styles
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  chevron: {
    marginLeft: "auto",
  },
  logoutRow: {
    marginTop: 10,
    backgroundColor: "#fdecea",
  },
  logoutRowDisabled: {
    opacity: 0.6,
  },
});