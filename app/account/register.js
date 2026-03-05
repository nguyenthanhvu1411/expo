import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

const RegisterScreen = () => {
    const { register, loading } = useContext(AuthContext);
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleRegister = async () => {
        setError("");
        setErrors({});

        // Frontend basic check
        if (!form.name || !form.phone || !form.email || !form.password) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (!/^0\d{9}$/.test(form.phone)) {
            setError("Số điện thoại phải có đúng 10 số và bắt đầu bằng 0");
            return;
        }

        const result = await register(form);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                router.push("/account/login");
            }, 1000);
        } else {
            if (result.errors) {
                setErrors(result.errors);
            } else {
                setError("Đăng ký thất bại");
            }
        }
    };


    // Hiển thị màn hình thành công
    if (isSuccess) {
        return (
            <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                    <Text style={styles.checkmark}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Đăng ký thành công!</Text>
                <Text style={styles.successMessage}>
                    Bạn đã đăng ký tài khoản thành công.{"\n"}
                    Đang chuyển đến trang đăng nhập...
                </Text>
                <ActivityIndicator size="large" color="#4caf50" style={{ marginTop: 20 }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
            ) : null}

            <TextInput
                placeholder="Tên đăng nhập"
                style={styles.input}
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
                editable={!loading}
            />

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={form.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(v) => handleChange("email", v)}
                editable={!loading}
            />
            {errors.email && <Text style={styles.fieldError}>{errors.email[0]}</Text>}

            <TextInput
                placeholder="Số điện thoại"
                style={styles.input}
                value={form.phone}
                keyboardType="phone-pad"
                onChangeText={(v) => handleChange("phone", v)}
                editable={!loading}
            />
            {errors.phone && <Text style={styles.fieldError}>{errors.phone[0]}</Text>}
            <TextInput
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                style={styles.input}
                value={form.password}
                secureTextEntry
                onChangeText={(v) => handleChange("password", v)}
                editable={!loading}
            />
            {errors.password && <Text style={styles.fieldError}>{errors.password[0]}</Text>}

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
            >
                {loading && <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />}
                <Text style={styles.buttonText}>
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => !loading && router.push("/account/login")}
                disabled={loading}
            >
                <Text style={styles.link}>
                    Đã có tài khoản? Đăng nhập
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    successContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#4caf50",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#4caf50",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
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
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
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
    buttonLoader: {
        marginRight: 8,
    },
    link: {
        marginTop: 15,
        textAlign: "center",
        color: "#007AFF",
        fontSize: 15,
    },
    fieldError: {
        color: "#f44336",
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 4,
    },

});