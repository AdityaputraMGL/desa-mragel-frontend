import {
  Calendar,
  CheckCircle,
  Filter,
  Image as ImageIcon,
  MessageSquare,
  PlayCircle,
  Upload,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const KelolaPengaduan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("semua");

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [tanggapanAdmin, setTanggapanAdmin] = useState("");
  const [fotoHasil, setFotoHasil] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/pengaduan/admin/all");
      setData(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const handleProses = async (id) => {
    const toastId = toast.loading("Mengubah status ke Proses...");
    try {
      await api.put(`/pengaduan/${id}/status`, { status: "diproses" });
      toast.success("Pengaduan sedang diproses", { id: toastId });
      fetchData();
    } catch (error) {
      toast.error("Gagal mengubah status", { id: toastId });
    }
  };

  const openModalSelesai = (id) => {
    setSelectedId(id);
    setTanggapanAdmin("");
    setFotoHasil(null);
    setShowModal(true);
  };

  const handleSelesaiSubmit = async (e) => {
    e.preventDefault();
    if (!tanggapanAdmin) {
      toast.error("Tanggapan wajib diisi!");
      return;
    }

    setProcessing(true);
    const toastId = toast.loading("Menyelesaikan pengaduan...");
    try {
      const formData = new FormData();
      formData.append("status", "selesai");
      formData.append("tanggapan", tanggapanAdmin);

      if (fotoHasil) {
        formData.append("foto_hasil", fotoHasil);
      }

      await api.put(`/pengaduan/${selectedId}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Pengaduan berhasil diselesaikan!", { id: toastId });
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error submit selesai:", error);
      toast.error("Gagal menyelesaikan pengaduan", { id: toastId });
    } finally {
      setProcessing(false);
    }
  };

  const filteredData = data.filter((item) =>
    filter === "semua" ? true : item.status === filter,
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "diproses":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "selesai":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    // 👇 Padding p-4 di HP, p-8 di Desktop
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Kotak Pengaduan Warga
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Kelola laporan dan aspirasi masyarakat Desa
            </p>
          </div>
        </div>

        {/* 👇 Filter Tabs dibikin overflow-x-auto biar bisa discroll di HP 👇 */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 mb-6 flex overflow-x-auto custom-scrollbar gap-2 w-full">
          {["semua", "menunggu", "diproses", "selesai"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors flex-shrink-0 ${
                filter === status
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status === "semua" && <Filter className="w-4 h-4 mr-2 inline" />}
              {status}
            </button>
          ))}
        </div>

        {/* List Pengaduan */}
        <div className="space-y-4 md:space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 mx-2 md:mx-0">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Belum ada pengaduan
              </h3>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id_pengaduan}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    {/* INFO KIRI */}
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                          {item.kategori || "Umum"}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2 break-words">
                        {item.judul}
                      </h3>

                      <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-500 mb-4 gap-x-4 gap-y-2">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1.5" />{" "}
                          {item.user?.penduduk?.nama_lengkap || "Warga"}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5" />{" "}
                          {new Date(item.created_at).toLocaleDateString(
                            "id-ID",
                            { dateStyle: "long" },
                          )}
                        </span>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line mb-4 break-words">
                        {item.isi_pengaduan}
                      </div>

                      {/* AREA FOTO BUKTI (Dari Warga) & FOTO HASIL (Dari Admin) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.foto_bukti && (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg">
                            <p className="text-xs font-bold text-red-600 mb-2 flex items-center">
                              <ImageIcon size={14} className="mr-1" /> BUKTI
                              DARI WARGA:
                            </p>
                            <img
                              src={`http://localhost:5000/public/uploads/pengaduan/${item.foto_bukti}`}
                              alt="Bukti Warga"
                              className="h-40 sm:h-32 w-full object-cover rounded-md cursor-pointer hover:opacity-90"
                              onClick={() =>
                                window.open(
                                  `http://localhost:5000/public/uploads/pengaduan/${item.foto_bukti}`,
                                  "_blank",
                                )
                              }
                            />
                          </div>
                        )}

                        {item.status === "selesai" && (
                          <div className="bg-green-50 p-3 border border-green-200 rounded-lg">
                            <p className="text-xs font-bold text-green-700 mb-2 flex items-center">
                              <CheckCircle size={14} className="mr-1" /> HASIL
                              TINDAKAN ADMIN:
                            </p>
                            {item.foto_hasil ? (
                              <img
                                src={`http://localhost:5000/public/uploads/pengaduan/${item.foto_hasil}`}
                                alt="Bukti Hasil"
                                className="h-40 sm:h-32 w-full object-cover rounded-md cursor-pointer hover:opacity-90 border border-green-300"
                                onClick={() =>
                                  window.open(
                                    `http://localhost:5000/public/uploads/pengaduan/${item.foto_hasil}`,
                                    "_blank",
                                  )
                                }
                              />
                            ) : (
                              <div className="h-40 sm:h-32 flex items-center justify-center border border-dashed border-green-300 rounded-md text-xs text-green-600 bg-white text-center p-2">
                                Tindakan selesai (Tanpa Lampiran Foto)
                              </div>
                            )}
                            {item.tanggapan && (
                              <p className="text-sm text-green-800 mt-2 bg-white p-2.5 rounded border border-green-100 break-words">
                                "{item.tanggapan}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* TOMBOL AKSI KANAN */}
                    <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[160px] mt-2 md:mt-0">
                      {item.status === "menunggu" && (
                        <button
                          onClick={() => handleProses(item.id_pengaduan)}
                          className="w-full flex items-center justify-center px-4 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm"
                        >
                          <PlayCircle className="w-5 h-5 md:w-4 md:h-4 mr-2" />{" "}
                          Proses
                        </button>
                      )}

                      {item.status === "diproses" && (
                        <button
                          onClick={() => openModalSelesai(item.id_pengaduan)}
                          className="w-full flex items-center justify-center px-4 py-3 md:py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-sm"
                        >
                          <CheckCircle className="w-5 h-5 md:w-4 md:h-4 mr-2" />{" "}
                          Selesaikan
                        </button>
                      )}

                      {item.status === "selesai" && (
                        <div className="text-center py-2.5 md:py-2 px-4 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="flex items-center justify-center text-green-600 font-bold text-sm">
                            <CheckCircle className="w-5 h-5 md:w-4 md:h-4 mr-2" />{" "}
                            Tuntas
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MODAL INPUT TANGGAPAN & UPLOAD HASIL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* 👇 max-h-[90vh] dan flex-col agar isi form bisa discroll kalau kepanjangan di HP 👇 */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-green-600 px-5 md:px-6 py-4 flex justify-between items-center flex-shrink-0">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center">
                <CheckCircle className="mr-2 w-5 h-5 md:w-6 md:h-6" />{" "}
                Konfirmasi Penyelesaian
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-green-100 hover:text-white p-1"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSelesaiSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800 leading-relaxed">
                  Silakan tulis komentar/tanggapan. Anda juga dapat mengunggah
                  foto bukti (opsional) bahwa laporan ini sudah dikerjakan.
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tanggapan / Komentar Admin{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Contoh: Tim sudah ke lokasi dan jalan berlubang sudah ditambal..."
                    value={tanggapanAdmin}
                    onChange={(e) => setTanggapanAdmin(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Upload Foto Hasil Tindakan (Opsional)
                  </label>
                  <div className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 flex items-center overflow-hidden">
                    <Upload
                      size={18}
                      className="text-gray-500 mr-2 flex-shrink-0"
                    />
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => setFotoHasil(e.target.files[0])}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 👇 Tombol dibuat flex-col-reverse di HP biar tombol utama (Setujui) ada di atas 👇 */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-3 flex-shrink-0 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center transition-colors shadow-md disabled:opacity-50"
                >
                  {processing ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <CheckCircle size={18} className="mr-2" /> Setujui &
                      Selesai
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaPengaduan;
