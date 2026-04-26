import axios from "axios";

const api = axios.create({
  baseURL: "https://desa-mragel-backend.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const downloadSurat = async (id, namaFile) => {
  try {
    const response = await api.get(`/pengajuan-surat/cetak/${id}`, {
      responseType: "blob", // <--- INI KUNCI RAHASIANYA! (Wajib ada)
    });

    // Cek apakah yang dikirim beneran file, bukan JSON error
    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("application/json")) {
      // Kalau ternyata isinya JSON (berarti error), kita lempar errornya
      throw new Error("Gagal download: Server mengirim JSON bukan PDF");
    }

    // Proses download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", namaFile || `Surat-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Gagal download surat:", error);
    throw error;
  }
};

export const IMAGE_URL =
  "https://desa-mragel-backend.vercel.app/uploads/berita/";

export default api;
