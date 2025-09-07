import { useEffect, useState } from 'react';
import { getProfile, deleteProfile } from '../../services/profileServices.js';
import { User, Mail, Phone, Briefcase, Store, Calendar, Edit2, Trash2, MapPinned } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Reusable component for displaying a single profile detail
const ProfileDetail = ({ icon, label, value }) => {
    return (
        <div className="flex items-center gap-4 text-gray-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500">{label}</span>
                <span className="text-base font-semibold text-gray-900">{value || "Not Provided"}</span>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setProfile(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
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
            console.error('Error deleting profile:', err);
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

    // Fallback data if profile is not fully loaded
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
                {/* Header Section */}
                <div className="bg-blue-600 p-8 text-white flex flex-col items-center">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-blue-600 shadow-lg">
                        {user.role === "admin" ? <User size={48} /> : (user.shopname?.charAt(0) || user.name?.charAt(0))}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-center">{user.name}</h2>
                    <p className="mt-1 text-sm opacity-80 capitalize">{user.role}</p>
                </div>

                {/* Details Section */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                        <ProfileDetail icon={<Mail size={20} />} label="Email" value={user.email} />
                        <ProfileDetail icon={<Phone size={20} />} label="Phone" value={user.phone} />
                        <ProfileDetail icon={<MapPinned size={20} />} label="Address" value={user.address} />
                        {user.role !== "admin" && (
                            <ProfileDetail icon={<Store size={20} />} label="Shop Name" value={user.shopname} />
                        )}
                        <ProfileDetail icon={<Briefcase size={20} />} label="Role" value={user.role} />
                        <ProfileDetail
                            icon={<Calendar size={20} />}
                            label="Joined On"
                            value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 p-8 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleEdit}
                        className="w-full flex-1 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white font-medium transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Edit2 size={18} /> Edit Profile
                    </button>
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-full flex-1 flex items-center justify-center gap-2 rounded-full border border-red-600 px-6 py-3 font-medium text-red-600 transition duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <Trash2 size={18} /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;