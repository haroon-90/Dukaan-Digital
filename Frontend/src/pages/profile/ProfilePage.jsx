import { useEffect, useState } from 'react';
import { getProfile, deleteProfile } from '../../services/profileServices';
import { User, Mail, Phone, Briefcase, Store, Calendar, Edit2, Trash2, MapPinned } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const ProfileDetail = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 rounded-full bg-gray-50 px-4 py-3 shadow-sm">
        <div className="flex h-12 min-w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <span className="text-base font-semibold text-gray-900">{value || "Not Provided"}</span>
        </div>
    </div>
);

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfile(response.data);
        } catch (error) {
            toast.error('Failed to fetch profile!');
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const deleted = await deleteProfile();
            if (deleted) {
                toast.success('Profile deleted successfully!');
                sessionStorage.clear();
                navigate('/login');
            }
        } catch (err) {
            toast.error('Failed to delete profile!');
        } finally {
            setLoading(false);
            setConfirmDelete(false);
        }
    };

    const handleEdit = () => {
        if (profile.role === "admin") {
            navigate('/admin/profile/edit', { state: { data: profile } });
        } else {
            navigate('/profile/edit');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const user = profile._id ? profile : JSON.parse(sessionStorage.getItem("user")) || {};

    return (
        <div className="relative min-h-screen bg-gray-100 font-sans text-gray-900 flex items-center justify-center py-12 px-4">

            {/* Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur p-4 transition-opacity duration-300">
                    <div className="w-full max-w-lg transform rounded-2xl bg-white p-8 text-center shadow-2xl transition-all duration-300">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="text-red-600" size={32} />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">Confirm Account Deletion</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Are you absolutely sure you want to delete your account? This action is <span className="font-bold text-black">irreversible</span> and will permanently remove all your data<span className={`${user.role === "admin" ? "hidden" : ""}`}>, including your shop, <span className="font-bold text-black">{user.shopname || "N/A"}</span></span>.
                        </p>
                        <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="w-full rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Yes, delete my account.'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Card */}
            <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full text-gray-700 hover:bg-white shadow"
                    >
                        <FaArrowLeft className="text-blue-600" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                {/* Avatar + Name */}
                <div className="bg-blue-600 flex flex-col items-center text-white -mt-12 px-6 pb-4">
                    <div className="h-24 w-24 flex items-center justify-center rounded-full bg-white text-blue-600 shadow-lg text-3xl font-bold">
                         <User size={40} />
                    </div>
                    <h2 className="mt-4 text-2xl text-center font-bold">{user.name}</h2>
                    <p className="text-sm capitalize">{user.role}</p>
                    <p className="px-4 py-1 mt-2 rounded-full shadow-sm bg-white font-semibold text-blue-600 capitalize">{user.shopname}</p>
                </div>

                {/* Details */}
                <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileDetail icon={<Mail size={20} />} label="Email" value={user.email} />
                    <ProfileDetail icon={<Phone size={20} />} label="Phone" value={user.phone} />
                    <ProfileDetail icon={<MapPinned size={20} />} label="Address" value={user.address} />
                    {user.role !== "admin" && (
                        <ProfileDetail icon={<Store size={20} />} label="Shop Name" value={user.shopname} />
                    )}
                    <ProfileDetail icon={<Briefcase size={20} />} label="Role" value={user.role} />
                    <ProfileDetail icon={<Calendar size={20} />} label="Joined On" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />
                </div>

                {/* Actions */}
                <div className="px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleEdit}
                        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700"
                    >
                        <Edit2 size={18} /> Edit Profile
                    </button>
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-full border border-red-600 px-6 py-3 font-medium text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={18} /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
