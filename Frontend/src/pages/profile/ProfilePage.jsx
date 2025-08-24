import { useEffect, useState } from 'react';
import { getProfile, deleteProfile } from '../../services/profileServices.js';
import { User, Mail, Phone, Briefcase, Store, Calendar, Edit2, Trash2, MapPinned } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [confirmDelete, setconfirmDelete] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      console.log(response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setconfirmDelete(true);
      if (confirmDelete) {
        const deleted = await deleteProfile();
        if (deleted) {
          console.log("Profile deleted seccessfully")
          sessionStorage.clear();
          setconfirmDelete(false);
          navigate('/login')
        }
      }
    } catch (err) {
      toast.error('Failed to fetch profile!')
      console.error('Error fetching profile:', err);
    }
  }

  const handleEdit = async () => {
    navigate("/profile/edit")
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="relative p-6 min-h-screen font-sans bg-gray-50">
      {confirmDelete &&
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/50 bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-11/12 max-w-md transform rounded-xl bg-white p-8 text-center shadow-2xl transition-all duration-300 sm:w-full">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 className='text-red-600' size={30} />
            </div>
            <h2 className="mt-6 text-2xl font-bold leading-tight text-gray-900">Confirm Account Deletion</h2>
            <p className="mt-2 text-sm text-gray-500">
              Are you absolutely sure you want to delete your account? This action is <span className='font-bold text-black'>irreversible</span> and will permanently remove all your data, including your shop, <span className="font-bold text-black">{profile.shopname}</span>.
            </p>

            <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                onClick={() => setconfirmDelete(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes, I'm sure. Delete my account.
              </button>
            </div>
          </div>
        </div>
      }
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative bg-blue-600 p-6 text-center text-white">
          <div className='absolute z-10 top-25 right-4 cursor-pointer text-indigo-600 bg-indigo-100 p-2 rounded-full'
            onClick={() => handleEdit()}>
            {<Edit2 size={18} />}
          </div>
          <div className='absolute top-4 right-4 cursor-pointer text-indigo-600 bg-indigo-100 p-2 rounded-full'
            onClick={() => handleDelete()}>
            {<Trash2 size={18} />}
          </div>
          <div className="w-fit mx-auto mb-2 p-2 rounded-full bg-white flex items-center justify-center font-bold text-2xl shadow-lg">
            <h1 className='text-black Logo-font'>{profile.shopname}</h1>
          </div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm opacity-80 capitalize">{profile.role}</p>
        </div>

        <div className="p-6 space-y-4">
          <ProfileDetail icon={<User size={18} />} label="Name" value={profile.name} />
          <ProfileDetail icon={<Mail size={18} />} label="Email" value={profile.email} />
          <ProfileDetail icon={<Phone size={18} />} label="Phone" value={profile.phone} />
          <ProfileDetail icon={<MapPinned size={18} />} label="Address" value={profile.address} />
          <ProfileDetail icon={<Store size={18} />} label="Shop Name" value={profile.shopname} />
          <ProfileDetail icon={<Briefcase size={18} />} label="Role" value={profile.role} />
          <ProfileDetail
            icon={<Calendar size={18} />}
            label="Joined On"
            value={new Date(profile.createdAt).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
};

function ProfileDetail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-indigo-600 bg-indigo-100 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium capitalize">{value || "Not Provided"}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
