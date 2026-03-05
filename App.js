import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "./components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import Banner from "./components/Banner";
import Category from "./components/Category";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView>
        <StatusBar barStyle="dark-content" />
        
        <Banner />
        <Category />
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
