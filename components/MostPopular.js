import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import ProductService from "../services/ProductService";
import { storageUrl } from "../config/api";

function ProductCard({ item, onPress }) {
  const hasDiscount =
    item.price_discount &&
    item.price_discount > 0 &&
    item.price_discount < item.price;

  const finalPrice = hasDiscount ? item.price_discount : item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.price - item.price_discount) / item.price) * 100)
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: storageUrl(item.image_url) }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardPrice}>
            {finalPrice?.toLocaleString()}₫
          </Text>
          {hasDiscount && (
            <Text style={styles.cardTag}>-{discountPercent}%</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MostPopular() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ProductService.getPopularProducts(10);
        setProducts(data);
      } catch (err) {
        console.log("MostPopular error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Most Popular</Text>
          <View style={styles.seeAllRow}>
            <Text style={styles.seeAll}>See All</Text>

            <TouchableOpacity style={styles.arrowBtn}>
              <Image
                source={require("../assets/Arrow.png")}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 10 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                onPress={() => router.push(`/product/${item.id}`)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  seeAllRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  seeAll: {
    fontSize: 16,
    color: "#000000ff",
    marginRight: 8,
    fontWeight: "600",
  },

  arrowBtn: {
    width: 32,
    height: 32,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },

  arrowIcon: {
    width: 14,
    height: 14,
    tintColor: "#fff",
  },

  card: {
    width: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    padding: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  cardTag: {
    fontSize: 12,
    color: "#FF3B30",
  },
});
