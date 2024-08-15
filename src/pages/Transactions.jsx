import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import groups from '../data/groups';

const Transactions = () => {
    const { id } = useParams();
    const [showSummary, setShowSummary] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState({});

    const user1 = "Emily"; // Assume user1 is "Emily"

    // Find the group by ID
    const group = groups.find(group => group.id === parseInt(id));

    if (!group) {
        return <div className="container mx-auto px-4 py-8">Group not found.</div>;
    }

    // Generate a list of users in the group excluding the current user
    const groupMembers = group.members.filter(member => member !== user1);

    const generateSummary = () => {
        const summary = {};

        group.transactions.forEach(({ from, to, amount }) => {
            if (!summary[from]) summary[from] = { owes: 0, gets: 0 };
            if (!summary[to]) summary[to] = { owes: 0, gets: 0 };

            summary[from].owes += amount;
            summary[to].gets += amount;
        });

        return summary;
    };

    const summary = generateSummary();

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
            console.log(`User1 (${user1}) gave ${amount} to ${selectedUser}`);
            setShowForm(false); // Close the form
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 relative">
            <h1 className="text-3xl font-bold mb-8">{group.name}</h1>

            {/* Transactions Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
                <ul className="space-y-4">
                    {group.transactions.map((transaction, index) => (
                        <li key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded">
                            <span>{transaction.from} → {transaction.to}</span>
                            <span>${transaction.amount} for {transaction.description}</span>
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
                        {Object.entries(summary).map(([person, { owes, gets }], index) => (
                            <li key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded">
                                <span>{person}</span>
                                <span>
                                    Owes: ${owes} | Gets: ${gets}
                                </span>
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
                                    {groupMembers.map((member, index) => (
                                        <option key={index} value={member} />
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
