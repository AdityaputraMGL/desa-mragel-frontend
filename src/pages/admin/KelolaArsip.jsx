import { Archive, Download, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

const KelolaArsip = () => {
  const [arsip, setArsip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArsip();
  }, []);

  const fetchArsip = async () => {
    try {
      const response = await api.get("/pengajuan/admin/all");
      const allData = response.data.data || [];
      const dataArsip = allData.filter(
        (item) => item.status === "selesai" || item.status === "disetujui",
      );
      setArsip(dataArsip);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data arsip");
    } finally {
      setLoading(false);
    }
  };

  const filteredArsip = arsip.filter((item) => {
    const nama = item.user?.penduduk?.nama_lengkap?.toLowerCase() || "";
    const jenisSurat = item.jenis_surat?.toLowerCase() || "";
    const keyword = searchTerm.toLowerCase();
    return nama.includes(keyword) || jenisSurat.includes(keyword);
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Archive className="mr-3 text-primary-600" size={32} />
              Arsip Surat Digital
            </h1>
            <p className="text-gray-500 mt-1">
              Penyimpanan dokumen surat warga yang telah diterbitkan
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau jenis surat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    No
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Nama Pemohon
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Jenis Surat
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tanggal Diterbitkan
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      Memuat arsip...
                    </td>
                  </tr>
                ) : filteredArsip.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <Archive className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">
                        Belum ada arsip surat
                      </p>
                      <p>Surat yang telah disetujui akan muncul di sini.</p>
                    </td>
                  </tr>
                ) : (
                  filteredArsip.map((item, index) => (
                    <tr
                      key={item.id_pengajuan}
                      className="bg-white border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.user?.penduduk?.nama_lengkap ||
                                "Tanpa Nama"}
                            </p>
                            <p className="text-xs text-gray-500">
                              NIK: {item.user?.penduduk?.nik || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {item.jenis_surat?.replace(/_/g, " ").toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(item.updated_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {/* 👇 FIX: Arahkan ke folder SURAT (bukan syarat) 👇 */}
                        {item.file_hasil ? (
                          <button
                            onClick={async () => {
                              const response = await fetch(item.file_hasil);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `Surat-${item.user?.penduduk?.nama_lengkap || "Warga"}`;
                              link.click();
                              window.URL.revokeObjectURL(url);
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                          >
                            <Download size={16} className="mr-1.5" />
                            File Surat
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            File tidak tersedia
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaArsip;
