import api from "./api";

const pengajuanService = {
  // --- USER FUNCTIONS ---

  getJenisSurat: async () => {
    const response = await api.get("/pengajuan/jenis-surat");
    return response.data;
  },

  getMyPengajuan: async (params = {}) => {
    const response = await api.get("/pengajuan/my", { params });
    return response.data;
  },

  createPengajuan: async (data) => {
    const response = await api.post("/pengajuan", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // --- ADMIN FUNCTIONS ---

  getAllPengajuan: async (params = {}) => {
    try {
      const response = await api.get("/pengajuan/admin/all", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✅ TAMBAHKAN FUNCTION INI (Yang penting!)
  getPengajuanById: async (id) => {
    try {
      const response = await api.get(`/pengajuan/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStatistics: async () => {
    try {
      const response = await api.get("/pengajuan/admin/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateStatus: async (id, data) => {
    try {
      const response = await api.put(`/pengajuan/${id}/status`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✅ TAMBAHKAN JUGA FUNCTION DELETE (opsional tapi bagus untuk lengkap)
  deletePengajuan: async (id) => {
    try {
      const response = await api.delete(`/pengajuan/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default pengajuanService;
