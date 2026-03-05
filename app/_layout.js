import { Stack } from "expo-router";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";
export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="account"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="cart"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="product"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
