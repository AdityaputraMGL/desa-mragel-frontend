import { Check, Eye, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import pengajuanService from "../../services/pengajuanService";

const KelolaPengajuan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [fileHasil, setFileHasil] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pengajuanService.getAllPengajuan({
        status: filterStatus,
      });
      setData(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pengajuan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, catatan = "") => {
    if (newStatus === "selesai" && !fileHasil) {
      toast.error(
        "Wajib meng-upload File Surat Asli sebelum menyetujui pengajuan!",
      );
      return;
    }

    if (!window.confirm(`Yakin ingin mengubah status menjadi ${newStatus}?`))
      return;

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("catatan", catatan);

      if (newStatus === "selesai" && fileHasil) {
        formData.append("file_hasil", fileHasil);
      }

      await api.put(`/pengajuan-surat/${id}/status`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        `Pengajuan berhasil ${newStatus === "selesai" ? "disetujui" : "diupdate"}`,
      );

      setSelectedItem(null);
      setFileHasil(null);
      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Gagal update status",
      );
    } finally {
      setProcessing(false);
    }
  };

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short", // Dipendekkan agar muat di HP
        day: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  const getImageUrl = (filename) => {
    if (!filename) return null;
    return `https://desa-mragel-backend.vercel.app/public/uploads/syarat/${filename}`;
  };

  return (
    // 👇 Padding disesuaikan untuk HP (p-4) dan Laptop (md:p-6)
    <div className="p-4 md:p-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Kelola Pengajuan Surat
        </h1>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="menunggu">Menunggu Verifikasi</option>
          <option value="selesai">Selesai / Disetujui</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      {/* 👇 FIX UTAMA: Bungkus tabel dengan overflow-x-auto agar bisa digeser horizontal di HP 👇 */}
      <div className="bg-white rounded-lg shadow w-full overflow-hidden border border-gray-200">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider">
                  Pemohon
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider">
                  Jenis Surat
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    Belum ada pengajuan masuk.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id_pengajuan}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {item.user?.penduduk?.nama_lengkap ||
                          item.user?.email ||
                          "User"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        NIK: {item.user?.penduduk?.nik || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 min-w-[150px]">
                      {item.jenisSurat?.nama_surat}
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                      {formatTanggal(
                        item.tanggal ||
                          item.created_at ||
                          item.tanggal_pengajuan,
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.status === "menunggu" ? "bg-yellow-100 text-yellow-800" : item.status === "selesai" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={async () => {
                          try {
                            const response =
                              await pengajuanService.getPengajuanById(
                                item.id_pengajuan,
                              );
                            setSelectedItem(response.data);
                          } catch (error) {
                            toast.error("Gagal memuat detail");
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 👇 MODAL DETAIL 👇 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          {/* Di HP max-h-full biar bisa di-scroll penuh */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate pr-4">
                Detail: {selectedItem.nomor_pengajuan}
              </h3>
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setFileHasil(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Area Konten Modal yang bisa di-scroll */}
            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kolom Kiri: Data Text */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Jenis Surat
                    </h4>
                    <p className="font-medium text-gray-900 text-lg">
                      {selectedItem.jenisSurat?.nama_surat ||
                        selectedItem.jenis_surat}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
                      Keperluan
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3.5 rounded-lg border border-gray-100 leading-relaxed text-sm">
                      {selectedItem.keperluan || selectedItem.keterangan || "-"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Data Pemohon
                    </h4>
                    {selectedItem.details && selectedItem.details.length > 0 ? (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {selectedItem.details.map((item, index) => (
                          <div
                            key={index}
                            className={`flex flex-col sm:flex-row sm:items-start p-3 text-sm ${
                              index !== selectedItem.details.length - 1
                                ? "border-b border-gray-100"
                                : ""
                            } ${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}
                          >
                            <span className="font-semibold text-gray-500 w-full sm:w-1/3 mb-1 sm:mb-0">
                              {item.label}
                            </span>
                            <span className="text-gray-900 w-full sm:w-2/3 font-medium break-words">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-amber-600 text-sm bg-amber-50 p-3 rounded border border-amber-200 flex items-center">
                        <AlertTriangle size={16} className="mr-2" /> Data detail
                        tidak tersedia
                      </p>
                    )}
                  </div>
                </div>

                {/* Kolom Kanan: Gambar & Upload */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase border-b pb-2">
                    Dokumen Persyaratan
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">
                        Scan KTP
                      </p>
                      {selectedItem.file_ktp ? (
                        <div
                          className="relative group border border-gray-200 rounded-xl overflow-hidden h-40 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors"
                          onClick={() =>
                            setPreviewImage(getImageUrl(selectedItem.file_ktp))
                          }
                        >
                          <img
                            src={getImageUrl(selectedItem.file_ktp)}
                            alt="KTP"
                            className="max-h-full max-w-full object-contain p-2"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium flex items-center">
                              <Eye size={16} className="mr-2" /> Perbesar
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400 bg-gray-50">
                          Tidak dilampirkan
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">
                        Scan KK
                      </p>
                      {selectedItem.file_kk ? (
                        <div
                          className="relative group border border-gray-200 rounded-xl overflow-hidden h-40 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors"
                          onClick={() =>
                            setPreviewImage(getImageUrl(selectedItem.file_kk))
                          }
                        >
                          <img
                            src={getImageUrl(selectedItem.file_kk)}
                            alt="KK"
                            className="max-h-full max-w-full object-contain p-2"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-lg text-sm font-medium flex items-center">
                              <Eye size={16} className="mr-2" /> Perbesar
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400 bg-gray-50">
                          Tidak dilampirkan
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedItem.status === "menunggu" && (
                    <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                      <label className="flex items-center text-sm font-bold text-blue-900 mb-3">
                        <Upload size={18} className="mr-2" /> Upload Surat Asli
                        (Selesai TTD)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,image/png,image/jpeg,image/jpg"
                        onChange={(e) => setFileHasil(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none cursor-pointer bg-white border border-gray-200 rounded-lg"
                      />
                      <p className="text-xs text-blue-600 mt-2 flex items-center">
                        <span className="font-bold mr-1">*Format:</span> PDF,
                        JPG, PNG, DOCX (Maks 5MB).
                      </p>
                    </div>
                  )}

                  {selectedItem.status === "selesai" &&
                    selectedItem.file_hasil && (
                      <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                        <p className="text-sm font-bold text-green-900 flex items-center mb-2">
                          <Check size={18} className="mr-2 text-green-600" />{" "}
                          Surat Telah Diterbitkan
                        </p>
                        <p className="text-xs text-green-700 mb-3">
                          File surat asli yang sudah ditandatangani telah
                          berhasil diunggah dan dikirim ke warga.
                        </p>
                        <a
                          href={`https://desa-mragel-backend.vercel.app/public/uploads/surat/${selectedItem.file_hasil}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors focus:ring-4 focus:ring-green-100"
                        >
                          <Eye size={16} className="mr-2" /> Lihat Dokumen
                          Terlampir
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Footer Modal: Tombol Aksi */}
            {selectedItem.status === "menunggu" ? (
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl">
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedItem.id_pengajuan,
                      "ditolak",
                      "Persyaratan tidak lengkap / Ditolak",
                    )
                  }
                  disabled={processing}
                  className="px-5 py-2.5 border-2 border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors w-full sm:w-auto"
                >
                  Tolak Pengajuan
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedItem.id_pengajuan, "selesai")
                  }
                  disabled={processing}
                  className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center w-full sm:w-auto shadow-md"
                >
                  {processing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <>
                      <Check size={18} className="mr-2" /> Setujui & Selesai
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-xl">
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setFileHasil(null);
                  }}
                  className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Preview Gambar Full */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
          <img
            src={previewImage}
            alt="Preview Full"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()} // Supaya klik gambar nggak nutup modal
          />
        </div>
      )}
    </div>
  );
};

export default KelolaPengajuan;
