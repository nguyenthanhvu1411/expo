import httpAxios from "./httpAxios";

const ProductService = {
    // getAllProducts: async (data) => {
    //     const res = await httpAxios.get("/product-list", { params: data });
    //     return res.data.products;
    // },
     getAllProducts: async (params) => {
    const res = await httpAxios.get("/product-list", { params });
    return res.data.products;
  },

  // ✅ Sản phẩm mới
  getNewProducts: (limit = 10) =>
    ProductService.getAllProducts({ type: "new", limit }),

  // ✅ Sản phẩm xem nhiều nhất
  // (backend nhận type = "most_view")
  getMostViewedProducts: (limit = 10) =>
    ProductService.getAllProducts({ type: "most_view", limit }),

  // ✅ Sản phẩm popular
  getPopularProducts: (limit = 10) =>
    ProductService.getAllProducts({ type: "popular", limit }),

  // ✅ Sản phẩm khuyến mại
  getSaleProducts: (limit = 10) =>
    ProductService.getAllProducts({ type: "sale", limit }),

};
export default ProductService;