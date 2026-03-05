import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import CheckoutService from "../../services/CheckoutService";
import Alert from "../../utils/Alert";

export default function MyOrderScreen({ navigation }) {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await CheckoutService.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Refresh khi kéo xuống
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [user]);

  // Tính tổng tiền đơn hàng
  const calculateOrderTotal = (orderdetails) => {
    if (!orderdetails || orderdetails.length === 0) return 0;
    return orderdetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Xác định màu trạng thái (có thể custom theo status từ backend)
  const getStatusColor = (status) => {
    // Backend có thể trả về các status khác nhau
    // Tạm thời dùng màu mặc định
    return "#2196f3"; // Màu xanh dương cho tất cả
  };

  const renderItem = ({ item }) => {
    const total = calculateOrderTotal(item.orderdetails);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Mã đơn: #{item.id}</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            Đang xử lý
          </Text>
        </View>
        <Text style={styles.date}>
          Ngày đặt: {formatDate(item.created_at)}
        </Text>
        <Text style={styles.items}>
          Sản phẩm: {item.orderdetails?.length || 0} món
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.total}>
            Tổng: {total.toLocaleString("vi-VN")} đ
          </Text>
          <FontAwesome5 name="chevron-right" size={14} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="user-slash" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Vui lòng đăng nhập</Text>
        <Text style={styles.emptySubText}>
          Để xem danh sách đơn hàng của bạn
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ee4d2d" />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome5 name="shopping-bag" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        <Text style={styles.emptySubText}>
          Hãy thêm sản phẩm vào giỏ hàng và đặt hàng
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.shopButtonText}>Mua sắm ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace("/account")}
          disabled={loading}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Đơn hàng của tôi</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ee4d2d"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
  },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  items: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  total: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ee4d2d",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#777",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: "#ee4d2d",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: "#ee4d2d",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});