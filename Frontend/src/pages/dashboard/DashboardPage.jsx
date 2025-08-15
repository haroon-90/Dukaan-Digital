import { useNavigate } from "react-router-dom";
import { User, Package, ShoppingCart, BarChart2, HandCoins, FileText } from "lucide-react";

const DashboardPage = () => {
    const navigate = useNavigate();

    const menuItems = [
        { label: "Profile", path: "/profile", icon: <User size={32} />, color: "bg-blue-500", hover: "hover:bg-blue-600" },
        { label: "Expense", path: "/expenses", icon: <FileText size={32} />, color: "bg-green-500", hover: "hover:bg-green-600" },
        { label: "Products", path: "/products", icon: <Package size={32} />, color: "bg-purple-500", hover: "hover:bg-purple-600" },
        { label: "Sales", path: "/sales", icon: <ShoppingCart size={32} />, color: "bg-yellow-500", hover: "hover:bg-yellow-600" },
        { label: "Credit", path: "/udhaar", icon: <HandCoins size={32} />, color: "bg-red-500", hover: "hover:bg-red-600" },
        { label: "Report", path: "/reports", icon: <BarChart2 size={32} />, color: "bg-indigo-500", hover: "hover:bg-indigo-600" },
    ];

    return (
        <div className="p-6 md:min-h-[calc(100vh-192px)] min-h-[calc(100vh-228px)] font-sans"       >
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Dukaan Digital Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage your business smartly and easily</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl text-white cursor-pointer shadow-md transform transition duration-300 hover:scale-105 ${item.color} ${item.hover}`}
                    >
                        {item.icon}
                        <h2 className="text-lg font-semibold">{item.label}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
