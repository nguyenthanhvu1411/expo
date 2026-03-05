import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import ProductService from "../services/ProductService";
import { storageUrl } from "../config/api";

export default function ProductGrid() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewProducts();
  }, []);

const fetchNewProducts = async () => {
  try {
    // ✅ dùng helper getNewProducts
    const data = await ProductService.getNewProducts(8);
    setProducts(data);
  } catch (error) {
    console.log("Fetch new products error:", error);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#111" />
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.card}
            onPress={() => router.push(`/product/${p.id}`)}
          >
            <Image
              source={{ uri: storageUrl(p.image_url) }}
              style={styles.image}
            />

            <Text style={styles.name} numberOfLines={2}>
              {p.name}
            </Text>

            <Text style={styles.price}>
              {p.price?.toLocaleString()} ₫
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
  },

  scrollContent: {
    paddingHorizontal: 20,
  },

  card: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginRight: 16,
    padding: 8,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 110,
    borderRadius: 14,
    resizeMode: "cover",
    marginBottom: 8,
  },

  name: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
  },
});
