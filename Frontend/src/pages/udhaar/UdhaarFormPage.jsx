import React, { useState, useEffect } from "react";
import { addUdhaar, getUdhaarById, updateUdhaar } from "../../Services/udhaarServices.js";
import { useNavigate, useParams } from "react-router-dom";

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
  const [message, setMessage] = useState("");

  // Fetch record in edit mode
  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await getUdhaarById(id);
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
    setMessage("");

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
        setMessage(isEdit ? "Udhaar updated successfully!" : "Udhaar added successfully!");
        setTimeout(() => {
          navigate('/udhaar');
        }, 1500);
      } else {
        setMessage("❌ Failed, try again.");
      }
    } catch (error) {
      setMessage("❌ Something went wrong.");
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          {isEdit ? "Edit Udhaar" : "Add Udhaar"}
        </h2>

        {message && <p className="mb-4 text-center text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-purple-700">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              disabled={isEdit}
              className="mt-1 block w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-purple-700">Contact Number</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="03XXXXXXXXX"
              disabled={isEdit}
              className="mt-1 block w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-purple-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="mt-1 block w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-purple-700">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter reason"
              disabled={isEdit}
              rows={3}
              className="mt-1 block w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            ></textarea>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-purple-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            {loading ? "Saving..." : isEdit ? "Update Udhaar" : "Save Udhaar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UdhaarFormPage;
