import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import ProductService from "../services/ProductService";
import { storageUrl } from "../config/api";
export default function TopProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
  try {
    // ✅ dùng API "most_view"
    const data = await ProductService.getMostViewedProducts(10);
    setProducts(data);
  } catch (error) {
    console.error("Error fetching top products:", error);
  } finally {
    setLoading(false);
  }
};

  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Top Products</Text>
        <View style={styles.line} />
        <ActivityIndicator size="small" color="#111" style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Top Products</Text>

      {/* Line under title */}
      <View style={styles.line} />

      {/* Horizontal items */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {products.map((product, index) => (
          <TouchableOpacity
            key={product.id}
            style={styles.circleWrapper}
            onPress={() => handleProductPress(product.id)}
          >
            <View style={styles.circle}>
              <Image
                source={{
                  uri: storageUrl(product.image_url)
                }}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingLeft: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  line: {
    width: "88%",
    height: 2,
    backgroundColor: "#e5e7eb",
    marginBottom: 10,
  },

  scroll: {
    flexGrow: 0,
  },

  circleWrapper: {
    marginRight: 14,
  },

  circle: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    resizeMode: "cover",
  },
});