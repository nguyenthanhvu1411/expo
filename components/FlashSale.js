import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import ProductService from "../services/ProductService";
import { storageUrl } from "../config/api";

export default function FlashSale() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaleProducts();
  }, []);

  const fetchSaleProducts = async () => {
    try {
      // ✅ dùng đúng API khuyến mại
      const data = await ProductService.getSaleProducts(6);
      setProducts(data);
    } catch (error) {
      console.log("Fetch flash sale error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountPercentage = (price, price_discount) => {
    if (!price || price <= 0 || !price_discount || price_discount <= 0) return 0;
    return Math.round(((price - price_discount) / price) * 100);
  };

  const renderItem = ({ item }) => {
    const discountPercent = calculateDiscountPercentage(
      item.price,
      item.price_discount
    );

    const hasDiscount =
      item.price_discount &&
      item.price_discount > 0 &&
      item.price_discount < item.price;

    return (
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.85}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        {/* Image */}
        <Image
          source={{ uri: storageUrl(item.image_url) }}
          style={styles.productImage}
        />

        {/* Discount badge */}
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
        )}

        {/* Price Container */}
        <View style={styles.priceContainer}>
          <Text style={styles.salePrice}>
            {(hasDiscount ? item.price_discount : item.price)?.toLocaleString()} ₫
          </Text>

          {hasDiscount && (
            <Text style={styles.originPrice}>
              {item.price?.toLocaleString()} ₫
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ margin: 20 }} />;
  }

  if (!products.length) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Flash Sale</Text>
          <View style={styles.timerRow}>
            <Text style={styles.timerIcon}>⏱</Text>
            <TimeBox value="12" />
            <Text style={styles.colon}>:</Text>
            <TimeBox value="59" />
            <Text style={styles.colon}>:</Text>
            <TimeBox value="59" />
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Products */}
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

/* Time box */
const TimeBox = ({ value }) => (
  <View style={styles.timeBox}>
    <Text style={styles.timeText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginRight: 12,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timerIcon: {
    color: "#fff",
    fontSize: 12,
    marginRight: 4,
  },
  timeBox: {
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  timeText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
  },
  colon: {
    color: "#fff",
    marginHorizontal: 2,
    fontSize: 12,
    fontWeight: "700",
  },
  seeAllText: {
    fontSize: 14,
    color: "#ff3b30",
    fontWeight: "600",
  },
  grid: {
    gap: 12,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 2,
    position: "relative",
    aspectRatio: 1,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    alignItems: "center",
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  priceContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  salePrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ff3b30",
  },
  originPrice: {
    fontSize: 11,
    color: "#8e8e93",
    textDecorationLine: "line-through",
  },
});
