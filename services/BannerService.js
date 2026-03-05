import httpAxios from "./httpAxios";

const BannerService = {
    getAllBanners: async () => {
        const res = await httpAxios.get("/banner-list");
        return res.data.banners;
    },
};
export default BannerService;