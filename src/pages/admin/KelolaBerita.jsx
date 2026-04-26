import { Edit, Image as ImageIcon, Plus, Trash2, X } from "lucide-react"; // Tambah icon X untuk modal
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api, { IMAGE_URL } from "../../services/api";

const KelolaBerita = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // State untuk mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "Pemerintahan",
    isi_berita: "",
    penulis: "Admin Desa",
    gambar: null,
  });

  useEffect(() => {
    loadBerita();
  }, []);

  const loadBerita = async () => {
    try {
      const res = await api.get("/berita");
      setBeritaList(res.data.data);
    } catch (error) {
      console.error("Gagal load berita", error);
    }
  };

  // Fungsi Reset Form
  const resetForm = () => {
    setFormData({
      judul: "",
      kategori: "Pemerintahan",
      isi_berita: "",
      penulis: "Admin Desa",
      gambar: null,
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  // Fungsi Buka Modal Tambah
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // Fungsi Buka Modal Edit
  const handleEdit = (item) => {
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      isi_berita: item.isi_berita,
      penulis: item.penulis,
      gambar: null, // Gambar dikosongkan (kalo gak diubah, gak usah kirim)
    });
    setIsEditing(true);
    setCurrentId(item.id_berita);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pakai FormData karena ada upload file
    const data = new FormData();
    data.append("judul", formData.judul);
    data.append("kategori", formData.kategori);
    data.append("isi_berita", formData.isi_berita);
    data.append("penulis", formData.penulis);

    // Hanya append gambar kalau user upload gambar baru
    if (formData.gambar) {
      data.append("gambar", formData.gambar);
    }

    try {
      if (isEditing) {
        // --- LOGIKA UPDATE ---
        await api.put(`/berita/${currentId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Sukses", "Berita berhasil diperbarui", "success");
      } else {
        // --- LOGIKA CREATE ---
        await api.post("/berita", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Sukses", "Berita berhasil ditambahkan", "success");
      }

      setShowModal(false);
      loadBerita();
      resetForm();
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Berita?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/berita/${id}`);
        Swal.fire("Terhapus!", "Berita telah dihapus.", "success");
        loadBerita();
      } catch (error) {
        Swal.fire("Gagal", "Gagal menghapus berita", "error");
      }
    }
  };

  return (
    // 👇 Padding responsif p-4 untuk HP, p-6 untuk Desktop
    <div className="p-4 md:p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Kelola Berita Desa
        </h1>
        <button
          onClick={handleAdd}
          // 👇 Tombol jadi full width di HP
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus size={20} className="mr-2" /> Tambah Berita
        </button>
      </div>

      {/* Tabel Berita */}
      <div className="bg-white rounded-xl shadow-sm w-full overflow-hidden border border-gray-100">
        {/* 👇 FIX UTAMA: Table Wrapper dengan overflow-x-auto 👇 */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Gambar</th>
                <th className="p-4 font-semibold text-gray-600">Judul</th>
                <th className="p-4 font-semibold text-gray-600">Kategori</th>
                <th className="p-4 font-semibold text-gray-600">Tanggal</th>
                <th className="p-4 font-semibold text-gray-600 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {beritaList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    Belum ada berita.
                  </td>
                </tr>
              ) : (
                beritaList.map((item) => (
                  <tr
                    key={item.id_berita}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 whitespace-nowrap">
                      {item.gambar ? (
                        <img
                          src={`${IMAGE_URL}${item.gambar}`}
                          alt="Thumb"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800 min-w-[200px]">
                      {item.judul}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                      {item.tanggal_posting}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-2">
                        {/* Tombol Edit */}
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-lg transition"
                          title="Edit Berita"
                        >
                          <Edit size={18} />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(item.id_berita)}
                          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
                          title="Hapus Berita"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit Berita */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          {/* 👇 max-h-[90vh] dan flex-col agar scroll bar hanya di dalam form 👇 */}
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 overflow-hidden">
            {/* Header Modal */}
            <div className="p-5 md:p-6 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                {isEditing ? "Edit Berita" : "Tambah Berita Baru"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal (Scrollable) */}
            <div className="overflow-y-auto custom-scrollbar flex-1 p-5 md:p-6">
              <form
                id="berita-form"
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Judul Berita <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                    value={formData.judul}
                    onChange={(e) =>
                      setFormData({ ...formData, judul: e.target.value })
                    }
                    placeholder="Masukkan judul berita..."
                  />
                </div>

                {/* 👇 Di HP jadi atas-bawah, di Laptop sebelahan (grid-cols-1 md:grid-cols-2) 👇 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                      value={formData.kategori}
                      onChange={(e) =>
                        setFormData({ ...formData, kategori: e.target.value })
                      }
                    >
                      <option>Pemerintahan</option>
                      <option>Kegiatan</option>
                      <option>Kesehatan</option>
                      <option>Pembangunan</option>
                      <option>Umum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                      Penulis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={formData.penulis}
                      onChange={(e) =>
                        setFormData({ ...formData, penulis: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    Isi Berita <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="6"
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                    value={formData.isi_berita}
                    onChange={(e) =>
                      setFormData({ ...formData, isi_berita: e.target.value })
                    }
                    placeholder="Tulis isi berita di sini..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                    {isEditing ? "Ganti Gambar (Opsional)" : "Gambar Utama"}
                  </label>
                  <input
                    type="file"
                    className="w-full border border-gray-300 p-2 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer bg-white"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, gambar: e.target.files[0] })
                    }
                  />
                  {isEditing && !formData.gambar && (
                    <p className="text-xs text-gray-500 mt-1.5">
                      *Biarkan kosong jika tidak ingin mengubah gambar saat ini.
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Footer Modal (Tombol Aksi) */}
            <div className="p-5 md:p-6 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                form="berita-form"
                className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
              >
                {isEditing ? "Simpan Perubahan" : "Terbitkan Berita"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaBerita;
