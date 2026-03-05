// components/CategoryGrid.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CategoryService from "../services/CategoryService";
import ProductService from "../services/ProductService";
import { storageUrl } from "../config/api";
import { useRouter } from "expo-router";

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]); 
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      // Gọi song song 2 API
      const [categoryResRaw, productResRaw] = await Promise.all([
        CategoryService.getAllCategorys(),
        ProductService.getAllProducts({limit: limit}),
      ]);

      const categoryRes = categoryResRaw ?? [];
      const productRes = productResRaw ?? [];

      // Nhóm sản phẩm theo category_id => lấy danh sách url ảnh
      const productMap = {};
      productRes.forEach((p) => {
        if (!p || p.category_id == null) return;

        if (!productMap[p.category_id]) productMap[p.category_id] = [];

        if (p.image_url) {
          productMap[p.category_id].push(storageUrl(p.image_url));
        }
        
      });

      
      const mappedCategories = categoryRes.map((cat) => {
        const imgs = productMap[cat.id] ?? [];
        const safeImgs = Array.isArray(imgs) ? imgs : [];

        // (tuỳ chọn) lọc trùng url ảnh + giữ thứ tự
        const uniqueImgs = [...new Set(safeImgs)];

        return {
          id: String(cat.id),
          name: cat.name,
          images: uniqueImgs.slice(0, 4), // chỉ lấy tối đa 4, không lặp
        };
      });

      setCategories(mappedCategories);
    } catch (e) {
      console.log("Fetch categories/products error:", e?.message || e);
      setError("Không tải được danh mục.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  if (loading && categories.length === 0) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      </View>
    );
  }

  if (error && categories.length === 0) {
    return (
      <View style={styles.loadingBox}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.map((cat) => {
        const images = Array.isArray(cat.images) ? cat.images : [];

        return (
          <TouchableOpacity
            key={cat.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/category/[id]",
                params: { id: cat.id, name: cat.name },
              })
            }
          >
            <View style={styles.imagesGrid}>
              {[...Array(4)].map((_, index) => {
                const imgUrl = images[index]; // có thể undefined nếu chỉ có 1-3 ảnh
                return imgUrl ? (
                  <Image
                    key={index}
                    source={{ uri: imgUrl }}
                    style={styles.image}
                  />
                ) : (
                  <View key={index} style={styles.imagePlaceholder} />
                );
              })}
            </View>

            <View style={styles.footer}>
              <Text style={styles.name} numberOfLines={1}>
                {cat.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
  },

  container: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
    paddingBottom: 20,
  },

  card: {
    width: "46%",
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 4,
    overflow: "hidden",
  },

  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#f3f4f6",
  },

  image: {
    width: "50%",
    height: 65,
  },
  imagePlaceholder: {
    width: "50%",
    height: 65,
    backgroundColor: "#e5e7eb",
  },

  footer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },
});
