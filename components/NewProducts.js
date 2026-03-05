import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import ProductGrid from "./ProductGrid";

export default function NewProducts() {
  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.title}>New Items</Text>
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
      <ProductGrid />
    </>
  );
}

const styles = StyleSheet.create({
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
});
