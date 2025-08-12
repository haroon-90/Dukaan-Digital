import React, { useEffect, useState } from "react";
import { getsales } from "../../Services/saleServices.js";
import { Eye } from "lucide-react";

const SalesListPage = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showDetails, setShowDetails] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const [startDate, setStartDate] = useState("2025-08-08");
  const [endDate, setEndDate] = useState("2025-08-13");
  const [type, setType] = useState("sale");

  const fetchData = async () => {
    try {
      setLoading(true);
      const body = {
        type,
        startDate,
        endDate,
      };
      const res = await getsales(body);
      if (!res.data || res.data.length === 0) {
        setSales([]);
        setPurchases([]);
        setError("");
        return;
      }

      const saleData = res.data.filter((item) => item.type === "sale");
      const purchaseData = res.data.filter((item) => item.type === "purchase");

      setSales(saleData);
      setPurchases(purchaseData);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setSales([]);
        setPurchases([]);
        setError("");
      } else {
        setError(err.response?.data?.msg || "Error fetching data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetails(true);
  };

  const handleClose = () => {
    setShowDetails(false);
    setSelectedSale(null);
  };

  const RenderTable = ({ title, data }) => (
    <div className="relative bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-gray-500">No records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-purple-100 text-purple-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-purple-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{item.customerName}</td>
                  <td className="px-4 py-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    ₨ {item.totalAmount}
                  </td>
                  <td className="px-4 py-3 flex justify-center">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

return (
  <div className="relative p-6 space-y-6 bg-gray-50 min-h-screen">
    {/* Filter controls */}
    <div className="flex items-center gap-4 mb-6">
      <label className="font-semibold text-purple-700">Type:</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="sale">Sale</option>
        <option value="purchase">Purchase</option>
      </select>

      <label className="font-semibold text-purple-700">Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded px-2 py-1"
      />

      <label className="font-semibold text-purple-700">End Date:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border rounded px-2 py-1"
      />

      <button
        onClick={fetchData}
        className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition"
      >
        Filter
      </button>
    </div>

    {loading && <p className="text-center py-10">Loading...</p>}
    {error && <p className="text-center text-red-500 py-10">{error}</p>}

    {!loading && !error && (
      <>
        {/* Conditional rendering based on selected type */}
        {type === "sale" && <RenderTable title="Sales Records" data={sales} />}
        {type === "purchase" && (
          <RenderTable title="Purchase Records" data={purchases} />
        )}
      </>
    )}

    {/* Sale details modal */}
    {showDetails && selectedSale && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/70 bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Sale Details</h2>
          <p>
            <span className="font-semibold">Customer:</span>{" "}
            {selectedSale.customerName}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(selectedSale.createdAt).toLocaleDateString()}
          </p>
          <p className="text-red-500">
            <span className="font-semibold text-black">Total Amount:</span>{" "}
            {selectedSale.totalAmount} PKR
          </p>
          <h3 className="mt-4 font-semibold">Items</h3>
          <ul className="list-disc pl-6">
            {selectedSale.items.map((it) => (
              <li
                key={it._id}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{it.productName}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {it.quantity} {it.unit || "unit"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price per item: {it.price} PKR
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ₨ {it.quantity * it.price}
                  </p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-right">
            <button
              onClick={handleClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default SalesListPage;
