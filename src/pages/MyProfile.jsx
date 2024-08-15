import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '',
        address: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                if (!value.trim()) {
                    error = 'Username is required';
                }
                break;
            case 'firstName':
                if (!value.trim()) {
                    error = 'First Name is required';
                }
                break;
            case 'lastName':
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
        const newErrors = errors;
        if (profileData.newPassword || profileData.confirmNewPassword && !profileData.oldPassword) {
            newErrors['oldPassword'] = "First please confirm password";
        }
        if (name === 'newPassword') {
            newErrors['confirmNewPassword'] = error;
        } else {
            newErrors[name] = error;
        }
        setErrors(newErrors);
        return error === '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
        validateField(name, value);
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const isValid = Object.keys(profileData).every((key) =>
            validateField(key, profileData[key])
        );

        if (isValid) {
            // Perform save operation (e.g., API call to update user data)
            console.log('Profile updated:', profileData);
            setIsEditMode(false);
            navigate('/');
        }
    };

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
                <h2 className="text-2xl font-bold mb-2">{profileData.firstName} {profileData.lastName}</h2>
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
                                name="firstName"
                                value={profileData.firstName}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                                required
                            />
                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        {/* Last Name Field */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={profileData.lastName}
                                onChange={handleInputChange}
                                className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    } rounded`}
                                required
                            />
                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
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
                                className="w-full p-2 border ${errors.oldPassword ? 'border-red-500' : 'border-gray-300"
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
                                className="w-full p-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300"
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                            )}
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
                                <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        disabled={Object.values(errors).some((error) => error !== '')}
                    >
                        Save Changes
                    </button>
                </form>
            )}
        </div>
    );
};

export default MyProfile;