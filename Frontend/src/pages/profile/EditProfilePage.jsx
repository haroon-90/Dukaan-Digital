import { useState } from "react";
import { updateProfile } from "../../Services/profileServices.js";

const EditProfilePage = () => {
  const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      if (!user?.id) {
        setError("User ID not found");
        return;
      }
      const res = await updateProfile(form);
      if (res.data) {
        setSuccess("Profile updated successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-6">Edit Profile</h1>

      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {success && <p className="text-center text-green-500">{success}</p>}

        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <InputField
              label="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-200"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export default EditProfilePage;