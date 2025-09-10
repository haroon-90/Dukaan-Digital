import { useState, useEffect } from "react";
import { addUdhaar, getUdhaarById, updateUdhaar } from "../../services/udhaarServices.js";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaUser, FaPhone, FaCommentAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const UdhaarFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    customerName: "",
    contact: "",
    amount: "",
    reason: "",
    status: "pending"
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await getUdhaarById(id);
          if (!res) {
            toast.error("Failed to edit credit")
            setTimeout(() => {
              navigate('/udhaar')
            }, 1500);
          }
          setFormData(res.data);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (isEdit) {
        res = await updateUdhaar(id, {
          amount: formData.amount,
          status: formData.status
        });
      } else {
        res = await addUdhaar(formData);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(isEdit ? "Credit updated successfully!" : "Credit added successfully!");
        setTimeout(() => {
          navigate('/udhaar');
        }, 200);
      } else {
        toast.error('Failed');
      }
    } catch (error) {
      toast.error('Something went wrong!');
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="relative bg-white border border-blue-500 shadow-2xl rounded-3xl w-full max-w-lg p-8">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="flex items-center -translate-4 gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full shadow-sm hover:bg-gray-200 hover:shadow-md transition-all duration-300"
        >
          <FaArrowLeft className="text-blue-600" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-extrabold text-blue-700 text-center">
            {isEdit ? "Edit Credit" : "Add Credit"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-blue-800 font-semibold mb-2">Customer Name</label>
            <div className="relative flex items-center">
              <FaUser className="absolute left-4 text-blue-400 z-10" />
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                disabled={isEdit}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-800 font-semibold mb-2">Contact Number</label>
            <div className="relative flex items-center">
              <FaPhone className="absolute left-4 text-blue-400 z-10" />
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                disabled={isEdit}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-800 font-semibold mb-2">Amount</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-blue-400 z-10 font-bold">₨</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-800 font-semibold mb-2">Reason</label>
            <div className="relative flex items-center">
              <FaCommentAlt className="absolute left-4 top-4 text-blue-400 z-10" />
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason"
                disabled={isEdit}
                rows={3}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed placeholder:text-gray-400"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-blue-800 font-semibold mb-2">Status</label>
            <div className="relative flex items-center">
              <FaCheckCircle className="absolute left-4 text-blue-400 z-10" />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 appearance-none text-gray-900"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 disabled:bg-blue-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEdit ? "Update Credit" : "Save Credit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UdhaarFormPage;