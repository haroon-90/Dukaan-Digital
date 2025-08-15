import React, { useState } from "react";
import { getReport } from "../../Services/reportServices.js";

const Reporthomepage = () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(currentMonth);
  const [selectedType, setSelectedType] = useState("date");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setReport(null);

    try {
      let body = {};
      if (selectedType === "date") {
        body = { date };
      } else {
        body = { month };
      }
      const res = await getReport(body);
      console.log(res)
      if (res && res.data) {
        setReport(res.data);
      } else {
        setMessage("❌ Failed to fetch report");
      }
    } catch (err) {
      console.error(err);
      if (err.status == 404) {
        setMessage("No record found")
      } else {
        setMessage("❌ Error fetching report");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border border-purple-200">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          Reports
        </h2>

        {/* Type Selection */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setSelectedType("date")}
            className={`px-4 py-2 rounded-lg font-medium ${selectedType === "date"
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700"
              }`}
          >
            By Date
          </button>
          <button
            onClick={() => setSelectedType("month")}
            className={`px-4 py-2 rounded-lg font-medium ${selectedType === "month"
              ? "bg-purple-600 text-white"
              : "bg-purple-100 text-purple-700"
              }`}
          >
            By Month
          </button>
        </div>

        {/* Date/Month Picker */}
        {selectedType === "date" ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-600 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-600 mb-1">
              Select Month
            </label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Loading..." : "Get Report"}
        </button>

        {message && (
          <p className="text-center mt-3 text-red-500 font-medium">
            {message}
          </p>
        )}
      </div>

      {/* Report Display */}
      {/* Report Display */}
      {report && (
        <div className="mt-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              key: "totalSale",
              label: "Total Sales",
              icon: "💰",
              color: "text-green-700",
              bg: "bg-green-50",
            },
            {
              key: "totalProfit",
              label: "Total Profit",
              icon: "📈",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              key: "totalExpense",
              label: "Total Expenses",
              icon: "💸",
              color: "text-red-600",
              bg: "bg-red-50",
            },
            {
              key: "totalUdhaar",
              label: "Total Udhaar",
              icon: "📝",
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              key: "netAmount",
              label: "Net Amount",
              icon: "⚖️",
              color: report.netAmount < 0 ? "text-red-600" : "text-green-700",
              bg: report.netAmount < 0 ? "bg-red-50" : "bg-green-50",
            },
            {
              key: "totalQuantitySold",
              label: "Total Quantity Sold",
              icon: "📦",
              color: "text-purple-700",
              bg: "bg-purple-50",
            },
            {
              key: "numberOfSales",
              label: "Number of Sales",
              icon: "🛒",
              color: "text-purple-700",
              bg: "bg-purple-50",
            },
            {
              key: "numberOfExpenses",
              label: "Number of Expenses",
              icon: "🧾",
              color: "text-purple-700",
              bg: "bg-purple-50",
            },
            {
              key: "numberOfUdhaar",
              label: "Number of Udhaar",
              icon: "📋",
              color: "text-purple-700",
              bg: "bg-purple-50",
            },
          ].map((item) => (
            <div
              key={item.key}
              className={`flex flex-col items-center justify-center shadow-lg rounded-2xl p-6 border border-purple-200 hover:shadow-xl transition duration-300 ${item.bg}`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className={`mt-1 text-2xl font-bold ${item.color}`}>
                {typeof report[item.key] === "number"
                  ? report[item.key].toLocaleString()
                  : report[item.key]}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Reporthomepage;
