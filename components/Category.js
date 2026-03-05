// components/Category.js
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import CategoryGrid from "./CategoryGrid";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Category() {
  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Danh mục</Text>

        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
          <FontAwesome5 name="chevron-right" size={12} color="#fff" />
        </TouchableOpacity>
      </View>

      <CategoryGrid />
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 18,
    marginBottom: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  seeAllText: {
    fontSize: 13,
    color: "#fff",
    marginRight: 5,
    fontWeight: "600",
  },
});
