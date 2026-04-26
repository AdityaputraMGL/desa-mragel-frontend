import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "https://desa-mragel-backend.vercel.app/api";

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      loadUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  // Load user profile
  const loadUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth/profile`);

      if (response.data.success) {
        setUser(response.data.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login for:", email);

      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      console.log("✅ Login response:", response.data);

      if (response.data.success && response.data.data) {
        const { token: newToken } = response.data.data;

        // Save token
        localStorage.setItem("token", newToken);

        // Set axios header
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // Set token state
        setToken(newToken);

        // ✅ PERBAIKAN: Load user profile lengkap dari server
        try {
          const profileResponse = await axios.get(`${apiUrl}/auth/profile`);
          if (profileResponse.data.success) {
            setUser(profileResponse.data.data);
          }
        } catch (error) {
          console.error("❌ Failed to load user after login:", error);
        }

        console.log("✅ Login successful");

        return { success: true };
      } else {
        console.error("❌ Login failed:", response.data.message);
        return {
          success: false,
          message: response.data.message || "Login gagal",
        };
      }
    } catch (error) {
      console.error("❌ Login error:", error);

      let errorMessage = "Login gagal. Silakan coba lagi.";

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        errorMessage = "Tidak dapat terhubung ke server";
        console.error("No response:", error.request);
      } else {
        console.error("Error:", error.message);
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };
  // Register function
  const register = async (formData) => {
    try {
      console.log("📝 Attempting registration for:", formData.email);

      const response = await axios.post(`${apiUrl}/auth/register`, formData);

      console.log("✅ Register response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || "Registrasi berhasil",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Registrasi gagal",
        };
      }
    } catch (error) {
      console.error("❌ Register error:", error);

      let errorMessage = "Registrasi gagal. Silakan coba lagi.";

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        errorMessage = "Tidak dapat terhubung ke server";
        console.error("No response:", error.request);
      } else {
        console.error("Error:", error.message);
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Logout function
  const logout = () => {
    console.log("👋 Logging out...");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // Update profile function
  const updateProfile = async (data) => {
    try {
      const response = await axios.put(`${apiUrl}/auth/profile`, data);

      if (response.data.success) {
        // Reload user data
        await loadUser();
        return { success: true, message: "Profil berhasil diupdate" };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Gagal update profil",
      };
    }
  };

  // Change password function
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await axios.put(`${apiUrl}/auth/change-password`, {
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        return { success: true, message: "Password berhasil diubah" };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Gagal mengubah password",
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
    isPetugas: user?.role === "petugas",
    isUser: user?.role === "user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
