import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  Plus,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../services/api";
import pengajuanService from "../../services/pengajuanService";

const Riwayat = () => {
  // --- STATE UTAMA ---
  const [activeTab, setActiveTab] = useState("surat"); // 'surat' atau 'pengaduan'
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE FILTER & SEARCH ---
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE MODAL DETAIL ---
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- FETCH DATA (Tergantung Tab yang Aktif) ---
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let response;

      if (activeTab === "surat") {
        // Ambil Riwayat Surat
        response = await pengajuanService.getMyPengajuan();
        setDataList(response.data || []);
      } else {
        // Ambil Riwayat Pengaduan
        const res = await api.get("/pengaduan/my-pengaduan");
        setDataList(res.data.data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      toast.error(`Gagal memuat riwayat ${activeTab}`);
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE DETAIL (Modal) ---
  const handleDetail = async (id) => {
    try {
      setLoadingDetail(true);
      const endpoint =
        activeTab === "surat" ? `/pengajuan-surat/${id}` : `/pengaduan/${id}`;

      const response = await api.get(endpoint);

      if (response.data.success) {
        setSelectedItem(response.data.data);
        setShowModal(true);
      } else {
        toast.error("Gagal memuat detail data");
      }
    } catch (error) {
      console.error("Error fetching detail:", error);
      toast.error("Terjadi kesalahan saat mengambil detail");
    } finally {
      setLoadingDetail(false);
    }
  };

  // --- LOGIKA BARU: PAKSA DOWNLOAD SURAT ASLI ---
  // Fungsi
  const handleDownloadSurat = async (idPengajuan, namaSurat) => {
    if (!idPengajuan) {
      toast.error("Maaf, Surat Asli belum diunggah oleh Admin.");
      return;
    }
    const toastId = toast.loading("Mengunduh file...");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://desa-mragel-backend.vercel.app/api/pengajuan/${idPengajuan}/download`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!response.ok) throw new Error("Gagal download");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Surat-${(namaSurat || "Desa").replace(/\s+/g, "_")}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Surat berhasil diunduh!", { id: toastId });
    } catch (error) {
      toast.error("Gagal mengunduh file.", { id: toastId });
    }
  };

  // --- HELPER STATUS BADGE ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "menunggu":
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> Menunggu
          </span>
        );
      case "diproses":
      case "sedang_ditangani":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" /> Diproses
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Selesai
          </span>
        );
      case "ditolak":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // --- FILTER LOGIC ---
  const filteredData = dataList.filter((item) => {
    const matchStatus = filterStatus ? item.status === filterStatus : true;

    let matchSearch = false;
    if (activeTab === "surat") {
      matchSearch =
        (item.nomor_pengajuan?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (item.jenisSurat?.nama_surat?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        );
    } else {
      matchSearch =
        (item.judul?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.isi_pengaduan?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        );
    }

    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Riwayat Aktivitas
            </h1>
            <p className="text-gray-600 mt-1">
              Pantau status pengajuan surat dan pengaduan Anda
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <Link
              to="/user/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gray-100 border border-transparent rounded-lg font-medium text-gray-700 hover:bg-gray-200 shadow-sm transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
            </Link>
            {activeTab === "surat" ? (
              <Link
                to="/user/pengajuan-surat"
                className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-medium text-white hover:bg-primary-700 shadow-sm transition"
              >
                <Plus className="w-5 h-5 mr-2" /> Buat Pengajuan
              </Link>
            ) : (
              <Link
                to="/user/buat-pengaduan"
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-lg font-medium text-white hover:bg-green-700 shadow-sm transition"
              >
                <Plus className="w-5 h-5 mr-2" /> Buat Pengaduan
              </Link>
            )}
          </div>
        </div>

        {/* --- TABS SWITCHER --- */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex mb-6">
          <button
            onClick={() => setActiveTab("surat")}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "surat" ? "bg-primary-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <FileText className="w-4 h-4 mr-2" /> Riwayat Surat
          </button>
          <button
            onClick={() => setActiveTab("pengaduan")}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "pengaduan" ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Riwayat Pengaduan
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={
                  activeTab === "surat"
                    ? "Cari nomor surat atau jenis..."
                    : "Cari judul atau isi pengaduan..."
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center">
              {activeTab === "surat" ? (
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              ) : (
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              )}
              <h3 className="text-lg font-medium text-gray-900">
                Belum ada data
              </h3>
              <p className="text-gray-500 mt-1 mb-6">
                Data tidak ditemukan atau belum pernah membuat pengajuan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Header Tabel Berubah Sesuai Tab */}
                    {activeTab === "surat" ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nomor & Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jenis Surat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keperluan
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Lapor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Judul Laporan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Isi Singkat
                        </th>
                      </>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr
                      key={
                        activeTab === "surat"
                          ? item.id_pengajuan
                          : item.id_pengaduan
                      }
                      className="hover:bg-gray-50 transition"
                    >
                      {activeTab === "surat" ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.nomor_pengajuan}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(
                                item.tanggal_pengajuan,
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.jenisSurat?.nama_surat ||
                                "Jenis Surat Dihapus"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Kode: {item.jenisSurat?.kode_surat}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className="text-sm text-gray-900 max-w-xs truncate"
                              title={item.keterangan || item.catatan}
                            >
                              {item.keterangan || item.catatan || "-"}
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.judul}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 uppercase">
                              {item.kategori}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {item.isi_pengaduan}
                            </div>
                          </td>
                        </>
                      )}

                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                        {/* TOMBOL DOWNLOAD FILE HASIL DITABEL */}
                        {activeTab === "surat" && item.status === "selesai" && (
                          <button
                            onClick={() =>
                              handleDownloadSurat(
                                item.id_pengajuan,
                                item.jenisSurat?.nama_surat,
                              )
                            }
                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg transition-colors"
                            title="Download Surat Asli (Sudah TTD)"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDetail(
                              activeTab === "surat"
                                ? item.id_pengajuan
                                : item.id_pengaduan,
                            )
                          }
                          className="text-primary-600 hover:text-primary-900 bg-primary-50 p-2 rounded-lg transition-colors"
                          title="Lihat Detail"
                          disabled={loadingDetail}
                        >
                          {loadingDetail ? (
                            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DETAIL --- */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Detail{" "}
                  {activeTab === "surat"
                    ? "Pengajuan Surat"
                    : "Laporan Pengaduan"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === "surat"
                    ? `Nomor: ${selectedItem.nomor_pengajuan}`
                    : `Kategori: ${selectedItem.kategori}`}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  Status Terkini
                </span>
                {getStatusBadge(selectedItem.status)}
              </div>

              {activeTab === "surat" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Jenis Surat
                      </label>
                      <p className="font-medium">
                        {selectedItem.jenisSurat?.nama_surat ||
                          selectedItem.jenis_surat}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                        Tanggal
                      </label>
                      <p className="font-medium">
                        {new Date(
                          selectedItem.tanggal_pengajuan ||
                            selectedItem.created_at,
                        ).toLocaleDateString("id-ID", { dateStyle: "full" })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold border-b pb-2 mb-3">
                      Keperluan
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                      {selectedItem.keterangan || selectedItem.catatan || "-"}
                    </div>
                  </div>

                  {selectedItem.status === "selesai" &&
                    selectedItem.file_hasil && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-green-900">
                            Surat Asli Tersedia
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Surat ini telah disetujui dan ditandatangani oleh
                            Kades.
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            handleDownloadSurat(
                              selectedItem.id_pengajuan,
                              selectedItem.jenisSurat?.nama_surat ||
                                selectedItem.jenis_surat,
                            )
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center"
                        >
                          <Download className="w-4 h-4 mr-2" /> Download
                        </button>
                      </div>
                    )}
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Judul Laporan
                    </label>
                    <h4 className="text-lg font-bold text-gray-900">
                      {selectedItem.judul}
                    </h4>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Isi Laporan
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedItem.isi_pengaduan}
                    </div>
                  </div>

                  {selectedItem.foto_bukti && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        Foto Bukti Laporan (Dari Warga)
                      </label>
                      {/* 👇 DITAMBAH /public/ DI SINI 👇 */}
                      <img
                        src={
                          selectedItem.foto_bukti?.startsWith("http")
                            ? selectedItem.foto_bukti
                            : `https://desa-mragel-backend.vercel.app/public/uploads/pengaduan/${selectedItem.foto_bukti}`
                        }
                        alt="Bukti Warga"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}

                  {/* TAMPILAN TANGGAPAN DAN FOTO HASIL ADMIN */}
                  {(selectedItem.tanggapan || selectedItem.foto_hasil) && (
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 mt-4">
                      <h5 className="text-blue-800 font-bold text-sm mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" /> Tindakan &
                        Tanggapan Petugas
                      </h5>

                      {selectedItem.foto_hasil && (
                        <div className="mb-4">
                          <p className="text-xs font-bold text-blue-700 uppercase mb-2">
                            Foto Hasil Tindakan:
                          </p>
                          {/* 👇 DITAMBAH /public/ DI SINI JUGA 👇 */}
                          <img
                            src={
                              selectedItem.foto_hasil?.startsWith("http")
                                ? selectedItem.foto_hasil
                                : `https://desa-mragel-backend.vercel.app/public/uploads/pengaduan/${selectedItem.foto_hasil}`
                            }
                            alt="Bukti Tindakan Petugas"
                            className="w-full h-64 object-cover rounded-lg border border-blue-300 shadow-sm"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        </div>
                      )}

                      {selectedItem.tanggapan && (
                        <div>
                          <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                            Komentar / Laporan Petugas:
                          </p>
                          <div className="text-blue-900 text-sm bg-white p-3 rounded-lg border border-blue-100 leading-relaxed">
                            "{selectedItem.tanggapan}"
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riwayat;
