import axiosClient from "./axiosClient";

export default {
  getAll: () => axiosClient.get("/commands"),
  create: (data) => axiosClient.post("/commands", data),
  update: (id, data) => axiosClient.put(`/commands/${id}`, data),
  delete: (id) => axiosClient.delete(`/commands/${id}`),
};
