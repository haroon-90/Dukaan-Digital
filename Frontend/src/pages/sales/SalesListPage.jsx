import { useEffect, useState } from "react";
import { getsales, deletesale } from "../../Services/saleServices.js";
import { Eye, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SalesListPage = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const formatDate = (date) => date.toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(formatDate(new Date(new Date().setMonth(new Date().getMonth(), 1))));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

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
        return;
      }

      const saleData = res.data.filter((item) => item.type === "sale");
      const purchaseData = res.data.filter((item) => item.type === "purchase");

      setSales(saleData);
      setPurchases(purchaseData);
      toast.success("Data refreshed")
    } catch (err) {
      if (err.response?.status === 404) {
        setSales([]);
        setPurchases([]);
      } else {
        toast.error(err.response?.data?.msg || "Error fetching data")
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

  const handleDelete = async (item) => {
    try {
      if (confirm("Are you really want to delete this?")) {
        const res = await deletesale(selectedSale?._id || item._id);
        if (res.status == 200 || res.status == 201) {
          toast.success("deleted successfully")
        }
        fetchData();
        setShowDetails(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.msg || "Error deleting sale")
    }
  }

  const RenderTable = ({ title, data }) => (
    <div className="relative bg-white shadow-md rounded-lg p-4 border border-purple-200">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-purple-500">No records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-purple-600 text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-3">{type == "sale" ? "Customer" : "Supplier"}</th>
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
                  <td className="px-4 py-3 font-medium text-purple-800">
                    {item.customerName}
                  </td>
                  <td className="px-4 py-3 text-purple-700">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600">
                    ₨ {item.totalAmount}
                  </td>
                  <td className="px-4 py-3 flex justify-around">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-800 transition"
                    >
                      <Trash2 size={18} />
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
    <div className="relative p-6 space-y-6 min-h-screen">
      {/* Filter controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <label className="font-semibold text-purple-700">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="sale">Sale</option>
            <option value="purchase">Purchase</option>
          </select>

          <label className="font-semibold text-purple-700">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <label className="font-semibold text-purple-700">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            onClick={fetchData}
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition"
          >
            Filter
          </button>
        </div>
        <div className="flex gap-1">
          <button
            className="px-4 py-1 bg-purple-600 hover:bg-purple-700 transition text-white rounded flex items-center gap-2"
            onClick={() => {
              navigate("/sales/new");
            }}
          >
            <ShoppingCart size={16} /> sale
          </button>
          <button
            className="px-4 py-1 bg-purple-600 hover:bg-purple-700 transition text-white rounded flex items-center gap-2"
            onClick={() => {
              navigate("/sales/purchase");
            }}
          >
            <ShoppingCart size={16} /> Purchase
          </button>
        </div>
      </div>

      {loading &&
        <div className="flex justify-center items-center py-6">
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      }

      {!loading && (
        <>
          {type === "sale" && (
            <RenderTable title="Sales Records" data={sales} />
          )}
          {type === "purchase" && (
            <RenderTable title="Purchase Records" data={purchases} />
          )}
        </>
      )}

      {showDetails && selectedSale && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm p-4 font-mono print:p-0">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-300 text-gray-800 print:shadow-none print:border-0 print:rounded-none">

            <div className="text-center pb-4 mb-4 border-b border-dashed border-gray-400 print:border-solid">
              <h2 className="text-2xl font-bold text-purple-700 tracking-wide">
                {JSON.parse(sessionStorage.getItem("user")).shopname}
              </h2>
              <p className="text-sm font-semibold text-gray-600 mt-1">
                {selectedSale.type === "sale" ? "Sales Invoice" : "Purchase Receipt"}
              </p>
              {/* <p className="text-xs text-gray-500 mt-2">
                    Invoice #: {selectedSale._id.slice(-6).toUpperCase()}
                </p> */}
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold">
                {selectedSale.type === "sale" ? "Customer:" : "Supplier:"}
                <span className="font-normal ml-2">{selectedSale.customerName || "Walk-in"}</span>
              </p>
              <p className="text-sm font-semibold mt-1">
                Date:
                <span className="font-normal ml-2">{new Date(selectedSale.createdAt).toLocaleDateString()}</span>
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-xs border-b border-dashed border-gray-400 py-2 sticky top-0 bg-white print:border-solid">
                <span className="flex-1">Item</span>
                <span className="w-16 text-right">Qty</span>
                <span className="w-20 text-right">Price</span>
                <span className="w-20 text-right">Total</span>
              </div>

              {selectedSale.items.map((it) => (
                <div key={it._id} className="flex justify-between text-sm py-2 border-b border-dashed border-gray-200 print:border-solid">
                  <span className="flex-1 text-purple-800 font-medium">{it.productName}</span>
                  <span className="w-16 text-right">{it.quantity} {it.unit || ""}</span>
                  <span className="w-20 text-right">₨ {it.price.toLocaleString()}</span>
                  <span className="w-20 text-right font-semibold">
                    ₨ {(it.quantity * it.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-400 mt-4 pt-4 print:border-solid">
              <div className="flex justify-between items-baseline font-bold text-xl">
                <span>TOTAL:</span>
                <span className="text-green-600">
                  ₨ {selectedSale.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-dashed border-gray-400 print:border-solid">
              <p>Thank you for your business!</p>
            </div>

            <div className="flex justify-end gap-3 mt-8 print:hidden">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
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

export default SalesListPage;