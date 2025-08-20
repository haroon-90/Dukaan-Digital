import { useState, useEffect } from "react";
import { updateProfile } from "../../services/profileServices.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        toast.error("User ID not found");
        return;
      }

      const formDataToSend = {};
      if (form.name !== user?.name) formDataToSend.name = form.name;
      if (form.phone !== user?.phone) formDataToSend.phone = form.phone;
      if (form.password) formDataToSend.password = form.password;

      if (Object.keys(formDataToSend).length === 0) {
        toast("No changes to save.", { icon: 'ℹ️' });
        setLoading(false);
        return;
      }

      const res = await updateProfile(formDataToSend);
      if (res.data) {
        toast.success("Profile updated successfully!");

        const updatedUser = { ...user, ...formDataToSend };
        if (formDataToSend.password) delete updatedUser.password;
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
        <h1 className="text-center text-3xl font-bold text-blue-700 mb-6">Edit Profile</h1>
        {loading &&
          <div className="flex justify-center items-center py-6">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        }
        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-blue-800 font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-semibold mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-semibold mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition duration-300 transform hover:scale-105 disabled:bg-blue-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;