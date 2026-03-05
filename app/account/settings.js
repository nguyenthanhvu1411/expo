import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cài đặt</Text>

      {/* Thông báo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông báo</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <FontAwesome5 name="bell" size={18} color="#111" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowTitle}>Thông báo đẩy</Text>
              <Text style={styles.rowSub}>
                Nhận thông báo về đơn hàng và khuyến mãi
              </Text>
            </View>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            thumbColor={pushEnabled ? "#fff" : "#fff"}
            trackColor={{ false: "#ccc", true: "#111" }}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giao diện</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <FontAwesome5 name="moon" size={18} color="#111" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowTitle}>Dark mode</Text>
              <Text style={styles.rowSub}>Dùng giao diện tối màu</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? "#fff" : "#fff"}
            trackColor={{ false: "#ccc", true: "#111" }}
          />
        </View>
      </View>

      {/* Ngôn ngữ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ngôn ngữ</Text>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <FontAwesome5 name="globe" size={18} color="#111" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowTitle}>Ngôn ngữ</Text>
              <Text style={styles.rowSub}>Tiếng Việt</Text>
            </View>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Vùng nguy hiểm */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>

        <TouchableOpacity style={styles.logoutRow}>
          <FontAwesome5 name="sign-out-alt" size={18} color="#e53935" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#777",
    marginBottom: 8,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowTextBox: {
    marginLeft: 10,
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  rowSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#fdecea",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#e53935",
  },
});
