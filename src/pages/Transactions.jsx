import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Loader from '../components/Loader';

const Transactions = () => {
    const { id } = useParams();
    const [showSummary, setShowSummary] = useState(false);
    const [summary, setSummary] = useState({});
    const [members, setMembers] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [isPart, setIsPart] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [errors, setErrors] = useState({});
    const { user, BASE_URL } = useAuth();

    // Memoized cache object to store usernames
    const idToName = useMemo(() => ({}), []);
    const nameToId = useMemo(() => ({}), []);

    // Form data state
    const [formData, setFormData] = useState({
        selectedUser: '',
        amount: '',
        for: 'loan', // Default value for "for"
    });

    // Function to fetch user details
    const fetchUserDetails = async (userId) => {
        const resp = await axios.get(`${BASE_URL}/users/${userId}`);
        return resp.data.username;
    };

    // Function to get the username, either from cache or API
    const getUsername = async (userId) => {
        if (idToName[userId]) {
            return idToName[userId];
        } else {
            const username = await fetchUserDetails(userId);
            idToName[userId] = username;
            nameToId[username] = userId;
            return username;
        }
    };

    // Function to handle form field changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!formData.selectedUser) {
            newErrors.selectedUser = 'Please select a user';
        } else if (!members.includes(formData.selectedUser)) {
            newErrors.selectedUser = 'User is not a part of the group';
        }
        if (!formData.amount || formData.amount <= 0 || formData.amount > 10000) {
            newErrors.amount = 'Amount must be between 1 and 10000';
        }

        if (Object.keys(newErrors).length === 0) {
            const newTransaction = {
                from: user.id,
                to: nameToId[formData.selectedUser],
                amount: formData.amount,
                for: formData.for,
            };

            // Add the new transaction to the backend
            await axios.post(`${BASE_URL}/groups/${id}/addTransaction`, { transaction: newTransaction });

            // Update the transactions state with the new entry
            setTransactions(prevTransactions => [...prevTransactions, newTransaction]);

            // Reset form and state
            setFormData({ selectedUser: '', amount: '', for: 'loan' });
            setShowForm(false);
            setErrors({});
        } else {
            setErrors(newErrors);
        }
    };


    const getSummary = async () => {
        setLoadingSummary(true);
        const summaryResp = await axios.get(`${BASE_URL}/groups/${id}/summarize`);
        setSummary(summaryResp.data);
        setLoadingSummary(false);
    };

    const handleSummary = (e) => {
        e.preventDefault();
        if (Object.keys(summary).length === 0) {
            getSummary();
        }
        setShowSummary(!showSummary);
    };

    // Fetch and cache usernames and transactions on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get(`${BASE_URL}/groups/${id}`);
                const mems = resp.data.groupMembers;
                await Promise.all(mems.map(async (memberId) => {
                    const username = await getUsername(memberId);
                    idToName[memberId] = username;
                    nameToId[username] = memberId;
                }));

                if (mems.find(memberId => memberId === user?.id)) {
                    setIsPart(true);
                }
                const newMembers = mems.map(newMember => idToName[newMember]);
                setMembers(newMembers);

                // Fetch transactions
                const transResp = await axios.get(`${BASE_URL}/groups/${id}/transactions`);
                setTransactions(transResp.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingTransactions(false);
            }
        };

        fetchData();
    }, [BASE_URL, id, user?.id, idToName]);

    if (Object.keys(idToName).length === 0) {
        return <Loader />;
    }

    if (!isPart) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You are not a member of this group.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 relative">
            {/* Transactions Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6 border-b-2 pb-2 text-gray-800">Transactions</h2>
                <ul className="space-y-6">
                    {transactions.map((transaction, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
                        >
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-medium text-gray-700">{idToName[transaction.from]}</span>
                                <span className="text-gray-500">→</span>
                                <span className="text-lg font-medium text-gray-700">{idToName[transaction.to]}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-semibold text-green-600">${transaction.amount}</span>
                                <p className="text-sm text-gray-500 mt-1">For {transaction.for}</p>
                            </div>
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
                    onClick={handleSummary}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    {showSummary ? 'Hide Summary' : 'Summarize'}
                </button>
            </div>

            {/* Summary Section */}
            {showSummary && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 border-b-2 pb-2 text-gray-800">Summary</h2>
                    <ul className="space-y-6">
                        {Object.entries(summary).map(([personId, debts], index) => (
                            <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-lg text-gray-700">{idToName[personId]}</span>
                                    <span className="text-sm text-gray-500">Total Debts: ${debts.reduce((sum, debt) => sum + debt.amount, 0)}</span>
                                </div>
                                <ul className="mt-4 space-y-2">
                                    {debts.map((debt, debtIndex) => (
                                        <li
                                            key={debtIndex}
                                            className="flex justify-between items-center p-3 bg-white border-l-4 border-blue-500 rounded-md shadow"
                                        >
                                            <span className="text-gray-600">Owes to: <strong>{idToName[debt.to]}</strong></span>
                                            <span className="text-gray-800 font-semibold">${debt.amount}</span>
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
                                <label htmlFor="selectedUser" className="block text-gray-700">To:</label>
                                <input
                                    type="text"
                                    id="selectedUser"
                                    list="userList"
                                    value={formData.selectedUser}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded mt-1"
                                    placeholder="Select a user..."
                                />
                                <datalist id="userList">
                                    {members.map((member, index) => (
                                        <option key={index} value={member} />
                                    ))}
                                </datalist>
                                {errors.selectedUser && <p className="text-red-600">{errors.selectedUser}</p>}
                            </div>

                            {/* Amount */}
                            <div className="mb-4">
                                <label htmlFor="amount" className="block text-gray-700">Amount:</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded mt-1"
                                    placeholder="Enter amount..."
                                />
                                {errors.amount && <p className="text-red-600">{errors.amount}</p>}
                            </div>

                            {/* For */}
                            <div className="mb-4">
                                <label htmlFor="for" className="block text-gray-700">For:</label>
                                <input
                                    type="text"
                                    id="for"
                                    value={formData.for}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded mt-1"
                                    placeholder="Enter reason..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded mr-2"
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
