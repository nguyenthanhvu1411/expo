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
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import Alert from "../../utils/Alert";

export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { login } = useAuth();
    const { transferGuestCartToUser } = useCart();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setLoading(true);

        try {
            const success = await login(username, password, transferGuestCartToUser);

            if (success) {
                Alert.alert("Thành công", "Đăng nhập thành công!", [
                    {
                        text: "OK",
                        onPress: () => {
                            if (params?.redirect) {
                                router.replace(params.redirect);
                            } else {
                                router.replace("/");
                            }
                        },
                    },
                ]);
            } else {
                Alert.alert("Lỗi", "Tên đăng nhập hoặc mật khẩu không đúng");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };
    const handleForgotPassword = () => {
        router.push("/account/forgot-password");
    };
    return (
        <View style={styles.container}>
            {/* Back */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={loading}
            >
                <FontAwesome5 name="arrow-left" size={20} color="#111" />
            </TouchableOpacity>

            <Text style={styles.title}>Đăng nhập</Text>

            <TextInput
                placeholder="Email hoặc Số điện thoại"
                style={styles.input}
                value={username}
                autoCapitalize="none"
                onChangeText={setUsername}
                editable={!loading}
            />

            <TextInput
                placeholder="Mật khẩu"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
            />
            <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordContainer}
                disabled={loading} >
                <Text
                    style={styles.forgotPasswordText}>
                    Quên mật khẩu?
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading && (
                    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                )}
                <Text style={styles.buttonText}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/account/register")}>
                <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginBottom: 20,
        marginTop: -4,
    },
    forgotPasswordText: {
        color: "#007AFF",
        fontSize: 14,
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
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#fafafa",
    },

    button: {
        backgroundColor: "#222121",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        flexDirection: "row",
    },

    buttonDisabled: {
        backgroundColor: "#666",
        opacity: 0.7,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    link: {
        marginTop: 15,
        textAlign: "center",
        color: "blue",
    },
});
