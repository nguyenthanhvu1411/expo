import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const LoadMoreFooter = ({ loading, onLoadMore, hasMore = true }) => {
  if (!hasMore) {
    return (
      <View style={styles.endContainer}>
        <Text style={styles.endText}> Bạn đã xem hết sản phẩm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#E60023" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={onLoadMore}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Xem thêm</Text>
          <Text style={styles.arrow}>↓</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#E60023",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  arrow: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  endContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  endText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
});

export default LoadMoreFooter;