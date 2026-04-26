import api from "./api";

const pendudukService = {
  getAll: async (params) => {
    const response = await api.get("/penduduk", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/penduduk", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/penduduk/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/penduduk/${id}`);
    return response.data;
  },
};

export default pendudukService;
