import httpAxios from "./httpAxios";

const CheckoutService = {
  /**
   * Tạo đơn hàng mới
   */
  createOrder: async (orderData) => {
    try {
      const res = await httpAxios.post("/order-create", orderData);
      return res.data;
    } catch (error) {
      console.error("Create order error:", error.response?.data || error);
      throw error;
    }
  },

  /**
   * Lấy danh sách đơn hàng của user
   */
  getUserOrders: async (userId) => {
    try {
      const res = await httpAxios.get(`/user-orders/${userId}`);
      return res.data.orders;
    } catch (error) {
      console.error("Get user orders error:", error.response?.data || error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết đơn hàng
   */
  getOrderDetail: async (orderId) => {
    try {
      const res = await httpAxios.get(`/order-detail/${orderId}`);
      return res.data.order;
    } catch (error) {
      console.error("Get order detail error:", error.response?.data || error);
      throw error;
    }
  },

  /**
   * Lấy tất cả đơn hàng (admin)
   */
  getAllOrders: async (params = {}) => {
    try {
      const res = await httpAxios.get("/orders", { params });
      return res.data.orders;
    } catch (error) {
      console.error("Get all orders error:", error.response?.data || error);
      throw error;
    }
  },

  /**
   * Xóa đơn hàng
   */
  deleteOrder: async (orderId) => {
    try {
      const res = await httpAxios.delete(`/order-delete/${orderId}`);
      return res.data;
    } catch (error) {
      console.error("Delete order error:", error.response?.data || error);
      throw error;
    }
  },
};

export default CheckoutService;