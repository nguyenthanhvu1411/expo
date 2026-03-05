import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter  } from "expo-router";
import UserService from "../../services/UserService";
import { FontAwesome5 } from "@expo/vector-icons";
import Alert from "../../utils/Alert";
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setError("");

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      await UserService.forgotPassword(email);
      setSuccess(true);
      Alert.alert(
        "Thành công",
        "Mã OTP đã được gửi đến email của bạn!",
        [{ text: "OK", onPress: () => router.push({ pathname: '/account/reset-password', params: { email } }) }]
      );
      //  setTimeout(() => {
      //   router.push({
      //     pathname: '/account/reset-password',
      //     params: { email: email }
      //   });
      // }, 2000);
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response?.status === 404) {
        setError("Email không tồn tại trong hệ thống");
      } else {
        Alert.alert("Lỗi", "Không thể gửi email. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace("/account/login")}
        disabled={loading}
      >
        <FontAwesome5 name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Email đã được gửi!</Text>
          <Text style={styles.successMessage}>
            Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
          </Text>
          <Link href="/account/login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Về trang đăng nhập</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace("/account/login")}
        disabled={loading}
      >
        <FontAwesome5 name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.subtitle}>
        Nhập email của bạn để nhận link đặt lại mật khẩu
      </Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Gửi link đặt lại</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Nhớ mật khẩu? </Text>
        <Link href="/account/login" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Đăng nhập</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  successContainer: {
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 50,
    color: "#fff",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#f7f7f7",
    fontSize: 14,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  primaryButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#666",
  },
  primaryButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: {
    fontSize: 14,
    color: "#444",
  },
  linkText: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "600",
  },
});