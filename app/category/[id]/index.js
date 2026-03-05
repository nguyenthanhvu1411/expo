import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import ProductService from "../../../services/ProductService";
import { storageUrl } from "../../../config/api";
import ProductCard from "../../../components/ProductCard";

function normalizeProducts(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.products)) return res.products;
  return [];
}

export default function CategoryProductsScreen() {
  const { id, name } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const title = useMemo(
    () => name || "Danh mục sản phẩm",
    [name]
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await ProductService.getAllProducts();
      const list = normalizeProducts(res);

      const filtered = list
        .filter((p) => String(p.category_id) === String(id))
        .map((p) => ({
          ...p,
          imageUrl: p.image_url ? storageUrl(p.image_url) : null,
        }));

      setProducts(filtered);
    } catch (e) {
      console.log(e);
      setError("Không tải được sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title,
          headerTitleStyle: { fontWeight: "700" },
        }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>📦 Chưa có sản phẩm</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ProductCard item={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#EF4444",
    fontWeight: "600",
  },
  empty: {
    fontSize: 16,
    color: "#6B7280",
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
});
