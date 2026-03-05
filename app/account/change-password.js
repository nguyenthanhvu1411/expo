import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "../../contexts/AuthContext";
import UserService from "../../services/UserService";

export default function ChangePasswordScreen() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await UserService.changePassword(
        user.id,
        formData.oldPassword,
        formData.newPassword
      );

      Alert.alert(
        "Thành công",
        "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        [
          {
            text: "OK",
            onPress: async () => {
              await logout();
              router.replace("/account/login");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Change password error:", error);
      if (error.response?.status === 401) {
        setErrors({ oldPassword: "Mật khẩu cũ không đúng" });
      } else {
        Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace("/account")}
        disabled={loading}
      >
        <FontAwesome5 name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Đổi mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập mật khẩu cũ và mật khẩu mới của bạn
        </Text>

      {/* Old Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, errors.oldPassword && styles.inputError]}
          placeholder="Mật khẩu cũ"
          placeholderTextColor="#777"
          secureTextEntry={!showOldPassword}
          value={formData.oldPassword}
          onChangeText={(text) => handleChange("oldPassword", text)}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setShowOldPassword(!showOldPassword)}
          style={styles.eyeButton}
        >
          <FontAwesome5 
            name={showOldPassword ? "eye-slash" : "eye"} 
            size={16} 
            color="#777" 
          />
        </TouchableOpacity>
      </View>
      {errors.oldPassword && (
        <Text style={styles.errorText}>{errors.oldPassword}</Text>
      )}

      {/* New Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, errors.newPassword && styles.inputError]}
          placeholder="Mật khẩu mới"
          placeholderTextColor="#777"
          secureTextEntry={!showNewPassword}
          value={formData.newPassword}
          onChangeText={(text) => handleChange("newPassword", text)}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setShowNewPassword(!showNewPassword)}
          style={styles.eyeButton}
        >
          <FontAwesome5 
            name={showNewPassword ? "eye-slash" : "eye"} 
            size={16} 
            color="#777" 
          />
        </TouchableOpacity>
      </View>
      {errors.newPassword && (
        <Text style={styles.errorText}>{errors.newPassword}</Text>
      )}

      {/* Confirm Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
          placeholder="Nhập lại mật khẩu mới"
          placeholderTextColor="#777"
          secureTextEntry={!showConfirmPassword}
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeButton}
        >
          <FontAwesome5 
            name={showConfirmPassword ? "eye-slash" : "eye"} 
            size={16} 
            color="#777" 
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Đổi mật khẩu</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Hủy</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 110,
    justifyContent: "flex-start",
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
    marginBottom: 4,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 12,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 45,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#ff3b30",
    marginBottom: 8,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#666",
    opacity: 0.7,
  },
  primaryButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    textAlign: "center",
    color: "#111",
    fontWeight: "600",
    fontSize: 16,
  },
});