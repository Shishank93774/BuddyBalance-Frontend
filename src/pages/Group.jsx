import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import groups from '../data/groups';

const Group = ({ editGroupName, addUserToGroup }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const group = groups.find(g => g.id == id);
    console.log(id);
    console.log(groups);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(group.name);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = (e) => {
        e.preventDefault();
        // editGroupName(id, newName);
        setIsEditing(false);
    };

    const handleAddMember = () => {
        if (newMemberEmail) {
            // addUserToGroup(id, newMemberEmail);
            
            setNewMemberEmail('');
        }
    };

    const handleShowTransactions = () => {
        navigate(`/groups/${id}/transactions`);
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="border p-2 rounded"
                        />
                    ) : (
                        <h2 className="text-3xl font-bold">{newName}</h2>
                    )}
                    <div className="relative w-32 h-32">
                        <img
                            src={group.photo || '/assets/group_dp.jpg'}
                            alt={newName}
                            className="object-cover w-full h-full rounded-full"
                        />
                    </div>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                    {isEditing ? 'Save' : 'Edit Group Name'}
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-bold mb-4">Members</h3>
                <ul>
                    {group.members.map(member => (
                        <li key={member.id} className="flex justify-between items-center mb-2">
                            <span>{member}</span>
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                onClick={() => console.log(`Delete ${member}`)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
                <input
                    type="email"
                    placeholder="New member email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-700"
                    onClick={handleAddMember}
                >
                    Add Member
                </button>
            </div>

            <div className="mt-8">
                <button
                    className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-700"
                    onClick={handleShowTransactions}
                >
                    Show Transactions
                </button>
            </div>
        </div>
    );
};

export default Group;
