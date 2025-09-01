import { useNavigate } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from "react";
import {
    Users,
    Store,
    Shield,
    DollarSign,
    PlusCircle,
    RefreshCw,
    Search,
    Download,
    Upload,
    AlertTriangle,
    Settings,
    Edit2,
    Trash2
} from "lucide-react";

const Admindashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    const [stats, setStats] = useState({
        managers: 5,
        shops: 12,
        salesToday: 126,
        revenueToday: 84500,
    });

    const [managers, setManagers] = useState([
        {
            id: "m1",
            name: "Ahsan Raza",
            email: "ahsan@dukaan.pk",
            phone: "+92 300 1234567",
            shop: "Raza Store",
            status: "active",
            createdAt: "2025-08-15",
        },
        {
            id: "m2",
            name: "Sana Khan",
            email: "sana@dukaan.pk",
            phone: "+92 311 9876543",
            shop: "SK Mart",
            status: "pending",
            createdAt: "2025-08-20",
        },
        {
            id: "m3",
            name: "Bilal Ahmed",
            email: "bilal@dukaan.pk",
            phone: "+92 333 1010101",
            shop: "Bilal Kirana",
            status: "suspended",
            createdAt: "2025-08-05",
        },
    ]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError("");
                await new Promise((r) => setTimeout(r, 400));
                if (!mounted) return;
                setLoading(false);
            } catch (e) {
                setLoading(false);
                setError("Failed to fetch dashboard data");
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const filteredManagers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return managers;
        return managers.filter((m) =>
            [m.name, m.email, m.phone, m.shop, m.status]
                .filter(Boolean)
                .some((f) => String(f).toLowerCase().includes(q))
        );
    }, [query, managers]);

    const statusBadge = (status) => {
        const base = "px-2 py-1 text-xs rounded-full border inline-flex items-center gap-1";
        if (status === "active")
            return <span className={`${base} border-green-300 bg-green-50`}>● Active</span>;
        if (status === "pending")
            return <span className={`${base} border-amber-300 bg-amber-50`}>● Pending</span>;
        return <span className={`${base} border-rose-300 bg-rose-50`}>● Suspended</span>;
    };

    const currency = (n) =>
        new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0,
        }).format(n);

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-600 w-6 h-6" />
                        <div className="font-semibold text-blue-600">Admin Dashboard</div>
                        <span className="text-xs text-slate-500 hidden sm:inline">
                            (Manage managers, shops & system)
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600">
                        <button
                            onClick={() => window.location.reload()}
                            title='Refresh'
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-3 py-2 text-sm hover:bg-blue-600 hover:text-white"
                        >
                            <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Refresh</span>
                        </button>
                        <button onClick={() => navigate("/register")} title='Add Shop' className="inline-flex  items-center justify-center gap-2 rounded-lg border border-white bg-blue-600 text-white px-3 py-2 text-sm hover:bg-white hover:text-blue-600 hover:border-blue-600">
                            <PlusCircle className="w-4 h-4" /> <span className="hidden sm:inline">Add Shop</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl p-4 md:p-6">
                {error && (
                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
                        <AlertTriangle className="mt-0.5 h-5 w-5" />
                        <div>
                            <div className="font-medium">Heads up</div>
                            <div className="text-sm">{error}</div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between sm:flex-wrap gap-4 mb-6">
                    <StatCard icon={Store} label="Total Shops" value={stats.shops} loading={loading} />
                    {/* <button onClick={() => navigate("/register")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-3 text-sm hover:bg-blue-700">
                        <PlusCircle className="w-4 h-4" /> Add Shop
                    </button> */}
                </div>

                <div className="mb-4 flex items-center gap-2">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search managers, shops, phone..."
                            className="w-full min-w-[30vw] rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-600"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white">

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-blue-50 text-blue-600">
                                <tr>
                                    <Th className="px-4 py-2.5">Name</Th>
                                    <Th className="hidden md:table-cell px-4 py-2.5">Email</Th>
                                    <Th className="hidden md:table-cell px-4 py-2.5">Phone</Th>
                                    <Th className="px-4 py-2.5">Shop</Th>
                                    <Th className="px-4 py-2.5">Status</Th>
                                    <Th className="px-4 py-2.5">Created</Th>
                                    <Th className="text-right px-4 py-2.5">Actions</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredManagers.map((m) => (
                                    <tr key={m.id} className="border-t border-blue-100 hover:bg-blue-50/50">
                                        <Td className="px-4 py-2.5">
                                            <div className="font-medium text-blue-800">{m.name}</div>
                                            <div className="text-xs text-blue-500 md:hidden">{m.email}</div>
                                            <div className="text-xs text-blue-500 md:hidden">{m.phone}</div>
                                        </Td>
                                        <Td className="hidden md:table-cell px-4 py-2.5">{m.email}</Td>
                                        <Td className="hidden md:table-cell px-4 py-2.5">{m.phone}</Td>
                                        <Td className="px-4 py-2.5">{m.shop}</Td>
                                        <Td className="px-4 py-2.5">{statusBadge(m.status)}</Td>
                                        <Td className="px-4 py-2.5">{m.createdAt}</Td>
                                        <Td className="px-4 py-2.5">
                                            <div className="flex items-center justify-end gap-2 md:gap-4">
                                                {m.status !== "active" ? (
                                                    <button className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-100">
                                                        Activate
                                                    </button>
                                                ) : (
                                                    <button className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-100">
                                                        Suspend
                                                    </button>
                                                )}
                                                <Edit2 className="w-4 h-4 text-blue-600 hover:text-blue-800 cursor-pointer" />
                                                <Trash2 className="w-4 h-4 text-rose-600 hover:text-rose-800 cursor-pointer" />
                                            </div>
                                        </Td>
                                    </tr>
                                ))}
                                {filteredManagers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-blue-500">
                                            No results.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

function StatCard({ icon: Icon, label, value, loading }) {
    return (
        <div className="rounded-2xl md:min-w-[30vw] min-w-[60vw] border border-slate-200 bg-white p-4">
            <div className="flex items-center  gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                    <div className="text-xl font-semibold text-slate-800">
                        {loading ? <span className="animate-pulse">…</span> : value}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Th({ children, className = "" }) {
    return (
        <th
            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${className}`}
        >
            {children}
        </th>
    );
}

function Td({ children, className = "" }) {
    return (
        <td className={`px-4 py-3 align-middle text-slate-700 ${className}`}>
            {children}
        </td>
    );
}

export default Admindashboard;