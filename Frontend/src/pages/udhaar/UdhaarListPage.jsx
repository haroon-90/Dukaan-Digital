import { useEffect, useState } from "react";
import { getUdhaarlist, deleteUdhaar } from "../../Services/udhaarServices.js";
import { Trash2, Edit2, HandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UdhaarListPage = () => {
  const navigate = useNavigate();
  const [udhaarList, setUdhaarList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getUdhaar = async () => {
    try {
      const res = await getUdhaarlist();
      if (res.data && res.data.length > 0) {
        setUdhaarList(res.data);
      } else {
        setUdhaarList([]);
      }
    } catch (err) {
      console.error("Error fetching udhaar list", err);
    }
  };

  useEffect(() => {
    getUdhaar();
  }, []);

  const handleDelete = async (e) => {
    try {
      if (confirm("Are you really want to delete this?")) {
        const res = await deleteUdhaar(e._id);
        if (res.ok) {
          console.log("Deleted successfully")
        }
        getUdhaar();
      }
    } catch (err) {
      console.error("Error fetching udhaar list", err);
    }
  }

  const handleEdit = (e) => {
    navigate(`/udhaar/edit/${e._id}`)
  }

  // Filter logic
  const filteredData = udhaarList.filter((item) => {
    const matchSearch =
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.contact.includes(search);
    const matchStatus =
      statusFilter === "all" ? true : item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-purple-800">Credit List</h1>
        <button
          onClick={() => navigate("/udhaar/new")}
          className="bg-purple-600 flex gap-2 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <HandCoins size={23} />
          Add Credit
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 min-w-100 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-purple-200">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Customer Name</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-purple-100 hover:bg-purple-50 transition"
                >
                  <td className="px-4 py-2">{item.customerName}</td>
                  <td className="px-4 py-2">{item.contact}</td>
                  <td className="px-4 py-2 font-semibold text-purple-800">
                    Rs {item.amount}
                  </td>
                  <td className="px-4 py-2">
                    {item.reason || "No reason provided"}
                  </td>
                  <td
                    className={`px-4 py-2 font-medium ${item.status === "paid"
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {item.status}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 flex justify-between items-center">
                    <button onClick={() => handleEdit(item)} className="text-purple-600"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item)} className="text-purple-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No Credit records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UdhaarListPage;
