// components/Banner.js
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import BannerService from "../services/BannerService";
import { storageUrl } from "../config/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

const FALLBACK_BANNERS = [
  require("../assets/banner/banner_sale1.webp"),
];

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollRef = useRef(null);

  const fetchBanners = async () => {
    try {
      setError(null);
      setLoading(true);

      const list = await BannerService.getAllBanners();

      const mapped = list.map((item) => ({
        id: String(item.id),
        name: item.name,
        imageUrl: storageUrl(item.image_url),
      }));

      setBanners(mapped);
    } catch (e) {
      console.log("Fetch banners error:", e.message);
      setError("Không tải được banner.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const arr = banners.length > 0 ? banners : FALLBACK_BANNERS;

  // AUTO SLIDE
  useEffect(() => {
    let interval = setInterval(() => {
      let nextIndex = activeIndex + 1;

      if (nextIndex >= arr.length) {
        nextIndex = 0;
      }

      scrollRef.current?.scrollTo({
        x: nextIndex * CARD_WIDTH,
        animated: true,
      });

      setActiveIndex(nextIndex);
    }, 3000); // 👉 đổi thời gian nếu muốn (ms)

    return () => clearInterval(interval);
  }, [activeIndex, arr.length]);

  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CARD_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Đang tải banner...</Text>
        </View>
      )}

      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {arr.map((banner, index) =>
          banners.length > 0 ? (
            <Image
              key={index}
              source={{ uri: banner.imageUrl }}
              style={styles.bannerImage}
            />
          ) : (
            <Image
              key={index}
              source={banner}
              style={styles.bannerImage}
            />
          )
        )}
      </ScrollView>

      {/* DOT INDICATOR */}
      <View style={styles.dotsRow}>
        {arr.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {error && !loading && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 20,
  },
  bannerImage: {
    width: CARD_WIDTH,
    height: 150,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
  },
  dotActive: {
    width: 16,
    backgroundColor: "#111",
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 4,
  },
});
