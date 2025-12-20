import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from "react";
import {
    Store,
    Shield,
    PlusCircle,
    RefreshCw,
    Search,
    AlertTriangle,
    Edit2,
    Trash2,
    CheckCircle,
    Ban
} from "lucide-react";
import toast from "react-hot-toast";
import Loader from '../loader/loader.jsx'
import { getAdminDashboard, deleteUserProfile, editUserStatus } from '../../services/adminServices.js';

const isYou = JSON.parse(sessionStorage.getItem("user"))?.id || "";
const Admindashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [managers, setManagers] = useState([]);
    const [admins, setAdmins] = useState([])

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getAdminDashboard();
            console.log(response.data);
            setManagers((response.data.shops).filter((shop) => shop.role === "manager"));
            setAdmins((response.data.shops).filter((shop) => shop.role === "admin"));
            setLoading(false);
            // toast.success("Data Refreshed!");
        } catch (err) {
            console.error(err);
            setError(err.msj || "Failed to fetch dashboard data");
            setLoading(false);
            toast.error("Failed to refresh data");
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const filteredManagers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return managers;
        return managers.filter((m) =>
            [m.name, m.email, m.phone, m.shopname, m.status]
                .filter(Boolean)
                .some((f) => String(f).toLowerCase().includes(q))
        );
    }, [query, managers]);

    const statusBadge = (status) => {
        const base = "px-2 py-1 text-xs rounded-full border inline-flex items-center gap-1";
        if (status === "active")
            return <span className={`${base} border-green-300 bg-green-50`}>● Active</span>;
        if (status === "suspended")
            return <span className={`${base} border-rose-300 bg-rose-50`}>● Suspended</span>;
    };

    const handleDelete = async (e) => {
        try {
            if (confirm("Are you sure you want to delete this manager? This action cannot be undone.")) {
                const deleted = await deleteUserProfile(e._id);
                if (deleted) {
                    console.log("Profile deleted seccessfully")
                    fetchDashboard();
                }
            }
        } catch (err) {
            toast.error('Failed to fetch profile!')
            console.error('Error fetching profile:', err);
        }
    }

    const handlestatusupdate = async (e) => {
        try {
            const updated = await editUserStatus(e._id);
            if (updated) {
                console.log("Profile status updated seccessfully")
                fetchDashboard();
            }
        }
        catch (err) {
            toast.error('Failed to fetch profile!')
            console.error('Error fetching profile:', err);
        }
    }

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Shield onClick={() => navigate('/adminprofile')} className="cursor-pointer text-blue-600 w-6 h-6" />
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
                            <PlusCircle className="w-4 h-4" /> <span className="hidden sm:inline">Add User</span>
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

                <div className="flex flex-wrap gap-4 mb-6">
                    <StatCard icon={Store} label="Total Shops" value={managers.length} loading={loading} />
                    <StatCard icon={Shield} label="Total Admins" value={admins.length} loading={loading} />
                </div>


                <div className='p-2 border rounded-2xl border-blue-200 bg-white'>
                    <div className="text-lg font-semibold text-blue-700 flex items-center justify-center gap-2 mb-4"><Store />Shops</div>
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
                    {managers.length === 0 && !loading ? (
                        <div className="my-10 text-center text-blue-500">
                            {/* No shops found. Click on "Add User" to create one. */}
                            {error}
                        </div>
                    ) : (loading ? (
                        <div className="my-10">
                            <Loader />
                        </div>
                    ) : (
                        <Usertable filtered={filteredManagers} handleDelete={handleDelete} statusBadge={statusBadge} handlestatusupdate={handlestatusupdate} navigate={navigate} isadmin={false} />
                    ))
                    }
                </div>

                <div className="my-6" />
                <div className='p-2 border rounded-2xl border-blue-200 bg-white'>
                    <div className="text-lg font-semibold text-blue-700 flex items-center justify-center gap-2 mb-4"><Shield />Admins</div>
                    {loading ? (
                        <div className="my-10">
                            <Loader />
                        </div>
                    ) : (
                        <Usertable filtered={admins} handleDelete={handleDelete} statusBadge={statusBadge} handlestatusupdate={handlestatusupdate} navigate={navigate} isadmin={true} />
                    )
                    }
                </div>
            </div>
        </div>
    );
};

const Usertable = ({ filtered, handlestatusupdate, statusBadge, handleDelete, navigate, isadmin }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-blue-600 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <Th className="px-4 py-2.5">{isadmin === true ? "Name" : "Manager"}</Th>
                            <Th className="hidden md:table-cell px-4 py-2.5">Email</Th>
                            <Th className="hidden md:table-cell px-4 py-2.5">Phone</Th>
                            {isadmin === true && <Th className="px-4 py-2.5">Address</Th>}
                            {isadmin === false && <Th className="px-4 py-2.5">Shop</Th>}
                            <Th className="px-4 py-2.5">Date Added</Th>
                            {isadmin === false && <Th className="px-4 py-2.5">Status</Th>}
                            {isadmin === false && <Th className="text-right px-4 py-2.5">Actions</Th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((m) => (
                            <tr key={m._id} className="border-t border-blue-100 hover:bg-blue-50/50">
                                <Td className="px-4 py-2.5">
                                    <div className="font-medium text-blue-800">{m.name}<span className={`${isYou !== m._id ? "hidden" : "inline-flex"} text-black ml-1 px-2 py-1 text-xs rounded-full border items-center gap-1 border-green-300 bg-green-50`}>You</span></div>
                                    <div className="text-xs text-blue-500 md:hidden">{m.email}</div>
                                    <div className="text-xs text-blue-500 md:hidden">{m.phone}</div>
                                </Td>
                                <Td className="hidden md:table-cell px-4 py-2.5">{m.email}</Td>
                                <Td className="hidden md:table-cell px-4 py-2.5">{m.phone}</Td>
                                {isadmin === true && <Td className="px-4 py-2.5">{m.address}</Td>}
                                {isadmin === false && <Td className="px-4 py-2.5">{m.shopname}</Td>}
                                <Td className="px-4 py-2.5">{new Date(m.createdAt).toLocaleDateString()}</Td>
                                {isadmin === false && <Td className="px-4 py-2.5 text-nowrap">{statusBadge(m.status)}</Td>}
                                {isadmin === false &&
                                    <Td className="px-4 py-2.5">
                                        <div className="flex items-center justify-end gap-2 md:gap-4">
                                            {m.status !== "active" ? (
                                                <button title="Activate" onClick={() => handlestatusupdate(m)} className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-200 rounded-lg p-1">
                                                    <CheckCircle size={16} />
                                                </button>
                                            ) : (
                                                <button title="Suspend" onClick={() => handlestatusupdate(m)} className=" text-rose-600 hover:text-rose-800 hover:bg-rose-200 rounded-lg p-1">
                                                    <Ban size={16} />
                                                </button>
                                            )}
                                            <Edit2 onClick={() => navigate('/admin/profile/edit', { state: { data: m } })} className="text-blue-600 hover:text-blue-800 cursor-pointer hover:bg-blue-200 rounded-lg p-1" />
                                            <Trash2 onClick={() => handleDelete(m)} className="text-rose-600 hover:text-rose-800 cursor-pointer hover:bg-rose-200 rounded-lg p-1" />
                                        </div>
                                    </Td>}
                            </tr>
                        ))}
                        {filtered.length === 0 && (
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
    )
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