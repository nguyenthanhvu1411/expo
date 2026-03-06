import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Category from "./components/Category";
import TopProducts from "./components/TopProducts";
import NewProducts from "./components/NewProducts";
import FlashSale from "./components/FlashSale";
import MostPopular from "./components/MostPopular";
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        <Banner />
        <Category />
        <TopProducts />
        <NewProducts />
        <FlashSale />
        <MostPopular />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
});
