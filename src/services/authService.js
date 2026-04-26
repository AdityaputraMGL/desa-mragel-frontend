import api from "./api";

// Service untuk menangani Login, Register, dan Profil
const authService = {
  // 1. LOGIN
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // 2. REGISTER
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // 3. LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // 4. GET CURRENT USER (Dari LocalStorage)
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // 👇 FITUR BARU: UPDATE PROFIL
  updateProfile: async (data) => {
    // Mengirim request PUT ke backend
    const response = await api.put("/auth/profile", data);

    // Kita perlu update data di LocalStorage juga biar datanya sinkron tanpa perlu login ulang
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Gabungkan data lama dengan data baru (hanya update field yang berubah)
    const updatedUser = {
      ...currentUser,
      penduduk: {
        ...currentUser.penduduk,
        nama_lengkap: data.nama_lengkap || currentUser.penduduk.nama_lengkap,
        alamat_lengkap:
          data.alamat_lengkap || currentUser.penduduk.alamat_lengkap,
        pekerjaan: data.pekerjaan || currentUser.penduduk.pekerjaan,
      },
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    return response.data;
  },

  // 👇 FITUR BARU: GANTI PASSWORD
  changePassword: async (data) => {
    // Mengirim request PUT ke backend
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },
};

export default authService;
