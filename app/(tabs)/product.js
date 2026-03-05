import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import ProductService from "../../services/ProductService";
import { storageUrl } from "../../config/api";
import CategoryService from "../../services/CategoryService";
import ProductCard from "../../components/ProductCard";
import CategoryCard from "../../components/CategoryCard";
import LoadMoreFooter from "../../components/LoadMoreFooter";
import SearchBar from "../../components/SearchBar";

export default function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      if (products.length === 0) {
        setLoading(true);
      }

      const list = await ProductService.getAllProducts({
        category_id: categoryId,
        limit: limit,
        search: searchQuery,
      });

      console.log("Fetched products:", list); 

      if (!list || !Array.isArray(list)) {
        throw new Error("API không trả về mảng sản phẩm");
      }

      const mapped = list.map((item) => ({
        id: String(item.id),
        name: item.name,
        price: item.price,
        price_discount: item.price_discount ?? null,
        imageUrl: item.image_url ? storageUrl(item.image_url) : null,
      }));

      setProducts(mapped);
      setHasMore(list.length >= limit);
    } catch (e) {
      console.error("Fetch products error:", e);
      setError(`Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategorys = async () => {
    try {
      const list = await CategoryService.getAllCategorys();

      console.log("Fetched categories:", list);

      if (!list || !Array.isArray(list)) {
        throw new Error("API không trả về mảng danh mục");
      }

      const mapped = list.map((item) => ({
        id: String(item.id),
        name: item.name,
        imageUrl: item.image_url ? storageUrl(item.image_url) : null,
      }));

      setCategorys(mapped);
    } catch (e) {
      console.error("Fetch categories error:", e);
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, limit,searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLimit(10);
    setHasMore(true);
    fetchProducts();
  }, [categoryId]);

  const handleCategoryPress = (id) => {
    setCategoryId(id);
    setLimit(20);
    setHasMore(true);
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    setLimit(20);
    setHasMore(true);
  };

  const loadMore = () => {
    if (!loading) {
      setLimit((prevLimit) => prevLimit + 6);
    }
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E60023" />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <SearchBar onSearch={handleSearch} />
      {/* Danh sách danh mục */}
      <View style={styles.categorySection}>
        <Text style={styles.title}> Danh mục</Text>
        <FlatList
          data={[{ id: null, name: "Tất cả", imageUrl: null }, ...categorys]}
          keyExtractor={(item) => String(item.id ?? "all")}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              item={item}
              isActive={categoryId === item.id}
              onPress={() => handleCategoryPress(item.id)}
            />
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        
        <Text style={styles.title}>
      
            {searchQuery
            ? `Kết quả: "${searchQuery}"`
            : categoryId
            ? categorys.find((c) => c.id === categoryId)?.name || "Sản phẩm"
            : "Tất cả sản phẩm"}
            
        </Text>
        <Text style={styles.countText}>{products.length} mặt hàng</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchProducts()}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {products.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có sản phẩm nào trong danh mục này
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <ProductCard item={item} />}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 4 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            products.length > 0 ? (
              <LoadMoreFooter
                loading={loading}
                onLoadMore={loadMore}
                hasMore={hasMore}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  countText: {
    fontSize: 13,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: "#FF3B30",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#E60023",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryList: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
});
