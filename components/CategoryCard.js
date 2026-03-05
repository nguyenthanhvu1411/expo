import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const CategoryCard = ({ item, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.categoryCard, isActive && styles.categoryCardActive]}
      onPress={onPress}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.categoryImage, styles.categoryImagePlaceholder]}>
          <Text style={styles.categoryImagePlaceholderText}>📦</Text>
        </View>
      )}
      <Text
        style={[styles.categoryName, isActive && styles.categoryNameActive]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    minWidth: 80,
    elevation: 1,
  },
  categoryCardActive: {
    backgroundColor: "#E60023",
    elevation: 3,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  categoryImagePlaceholder: {
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryImagePlaceholderText: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  categoryNameActive: {
    color: "#fff",
  },
});

export default CategoryCard;