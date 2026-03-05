import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import UserService from "../../services/UserService";
import { FontAwesome5 } from "@expo/vector-icons";
import Alert from "../../utils/Alert";
export default function ResetPasswordScreen() {
    const router = useRouter();
    const { email } = useLocalSearchParams();

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleSubmit = async () => {
        setError("");

        // Validation
        if (!otp || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (otp.length !== 6) {
            setError("Mã OTP phải có 6 chữ số");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            await UserService.resetPassword(email, otp, password);

            Alert.alert(
                "Thành công",
                "Mật khẩu đã được thay đổi!",
                [{ text: "Đăng nhập", onPress: () => router.push("/account/login") }]
            );
        } catch (error) {
            console.error("Reset password error:", error);

            if (error.response?.status === 404) {
                setError("Mã OTP không hợp lệ hoặc đã hết hạn");
            } else if (error.response?.status === 401) {
                setError(error.response?.data?.message || "Mã OTP không chính xác");
            } else {
                setError("Không thể đặt lại mật khẩu. Vui lòng thử lại!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/account/login")}
                disabled={loading}
            >
                <FontAwesome5 name="arrow-left" size={20} color="#111" />
            </TouchableOpacity>

            <Text style={styles.title}>Đặt lại mật khẩu</Text>
            <Text style={styles.subtitle}>
                Nhập mã OTP đã gửi đến email {email}
            </Text>

            {error && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            )}

            <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Mã OTP (6 chữ số)"
                placeholderTextColor="#777"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(text) => {
                    setOtp(text);
                    setError("");
                }}
                editable={!loading}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, styles.passwordInput, error && styles.inputError]}
                    placeholder="Mật khẩu mới"
                    placeholderTextColor="#777"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setError("");
                    }}
                    editable={!loading}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <FontAwesome5
                        name={showPassword ? "eye" : "eye-slash"}
                        size={18}
                        color="#666"
                    />
                </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, styles.passwordInput, error && styles.inputError]}
                    placeholder="Xác nhận mật khẩu"
                    placeholderTextColor="#777"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        setError("");
                    }}
                    editable={!loading}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <FontAwesome5
                        name={showConfirmPassword ? "eye" : "eye-slash"}
                        size={18}
                        color="#666"
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.primaryButtonText}>Xác nhận</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.resendButton}
                onPress={() => router.back()}
            >
                <Text style={styles.resendText}>Gửi lại mã OTP</Text>
            </TouchableOpacity>
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
        paddingVertical: 12,
        backgroundColor: "#f7f7f7",
        fontSize: 14,
        marginBottom: 0,
    },
    inputError: {
        borderColor: "#ff3b30",
    },
    passwordContainer: {
        width: '100%',
        justifyContent: "center",
        marginBottom: 12,
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
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
    resendButton: {
        alignItems: "center",
        paddingVertical: 12,
    },
    resendText: {
        color: "#007bff",
        fontWeight: "600",
        fontSize: 14,
    },
});