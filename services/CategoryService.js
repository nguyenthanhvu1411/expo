import httpAxios from "./httpAxios";

const CategoryService = {
    getAllCategorys: async () => {
        const res = await httpAxios.get("/category-list");
        return res.data.categorys;
    },
};
export default CategoryService;