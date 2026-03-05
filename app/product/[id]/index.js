import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import ProductService from "../../../services/ProductService";
import { storageUrl } from "../../../config/api";
import { useCart } from "../../../contexts/CartContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  const fetchProduct = async () => {
    try {
      setError(null);
      setLoading(true);

      const list = await ProductService.getAllProducts();
      const found = list.find((p) => String(p.id) === String(id));

      if (!found) {
        setError("Không tìm thấy sản phẩm.");
        setProduct(null);
        return;
      }

      const fullImageUrl = found.image_url ? storageUrl(found.image_url) : null;

      setProduct({
        ...found,
        image_full_url: fullImageUrl,
      });

      // reset qty khi đổi product
      setQty(1);
    } catch (e) {
      console.log("Fetch product detail error:", e?.message);
      setError("Có lỗi khi tải chi tiết sản phẩm.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const hasDiscount =
    product?.price_discount !== null &&
    product?.price_discount !== undefined &&
    Number(product?.price_discount) > 0 &&
    Number(product?.price_discount) < Number(product?.price);

  const displayPrice = hasDiscount ? product.price_discount : product?.price;

  const decQty = () => setQty((q) => Math.max(1, q - 1));
  const incQty = () => setQty((q) => Math.min(99, q + 1));

  const handleAddCart = () => {
    if (!product) return;

    const normalized = {
      id: String(product.id), // ✅ ép string cho đồng bộ
      name: product.name,
      price: product.price,
      price_discount: product.price_discount ?? null,
      imageUrl: product.image_full_url ?? null,
    };

    addToCart(normalized, qty);
    alert(`Đã thêm ${qty} sản phẩm vào giỏ hàng`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (!product || error) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 12 }}>{error || "Không có dữ liệu."}</Text>

        <TouchableOpacity style={styles.retryBtn} onPress={fetchProduct}>
          <Text style={styles.retryText}>Thử tải lại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.retryBtn, { marginTop: 8, backgroundColor: "#eee" }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.retryText, { color: "#111" }]}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        {product.image_full_url ? (
          <Image
            source={{ uri: product.image_full_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.noImageBox]}>
            <Text style={{ color: "#888" }}>No image</Text>
          </View>
        )}

        {/* INFO */}
        <View style={styles.infoBox}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceMain}>
              {Number(displayPrice).toLocaleString("vi-VN")} đ
            </Text>

            {hasDiscount ? (
              <Text style={styles.priceOld}>
                {Number(product.price).toLocaleString("vi-VN")} đ
              </Text>
            ) : null}
          </View>

          {/* QTY */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Số lượng</Text>

            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={[styles.qtyBtn, qty === 1 && styles.qtyBtnDisabled]}
                onPress={decQty}
                activeOpacity={0.8}
                disabled={qty === 1}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={incQty}
                activeOpacity={0.8}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>
            {product.content || "Sản phẩm đang cập nhật mô tả."}
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handleAddCart}>
          <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.checkButton} >
          <Text style={styles.checkButtonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 320,
    backgroundColor: "#f2f2f2",
  },

  noImageBox: {
    alignItems: "center",
    justifyContent: "center",
  },

  infoBox: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 12,
  },

  priceMain: {
    fontSize: 22,
    fontWeight: "900",
    color: "#E60023",
  },

  priceOld: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "line-through",
    paddingBottom: 2,
  },

  qtyRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  qtyLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
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

  qtyBtnDisabled: {
    opacity: 0.5,
  },

  qtyBtnText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    marginTop: -1,
  },

  qtyValue: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    marginTop: 4,
    color: "#111",
  },

  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  bottomBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  addButton: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
checkButton: {
    flex: 1,
    backgroundColor: "red",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  checkButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#111",
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
