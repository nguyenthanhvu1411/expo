import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import ProductService from "../services/ProductService";
import { storageUrl } from "../config/api";
import ProductCard from "./ProductCard";
import { router } from "expo-router";

export default function Header({ onSearch }) {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userClosedPreview, setUserClosedPreview] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchText.trim().length < 2) {
        setSearchResults([]);
        setUserClosedPreview(false);
        if (onSearch) onSearch("");
        return;
      }

      try {
        setLoading(true);

        const list = await ProductService.getAllProducts({
          search: searchText,
          limit: 20,
        });

        if (list && Array.isArray(list)) {
          const mapped = list.map((item) => ({
            id: String(item.id),
            name: item.name,
            price: item.price,
            price_discount: item.price_discount ?? item.price,
            imageUrl: item.image_url ? storageUrl(item.image_url) : null,
          }));

          setSearchResults(mapped);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        console.error(e);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchProducts, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    setUserClosedPreview(false);
  }, [searchText]);

  const handleClear = () => {
    setSearchText("");
    setSearchResults([]);
    setShowResults(false);
    setUserClosedPreview(false);
    if (onSearch) onSearch("");
  };

  const handleCloseModal = () => {
    setShowResults(false);
    setUserClosedPreview(true);
  };

  const tryOpenPreview = () => {
    if (searchResults.length > 0 && !userClosedPreview) {
      setShowResults(true);
    }
  };

  const handleSubmit = () => {
    setUserClosedPreview(false);
    if (searchResults.length > 0) {
      setShowResults(true);
    }
    if (onSearch) onSearch(searchText);
  };

  const handleViewAll = () => {
    setShowResults(false);
    setUserClosedPreview(false);
    if (onSearch) onSearch(searchText);
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>SHOP</Text>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            placeholderTextColor="#999"
            onFocus={tryOpenPreview}
          />
          {loading && <ActivityIndicator size="small" color="#E60023" style={styles.loadingIcon} />}
          {searchText.length > 0 && !loading && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Text style={styles.clearIcon}>×</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showResults}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.resultsTitle} numberOfLines={1}>
                  Kết quả cho "{searchText}"
                </Text>
                <Text style={styles.resultsCount}>
                  {searchResults.length} sản phẩm
                </Text>
              </View>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => <ProductCard item={item} />}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
                  <Text style={styles.viewAllText}>Xem tất cả sản phẩm</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 1000,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    width: 68,
    height: 36,
    lineHeight: 36,
    color: "#E60023",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    flex: 1,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    padding: 0,
  },
  loadingIcon: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  clearIcon: {
    fontSize: 22,
    color: "#999",
    fontWeight: "400",
  },
  searchButton: {
    padding: 4,
    marginLeft: 4,
  },
  searchIcon: {
    fontSize: 18,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  overlayTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  resultsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "85%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  resultsHeader: {
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  closeIcon: {
    fontSize: 26,
    color: "#666",
    fontWeight: "400",
    lineHeight: 30,
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  viewAllButton: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#3a3838",
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 4,
    shadowColor: "#484848",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});