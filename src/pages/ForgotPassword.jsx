import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  KeyRound,
  Lock,
  Mail,
  Send,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import logoLamongan from "../assets/logo-lamongan.png"; // 👇 IMPORT LOGO LAMONGAN
import api from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Input Email, Step 2: Input OTP & New Password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, error

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // TAHAP 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email wajib diisi!");
      return;
    }

    setLoading(true);
    setStatus("loading");
    setMessage("");
    const toastId = toast.loading("Mengirim kode OTP...");

    try {
      const response = await api.post("/auth/forgot-password", {
        email: formData.email,
      });

      if (response.data.success) {
        toast.success(response.data.message || "OTP berhasil dikirim!", {
          id: toastId,
        });
        setStep(2); // Lanjut ke form input OTP
        setStatus("idle");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      const errorMsg =
        error.response?.data?.message ||
        "Gagal mengirim email. Coba lagi nanti.";
      setMessage(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // TAHAP 2: Reset Password pake OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Memverifikasi dan mereset password...");

    try {
      const response = await api.post("/auth/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        toast.success("Horee! Password berhasil diubah.", { id: toastId });
        // Langsung redirect ke login setelah sukses
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Kode OTP salah atau kadaluarsa.",
        { id: toastId },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block transform hover:scale-105 transition-transform duration-300"
          >
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-gray-100 p-2">
              <img
                src={logoLamongan}
                alt="Logo Lamongan"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Lupa Password?
          </h2>
          <p className="text-sm text-gray-600">
            {step === 1
              ? "Masukkan email Anda untuk menerima kode OTP."
              : "Masukkan kode OTP yang dikirim ke email Anda."}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* TAHAP 1: INPUT EMAIL */}
          {step === 1 && (
            <form
              onSubmit={handleRequestOTP}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {status === "error" && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {message}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="contoh@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Kirim Kode OTP</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAHAP 2: VERIFIKASI OTP & PASSWORD BARU */}
          {step === 2 && (
            <form
              onSubmit={handleResetPassword}
              className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500"
            >
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-700 mb-4 text-center flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                OTP terkirim ke: <b>{formData.email}</b>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode OTP (6 Digit)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="otp"
                    type="text"
                    required
                    maxLength="6"
                    value={formData.otp}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-center text-xl font-bold tracking-[0.5em] outline-none transition-all uppercase"
                    placeholder="------"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ulangi Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    placeholder="Ulangi password baru"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50 transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Simpan & Login</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 hover:text-gray-800 pt-2 transition-colors font-medium"
              >
                Ganti Email?
              </button>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
