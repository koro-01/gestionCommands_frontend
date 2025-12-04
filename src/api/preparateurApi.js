import axiosClient from "./axiosClient";

export default {
  getAll: () => axiosClient.get("/preparateurs"),
  create: (data) => axiosClient.post("/preparateurs", data),
  update: (id, data) => axiosClient.put(`/preparateurs/${id}`, data),
  delete: (id) => axiosClient.delete(`/preparateurs/${id}`),
};
