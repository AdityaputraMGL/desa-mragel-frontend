import { Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import pendudukService from "../../services/pendudukService";

const KelolaPenduduk = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    alamat_lengkap: "",
    agama: "Islam",
    status_perkawinan: "Belum Kawin",
    pekerjaan: "",
  });

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await pendudukService.getAll({ page, search });
      setData(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await pendudukService.delete(id);
      toast.success("Data berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus data");
    }
  };

  const handleOpenModal = (penduduk = null) => {
    if (penduduk) {
      setIsEditMode(true);
      setSelectedId(penduduk.id_penduduk);
      setFormData(penduduk); // Isi form dengan data yang mau diedit
    } else {
      setIsEditMode(false);
      setFormData({
        nik: "",
        nama_lengkap: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "Laki-laki",
        alamat_lengkap: "",
        agama: "Islam",
        status_perkawinan: "Belum Kawin",
        pekerjaan: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await pendudukService.update(selectedId, formData);
        toast.success("Data berhasil diperbarui");
      } else {
        await pendudukService.create(formData);
        toast.success("Data berhasil ditambahkan");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  return (
    // 👇 Padding disesuaikan untuk layar HP
    <div className="p-4 md:p-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Data Kependudukan
        </h1>
        <button
          onClick={() => handleOpenModal()}
          // 👇 Tombol jadi full width di HP, auto di laptop
          className="w-full md:w-auto bg-primary-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" /> Tambah Penduduk
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari NIK atau Nama..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 👇 FIX UTAMA: Table Wrapper dengan overflow-x-auto 👇 */}
      <div className="bg-white rounded-lg shadow w-full overflow-hidden border border-gray-200">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <span className="text-gray-500">Memuat data...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Data tidak ditemukan.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data.map((item) => (
              <div
                key={item.id_penduduk}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      {item.nama_lengkap}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {item.nik}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.tempat_lahir}, {item.tanggal_lahir} ·{" "}
                      {item.jenis_kelamin}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.alamat_lengkap}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.pekerjaan || "-"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 bg-blue-50 p-2 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id_penduduk)}
                      className="text-red-600 bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          {/* 👇 max-h-full di HP supaya bisa discroll lancar */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 md:p-6 border-b bg-gray-50">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Data Penduduk" : "Tambah Penduduk Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1">
              <form
                id="penduduk-form"
                onSubmit={handleSubmit}
                className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                    value={formData.nik}
                    onChange={(e) =>
                      setFormData({ ...formData, nik: e.target.value })
                    }
                    disabled={isEditMode}
                    placeholder="Masukkan 16 digit NIK"
                  />
                  {isEditMode && (
                    <p className="text-xs text-amber-600 mt-1">
                      NIK tidak dapat diubah setelah disimpan.
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    value={formData.nama_lengkap}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_lengkap: e.target.value })
                    }
                    placeholder="Nama sesuai KTP"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    value={formData.tempat_lahir}
                    onChange={(e) =>
                      setFormData({ ...formData, tempat_lahir: e.target.value })
                    }
                    placeholder="Kota/Kabupaten"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    value={formData.tanggal_lahir}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggal_lahir: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                    value={formData.jenis_kelamin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jenis_kelamin: e.target.value,
                      })
                    }
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Agama <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                    value={formData.agama}
                    onChange={(e) =>
                      setFormData({ ...formData, agama: e.target.value })
                    }
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    rows="3"
                    value={formData.alamat_lengkap}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        alamat_lengkap: e.target.value,
                      })
                    }
                    placeholder="Masukkan alamat RT/RW, Dusun, dll."
                  />
                </div>
              </form>
            </div>

            {/* 👇 Tombol Modal responsive di bawah 👇 */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="penduduk-form"
                className="w-full sm:w-auto px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center shadow-md"
              >
                <Save size={18} className="mr-2" /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaPenduduk;
