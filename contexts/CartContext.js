// app/context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// Key cho giỏ hàng guest (chưa đăng nhập)
const GUEST_CART_KEY = "@guest_cart_items";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy cart key dựa vào user
  const getCartKey = () => {
    return user?.id ? `@cart_items_${user.id}` : GUEST_CART_KEY;
  };

  // Load giỏ hàng khi user thay đổi hoặc app khởi động
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);

      try {
        const cartKey = getCartKey();
        const json = await AsyncStorage.getItem(cartKey);
        
        if (json) {
          const loadedCart = JSON.parse(json);
          setCart(loadedCart);
          console.log(`✅ Loaded cart from key "${cartKey}":`, loadedCart.length, "items");
        } else {
          setCart([]);
          console.log(`📦 No cart found for key "${cartKey}"`);
        }
      } catch (e) {
        console.error("❌ Error loading cart:", e);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user?.id]); // Reload khi user ID thay đổi

  // Lưu cart vào AsyncStorage khi cart thay đổi
  useEffect(() => {
    const saveCart = async () => {
      // Chỉ lưu khi đã load xong
      if (loading) return;

      try {
        const cartKey = getCartKey();
        await AsyncStorage.setItem(cartKey, JSON.stringify(cart));
        console.log(`💾 Saved cart to key "${cartKey}":`, cart.length, "items");
      } catch (e) {
        console.error("❌ Error saving cart:", e);
      }
    };

    saveCart();
  }, [cart, user?.id, loading]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const pid = Number(product.id);
      const exist = prev.find((i) => Number(i.product_id) === pid);

      if (exist) {
        return prev.map((i) =>
          Number(i.product_id) === pid ? { ...i, qty: i.qty + qty } : i
        );
      }

      return [
        ...prev,
        {
          product_id: pid,
          name: product.name,
          price: product.price_discount ?? product.price,
          imageUrl: product.image_url || product.imageUrl || product.image,
          qty,
        },
      ];
    });
  };

  const increaseQty = (product_id) => {
    setCart((prev) =>
      prev.map((i) =>
        Number(i.product_id) === Number(product_id) ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  const decreaseQty = (product_id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          Number(i.product_id) === Number(product_id) ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (product_id) => {
    setCart((prev) => prev.filter((i) => Number(i.product_id) !== Number(product_id)));
  };

  const clearCart = async () => {
    const cartKey = getCartKey();
    try {
      await AsyncStorage.removeItem(cartKey);
      console.log(`🗑️ Cleared cart for key "${cartKey}"`);
    } catch (e) {
      console.error("❌ Clear cart error:", e);
    }
    setCart([]);
  };

  // Hàm chuyển giỏ hàng guest sang user (khi login)
  const transferGuestCartToUser = async (userId) => {
    try {
      // Lấy cart guest
      const guestCartJson = await AsyncStorage.getItem(GUEST_CART_KEY);
      
      if (guestCartJson) {
        const guestCart = JSON.parse(guestCartJson);
        
        // Lấy cart user hiện tại (nếu có)
        const userCartKey = `@cart_items_${userId}`;
        const userCartJson = await AsyncStorage.getItem(userCartKey);
        const userCart = userCartJson ? JSON.parse(userCartJson) : [];

        // Merge cart: ưu tiên cart guest, cộng dồn số lượng nếu trùng
        const mergedCart = [...userCart];
        
        guestCart.forEach(guestItem => {
          const existingIndex = mergedCart.findIndex(
            item => Number(item.product_id) === Number(guestItem.product_id)
          );
          
          if (existingIndex >= 0) {
            // Cộng dồn số lượng
            mergedCart[existingIndex].qty += guestItem.qty;
          } else {
            // Thêm mới
            mergedCart.push(guestItem);
          }
        });

        // Lưu cart đã merge vào user
        await AsyncStorage.setItem(userCartKey, JSON.stringify(mergedCart));
        
        // Xóa cart guest
        await AsyncStorage.removeItem(GUEST_CART_KEY);
        
        console.log(`🔄 Transferred guest cart (${guestCart.length} items) to user ${userId}`);
        console.log(`📦 Merged cart has ${mergedCart.length} items`);
        
        return mergedCart;
      }
    } catch (error) {
      console.error("❌ Error transferring guest cart:", error);
    }
    
    return null;
  };

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        transferGuestCartToUser,
        totalQty,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};