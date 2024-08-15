import React from 'react';
import { Link } from 'react-router-dom';

const FallBack = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-8">
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link
                to="/"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
                Go to Homepage
            </Link>
        </div>
    );
};

export default FallBack;
