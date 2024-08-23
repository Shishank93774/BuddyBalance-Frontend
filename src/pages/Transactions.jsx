import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Transactions = () => {
    const { id } = useParams();
    const [showSummary, setShowSummary] = useState(false);
    const [summary, setSummary] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});
    const { BASE_URL } = useAuth();

    // Memoized cache object to store usernames
    const userCache = useMemo(() => ({}), []);

    // Function to fetch user details
    const fetchUserDetails = async (userId) => {
        const resp = await axios.get(`${BASE_URL}/users/${userId}`);
        return resp.data.username; // Assuming the API response includes a 'username' field
    };

    // Function to get the username, either from cache or API
    const getUsername = async (userId) => {
        if (userCache[userId]) {
            return userCache[userId];
        } else {
            const username = await fetchUserDetails(userId);
            userCache[userId] = username;
            return username;
        }
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!selectedUser) {
            newErrors.selectedUser = 'Please select a user';
        }
        if (!amount || amount <= 0 || amount > 10000) {
            newErrors.amount = 'Amount must be between 1 and 10000';
        }

        if (Object.keys(newErrors).length === 0) {
            // Process the entry, e.g., update the state or send to the server
            console.log(`User1 (${selectedUser}) gave ${amount}`);
            setShowForm(false); // Close the form
        } else {
            setErrors(newErrors);
        }
    };

    // Fetch and cache usernames and transactions on mount
    useEffect(() => {
        const fetchData = async () => {
            // Fetch group members and cache their usernames
            const resp = await axios.get(`${BASE_URL}/groups/${id}`);
            const mems = resp.data.groupMembers;
            await Promise.all(mems.map(async (memberId) => {
                const username = await getUsername(memberId);
                userCache[memberId] = username;
            }));

            // Fetch transactions
            const transResp = await axios.get(`${BASE_URL}/groups/${id}/transactions`);
            setTransactions(transResp.data);

            // Fetch summary
            const summaryResp = await axios.get(`${BASE_URL}/groups/${id}/summarize`);
            setSummary(summaryResp.data);
        };

        fetchData();
    }, [BASE_URL, id, userCache]);

    return (
        <div className="container mx-auto px-4 py-8 relative">
            {/* Transactions Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
                <ul className="space-y-4">
                    {transactions.map((transaction, index) => (
                        <li key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded">
                            <span>{userCache[transaction.from]} → {userCache[transaction.to]}</span>
                            <span>${transaction.amount} for {transaction.for}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* New Entry Button */}
            <div className="mt-8">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                >
                    New Entry
                </button>
            </div>

            {/* Summarize Button */}
            <div className="mt-8">
                <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    {showSummary ? 'Hide Summary' : 'Summarize'}
                </button>
            </div>

            {/* Summary Section */}
            {showSummary && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Summary</h2>
                    <ul className="space-y-4">
                        {Object.entries(summary).map(([personId, debts], index) => (
                            <li key={index} className="flex flex-col p-4 bg-gray-100 rounded">
                                <span>{userCache[personId]}</span>
                                <ul className="mt-2 space-y-2">
                                    {debts.map((debt, debtIndex) => (
                                        <li key={debtIndex} className="flex justify-between">
                                            <span>Owes to: {userCache[debt.to]}</span>
                                            <span>Amount: ${debt.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* New Entry Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
                        <h2 className="text-2xl font-semibold mb-4">New Entry</h2>
                        <form onSubmit={handleSubmit}>
                            {/* To (Search Dropdown) */}
                            <div className="mb-4">
                                <label htmlFor="to" className="block text-gray-700">To:</label>
                                <input
                                    type="text"
                                    id="to"
                                    list="userList"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full p-2 border rounded mt-1"
                                    placeholder="Search for a user"
                                />
                                <datalist id="userList">
                                    {Object.keys(userCache).map((userId, index) => (
                                        <option key={index} value={userCache[userId]} />
                                    ))}
                                </datalist>
                                {errors.selectedUser && <p className="text-red-500 text-sm">{errors.selectedUser}</p>}
                            </div>

                            {/* Amount */}
                            <div className="mb-4">
                                <label htmlFor="amount" className="block text-gray-700">Amount:</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-2 border rounded mt-1"
                                    placeholder="Enter amount"
                                />
                                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
