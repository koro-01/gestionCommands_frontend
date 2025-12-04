import axiosClient from "./axiosClient";

export default {
  getAll: () => axiosClient.get("/livreurs"),
  create: (data) => axiosClient.post("/livreurs", data),
  update: (id, data) => axiosClient.put(`/livreurs/${id}`, data),
  delete: (id) => axiosClient.delete(`/livreurs/${id}`),
};
