import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const formatVND = (n) => Number(n || 0).toLocaleString("vi-VN") + " đ";

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    cart,
    loading,
    totalPrice,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  } = useCart();

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require("../../assets/icon.png") 
        }
        style={styles.itemImage}
        resizeMode="cover"
      />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>{formatVND(item.price)}</Text>

        {/* Qty control */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => decreaseQty(item.product_id)}
          >
            <Ionicons name="remove" size={18} color="#111" />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.qty}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => increaseQty(item.product_id)}
          >
            <Ionicons name="add" size={18} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFromCart(item.product_id)}
      >
        <Ionicons name="trash-outline" size={18} color="#E60023" />
      </TouchableOpacity>
    </View>
  );

  // Hàm xử lý thanh toán
  const handleCheckout = () => {
    if (!user) {
      // Chưa đăng nhập -> chuyển đến trang login
      router.push("/account/login?redirect=/cart/checkout");
      return;
    }
    
    // Đã đăng nhập -> chuyển đến trang checkout
    router.push("/cart/checkout");
  };

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#E60023" />
        <Text style={{ marginTop: 8 }}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Giỏ hàng</Text>

        {cart.length > 0 ? (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearText}>Xóa hết</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Guest Notice */}
      {!user && cart.length > 0 && (
        <View style={styles.guestNotice}>
          <Ionicons name="information-circle" size={20} color="#FF9800" />
          <Text style={styles.guestNoticeText}>
            Đăng nhập để lưu giỏ hàng và thanh toán
          </Text>
        </View>
      )}

      {/* Empty */}
      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="cart-outline" size={52} color="#bbb" />
          <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push("/product")}
          >
            <Text style={styles.shopText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => String(item.product_id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer total */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalValue}>{formatVND(totalPrice)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>
                {user ? "Thanh toán" : "Đăng nhập để thanh toán"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: { fontSize: 22, fontWeight: "800" },

  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#f5f5f7",
  },
  clearText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E60023",
  },

  guestNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },
  guestNoticeText: {
    flex: 1,
    fontSize: 13,
    color: "#E65100",
    fontWeight: "600",
  },

  item: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },

  itemImage: { 
    width: 70, 
    height: 70,
    borderRadius: 12,
    backgroundColor: "#eee" 
  },

  itemInfo: { flex: 1, marginLeft: 10 },

  itemName: { fontSize: 15, fontWeight: "700", marginBottom: 4, color: "#111" },

  itemPrice: { fontSize: 14, color: "#E60023", fontWeight: "800" },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  qtyText: {
    width: 36,
    textAlign: "center",
    fontWeight: "800",
    color: "#111",
  },

  removeBtn: {
    padding: 8,
    marginLeft: 6,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    justifyContent: "space-between",
  },

  totalLabel: { fontSize: 13, color: "#777" },
  totalValue: { fontSize: 18, fontWeight: "900", marginTop: 2, color: "#111" },

  checkoutBtn: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  checkoutText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: "#777",
    fontWeight: "600",
  },
  shopBtn: {
    marginTop: 14,
    backgroundColor: "#E60023",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  shopText: { color: "#fff", fontWeight: "800" },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});