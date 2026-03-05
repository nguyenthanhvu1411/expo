import { Tabs } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useCart } from "../../contexts/CartContext";
import { AuthProvider } from "../../contexts/AuthContext";

export default function Layout() {
  const { totalQty } = useCart(); 
  return (
    <AuthProvider>
      <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          headerShown: false,
          tabBarIcon: () => <FontAwesome5 name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Sản phẩm",
          headerShown: false,
          tabBarIcon: () => <FontAwesome5 name="th-large" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          headerShown: false,
          tabBarIcon: () => <FontAwesome5 name="shopping-cart" size={24} color="black" />,
          tabBarBadge: totalQty > 0 ? totalQty : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#E60023",
            color: "#fff",
            fontWeight: "800",
          },
        }}
        
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
          headerShown: false,
          tabBarIcon: () => <FontAwesome5 name="user-circle" size={24} color="black" />,
        }}
      />
    </Tabs>
    </AuthProvider>
  );
}
