import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../contexts/CartContext";

const CARD_WIDTH = 170;

export default function ProductCard({ item }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddCart = (e) => {
    e.stopPropagation();
    addToCart(item, 1);
    console.log("Added to cart:", item.id);
    alert("Đã thêm sản phẩm vào giỏ hàng");
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageBox}>
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>
            {Math.round(
              ((item.price - item.price_discount) / item.price) * 100
            )}
            % OFF
          </Text>
        </View>
        <TouchableOpacity style={styles.favIcon}>
          <Text>♡</Text>
        </TouchableOpacity>
        <Image source={{ uri: item.imageUrl }} style={styles.img} />
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{item.price_discount.toLocaleString()}</Text>
        <Text style={styles.oldPrice}>{item.price.toLocaleString()}</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={handleAddCart}>
        <Text style={styles.addBtnText}>Add to cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: "47%", marginBottom: 20 },
  imageBox: {
    height: 180,
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  img: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  discountTag: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  discountText: {
    fontSize: 10,
    color: "#888",
  },
  favIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  name: {
    marginTop: 10,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  price: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#E60023",
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#BBB",
    fontSize: 12,
  },
  addBtn: {
    marginTop: 10,
    backgroundColor: "#888",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  addBtnText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
