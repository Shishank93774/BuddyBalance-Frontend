import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') || 'login';
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const { login, BASE_URL } = useAuth();

    const clearForm = () => {
        setFormData({
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setErrors({});
        setIsFormValid(false);
    }

    const toggleForm = () => {
        clearForm();
        if (isLogin) {
            navigate('/auth?mode=signup');
        } else {
            navigate('/auth?mode=login');
        }
    };

    const validateField = (name, value) => {
        let error;

        switch (name) {
            case 'username':
                if (!value.trim()) {
                    error = 'Username is required';
                }
                break;
            case 'firstname':
                if (!value.trim()) {
                    error = 'First name is required';
                }
                break;
            case 'lastname':
                if (!value.trim()) {
                    error = 'Last name is required';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = 'Email is invalid';
                }
                break;
            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters';
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    useEffect(() => {
        setIsLogin(initialMode === 'login');
        const checkFormValidity = () => {
            const hasErrors = Object.values(errors).some((error) => error);
            const allFieldsFilled = isLogin
                ? formData.username && formData.password
                : formData.username && formData.firstname && formData.lastname && formData.email && formData.password && formData.confirmPassword;

            setIsFormValid(!hasErrors && allFieldsFilled);
        };

        checkFormValidity();
    }, [errors, formData, initialMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let resp;
            if (isLogin) {
                setFormData({ ...formData, email: formData.username });
                resp = await axios.post(`${BASE_URL}/users/login`, formData);
                console.log(resp.data);
                login(resp.data);
                setTimeout(() => {
                    navigate('/');
                }, 3000);
                toast.success('Login successful!');
            } else {
                resp = await axios.post(`{BASE_URL}/users/register`, formData);
                toast.success('Signup successful!');
                clearForm();
                navigate('/auth?mode=login');
            }
        } catch (error) {
            if (error.response && [400, 401, 404, 409].includes(error.response.status)) {
                toast.error(error.response.data);
            } else {
                toast.error('Network error. Please check your connection.');
            }
            console.error('Form submission error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 mb-32">
            <ToastContainer />
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin ? (
                        <>
                            <div className="mb-4 flex space-x-4">
                                <div className="w-1/2">
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="First Name"
                                    />
                                    {errors.firstname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
                                    )}
                                </div>
                                <div className="w-1/2">
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Last Name"
                                    />
                                    {errors.lastname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-4 flex space-x-4">
                                <div className="w-1/2">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Username"
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                    )}
                                </div>
                                <div className="w-1/2">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) :
                        (
                            <div className="mb-4">
                                <input
                                    type="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Username/Email"
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                                )}
                            </div>
                        )}

                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="mb-4">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm Password"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg transition duration-300"
                        disabled={!isFormValid}
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={toggleForm}
                        className="text-blue-500 hover:underline focus:outline-none"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
