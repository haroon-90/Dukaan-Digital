import React, { useState } from "react";
import {
    Users,
    Shield,
    Store,
    BarChart,
    Settings,
    FileText,
    Bell,
    Search,
    Menu,
    Activity,
    UserCheck,
    TrendingUp,
    Clock,
    Cpu,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    Bar,
    BarChart as BarChartRe,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
} from "recharts";

// Sidebar Menu Items
const menuItems = [
    { id: "users", label: "Users", icon: <Users size={18} /> },
    { id: "roles", label: "Roles", icon: <Shield size={18} /> },
    { id: "shops", label: "Shops", icon: <Store size={18} /> },
    { id: "reports", label: "Reports", icon: <BarChart size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
    { id: "logs", label: "Logs", icon: <FileText size={18} /> },
];

// Dummy Users
const dummyUsers = [
    { id: 1, name: "Ali Khan", email: "ali@example.com", role: "Manager" },
    { id: 2, name: "Sara Malik", email: "sara@example.com", role: "Manager" },
    { id: 3, name: "Admin User", email: "admin@example.com", role: "Admin" },
    { id: 4, name: "Zara Ahmed", email: "zara@example.com", role: "Manager" },
    { id: 5, name: "Bilal", email: "bilal@example.com", role: "Admin" },
];

const dummyRoles = [
    { id: 1, role: "Admin", permissions: "Full Access: Users, Shops, Reports, Settings, Logs" },
    { id: 2, role: "Manager", permissions: "Manage Shops, View Reports, Limited Logs" },
];

const dummyShops = [
    { id: 1, name: "SuperMart", owner: "Ali Khan", status: "Active" },
    { id: 2, name: "City Store", owner: "Sara Malik", status: "Inactive" },
    { id: 3, name: "MegaMart", owner: "Admin User", status: "Active" },
    { id: 4, name: "QuickBuy", owner: "Zara Ahmed", status: "Pending" },
];

const dummyReports = [
    { name: "Sales", value: 120000 },
    { name: "Purchases", value: 85000 },
    { name: "Expenses", value: 50000 },
    { name: "Profit", value: 35000 },
];

const monthlyPerformance = [
    { month: "Jan", sales: 4000, expenses: 2400 },
    { month: "Feb", sales: 3000, expenses: 2210 },
    { month: "Mar", sales: 5000, expenses: 2290 },
    { month: "Apr", sales: 4780, expenses: 2000 },
    { month: "May", sales: 5890, expenses: 2181 },
    { month: "Jun", sales: 4390, expenses: 2500 },
];

const dummyLogs = [
    { id: 1, action: "Ali created a shop", time: "2 mins ago" },
    { id: 2, action: "Sara updated a product", time: "15 mins ago" },
    { id: 3, action: "Admin generated a sales report", time: "1 hr ago" },
    { id: 4, action: "Zara removed a shop", time: "3 hrs ago" },
    { id: 5, action: "Bilal changed system settings", time: "1 day ago" },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const AdminPage = () => {
    const [active, setActive] = useState("users");

    // Dynamic Summary
    const totalUsers = dummyUsers.length;
    const totalManagers = dummyUsers.filter((u) => u.role === "Manager").length;
    const totalShops = dummyShops.length;

    // Content Switch
    const renderContent = () => {
        switch (active) {
            case "users":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">👥 Users Management</h2>
                        <p className="mb-4 text-gray-600">
                            Manage all system users, assign roles, and track activity.
                        </p>
                        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyUsers.map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{u.id}</td>
                                        <td className="p-3">{u.name}</td>
                                        <td className="p-3">{u.email}</td>
                                        <td
                                            className={`p-3 font-semibold ${u.role === "Admin" ? "text-blue-600" : "text-green-600"
                                                }`}
                                        >
                                            {u.role}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "roles":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">🛡 Roles & Permissions</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {dummyRoles.map((r) => (
                                <div
                                    key={r.id}
                                    className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
                                >
                                    <h3 className="font-bold text-lg text-blue-600">{r.role}</h3>
                                    <p className="text-gray-600 mt-2">{r.permissions}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "shops":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">🏪 Shops Management</h2>
                        <p className="mb-4 text-gray-600">Track shops and their status.</p>
                        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3">Shop</th>
                                    <th className="p-3">Owner</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dummyShops.map((s) => (
                                    <tr key={s.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{s.name}</td>
                                        <td className="p-3">{s.owner}</td>
                                        <td
                                            className={`p-3 font-semibold ${s.status === "Active"
                                                    ? "text-green-600"
                                                    : s.status === "Inactive"
                                                        ? "text-red-600"
                                                        : "text-yellow-500"
                                                }`}
                                        >
                                            {s.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "reports":
                return (
                    <div className="p-6 grid grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="font-semibold mb-4">📊 Sales Overview</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChartRe data={dummyReports}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" />
                                </BarChartRe>
                            </ResponsiveContainer>
                        </div>
                        {/* Pie Chart */}
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="font-semibold mb-4">📈 Distribution</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={dummyReports}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        {dummyReports.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Line Chart */}
                        <div className="col-span-2 p-6 bg-white rounded-lg shadow">
                            <h3 className="font-semibold mb-4">📅 Monthly Performance</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
                                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );

            case "settings":
                return (
                    <div className="p-6 space-y-6">
                        <h2 className="text-2xl font-bold">⚙ System Settings</h2>
                        <div className="p-4 bg-white rounded-lg shadow space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Enable Notifications</span>
                                <input type="checkbox" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Dark Mode</span>
                                <input type="checkbox" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Admin Email</label>
                                <input
                                    type="text"
                                    defaultValue="admin@example.com"
                                    className="border rounded px-3 py-2 w-full"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "logs":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">📝 System Logs</h2>
                        <div className="space-y-3">
                            {dummyLogs.map((l) => (
                                <div
                                    key={l.id}
                                    className="p-3 bg-white rounded-lg shadow border-l-4 border-blue-500"
                                >
                                    <p>{l.action}</p>
                                    <span className="text-sm text-gray-500">{l.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return <div className="p-6">Welcome Admin</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg hidden md:block">
                <div className="p-4 font-bold text-xl border-b text-blue-600">
                    Admin Panel
                </div>
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${active === item.id
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Topbar */}
                <header className="flex items-center justify-between bg-white shadow px-6 py-3 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <Search className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border rounded px-3 py-1 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Bell className="text-gray-600 cursor-pointer" />
                        <img
                            src="https://i.pravatar.cc/40"
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <Menu className="md:hidden cursor-pointer" />
                    </div>
                </header>

                {/* Dashboard Summary */}
                {active === "users" && (
                    <div className="grid grid-cols-4 gap-6 p-6">
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <Users className="mx-auto text-blue-500" />
                            <h4 className="text-gray-500">Total Users</h4>
                            <p className="text-2xl font-bold">{totalUsers}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <UserCheck className="mx-auto text-green-500" />
                            <h4 className="text-gray-500">Managers</h4>
                            <p className="text-2xl font-bold text-green-600">
                                {totalManagers}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <Store className="mx-auto text-yellow-500" />
                            <h4 className="text-gray-500">Shops</h4>
                            <p className="text-2xl font-bold text-blue-600">{totalShops}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <TrendingUp className="mx-auto text-purple-500" />
                            <h4 className="text-gray-500">System Uptime</h4>
                            <p className="text-2xl font-bold text-purple-600">99.9%</p>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <div>{renderContent()}</div>
            </main>
        </div>
    );
};

export default AdminPage;
