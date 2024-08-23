import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState({});
    const { user, update, BASE_URL } = useAuth();
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                if (!value.trim()) {
                    error = 'Username is required';
                }
                break;
            case 'firstname':
                if (!value.trim()) {
                    error = 'First Name is required';
                }
                break;
            case 'lastname':
                if (!value.trim()) {
                    error = 'Last Name is required';
                }
                break;
            case 'oldPassword':
                if (value && value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;
            case 'newPassword':
                if (value && value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                if (profileData.confirmNewPassword && profileData.confirmNewPassword !== value) {
                    error = 'Passwords do not match';
                }
                break;
            case 'confirmNewPassword':
                if (value && value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                if (profileData.newPassword !== value) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }

        if ((profileData.newPassword || profileData.confirmNewPassword) && !profileData.oldPassword) {
            setErrors((prevErrors) => ({ ...prevErrors, oldPassword: "Please confirm your current password." }));
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
            ...(name === 'newPassword' ? { confirmNewPassword: errors.confirmNewPassword } : {}),
        }));

        return error === '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({ ...prevData, [name]: value }));
        validateField(name, value);
    };

    const toggleEditMode = () => {
        setIsEditMode((prevMode) => !prevMode);
        if (!isEditMode) {
            setErrors({});
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveError('');
        setSaving(true);

        const isValid = Object.keys(profileData).every((key) =>
            validateField(key, profileData[key])
        );

        if (isValid) {
            try {
                const resp = await axios.patch(`${BASE_URL}/users/${user.id}/update`, profileData);
                update(resp.data);
                console.log('Profile updated');
                setIsEditMode(false);
                navigate('/');
            } catch (error) {
                console.error('Failed to update profile:', error);
                setSaveError('Failed to save changes. Please try again.');
            } finally {
                setSaving(false);
            }
        } else {
            setSaving(false);
            setSaveError('Please correct the highlighted errors.');
        }
    };

    useEffect(() => {
        if (user) {
            setProfileData((prevData) => ({ ...prevData, ...user }));
        }
    }, [user]);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-32">
            <div className="flex items-center justify-center mb-6">
                <img
                    className="w-32 h-32 rounded-full"
                    src="/assets/user.png"
                    alt="User Profile"
                />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{profileData.firstname} {profileData.lastname}</h2>
                <p className="text-gray-600 mb-4">{profileData.email}</p>
            </div>
            <button
                onClick={toggleEditMode}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
            >
                {isEditMode ? 'Cancel' : 'Edit Profile'}
            </button>

            {isEditMode && (
                <form onSubmit={handleSave}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                                required
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        {/* First Name Field */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={profileData.firstname}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.firstname ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                                required
                            />
                            {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
                        </div>

                        {/* Last Name Field */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={profileData.lastname}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.lastname ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                                required
                            />
                            {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        {/* Address Field */}
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-bold mb-2">Address</label>
                            <textarea
                                name="address"
                                value={profileData.address}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        {/* Old Password Field */}
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-bold mb-2">Old Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={profileData.oldPassword}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                            />
                            {errors.oldPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={profileData.newPassword}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>)
                            }
                        </div>

                        {/* Confirm New Password Field */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={profileData.confirmNewPassword}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.confirmNewPassword ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                            />
                            {errors.confirmNewPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>)}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white px-4 py-2 rounded-md ${saving ? 'opacity-50' : ''
                            }`}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saveError && (
                        <p className="text-red-500 text-sm mt-4">{saveError}</p>
                    )}
                </form>
            )}
        </div>
    );
};

export default MyProfile;
