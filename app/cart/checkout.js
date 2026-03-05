import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import CheckoutService from "../../services/CheckoutService";
import Alert from "../../utils/Alert";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + " đ";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      Alert.alert(
        "Yêu cầu đăng nhập",
        "Vui lòng đăng nhập để thanh toán",
        [
          {
            text: "Đăng nhập",
            onPress: () => router.replace("/account/login?redirect=/cart/checkout"),
          },
          {
            text: "Hủy",
            onPress: () => router.back(),
            style: "cancel",
          },
        ]
      );
    }
  }, [user]);

  // Load thông tin user vào form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ giao hàng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để thanh toán");
      router.replace("/account/login?redirect=/cart/checkout");
      return;
    }

    if (!validateForm()) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin");
      return;
    }

    if (cart.length === 0) {
      Alert.alert("Thông báo", "Giỏ hàng trống");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: cart.map((item) => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.qty),
          price: parseFloat(item.price),
        })),
      };

      console.log("Order data:", JSON.stringify(orderData, null, 2));

      const response = await CheckoutService.createOrder(orderData);

      if (response.success) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await clearCart();

        Alert.alert(
          "Thành công",
          "Đơn hàng của bạn đã được đặt thành công!",
          [
            {
              text: "Xem đơn hàng",
              onPress: () => router.push("/account/myOrder"),
            },
            {
              text: "Về trang chủ",
              onPress: () => router.push("/"),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể đặt hàng. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Không render gì nếu chưa đăng nhập
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E60023" />
        <Text style={{ marginTop: 12 }}>Đang kiểm tra đăng nhập...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Thông tin giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ tên *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Nhập họ tên"
              value={formData.name}
              onChangeText={(val) => handleInputChange("name", val)}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Nhập email"
              value={formData.email}
              onChangeText={(val) => handleInputChange("email", val)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChangeText={(val) => handleInputChange("phone", val)}
              keyboardType="phone-pad"
            />
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ giao hàng *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.address && styles.inputError,
              ]}
              placeholder="Nhập địa chỉ đầy đủ"
              value={formData.address}
              onChangeText={(val) => handleInputChange("address", val)}
              multiline
              numberOfLines={3}
            />
            {errors.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}
          </View>
        </View>

        {/* Tóm tắt đơn hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng của bạn</Text>

          {cart.map((item) => (
            <View key={item.product_id} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.orderItemQty}>x{item.qty}</Text>
              </View>
              <Text style={styles.orderItemPrice}>
                {formatVND(item.price * item.qty)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatVND(totalPrice)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.checkoutBtn, loading && styles.checkoutBtnDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Đặt hàng</Text>
          )}
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#f9f9f9",
  },

  inputError: {
    borderColor: "#E60023",
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  errorText: {
    color: "#E60023",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  orderItemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  orderItemName: {
    fontSize: 14,
    color: "#111",
    flex: 1,
  },

  orderItemQty: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    fontWeight: "600",
  },

  orderItemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E60023",
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#E60023",
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },

  checkoutBtn: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  checkoutBtnDisabled: {
    backgroundColor: "#999",
  },

  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});