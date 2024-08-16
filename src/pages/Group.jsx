import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Group = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState([]);
    const { user, BASE_URL } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(group.name);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async (e) => {
        e.preventDefault();
        axios.patch(`${BASE_URL}/groups/${id}/update`, { ...group, groupName: newName });  // can happen in bg np.
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

    useEffect(() => {
        const getGroup = async () => {
            const resp = await axios.get(`${BASE_URL}/groups/${id}`);
            const newGroup = resp.data;
            const members = await Promise.all(
                newGroup.groupMembers.map(async (memberId) => {
                    const { data } = await axios.get(`${BASE_URL}/users/${memberId}`);
                    return data;
                })
            );
            const grp = { ...newGroup, members };
            setNewName(grp.groupName);
            setGroup(grp);
        }
        getGroup();
    }, [BASE_URL]);

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
                    {group?.members?.map(member => (
                        <li key={member.id} className="flex justify-between items-center mb-2">
                            <span>{member.username}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex flex-row-reverse">
                    <button
                        className="bg-black text-white px-2 py-1 rounded ml-auto justify-end"
                        onClick={() => console.log(`Delete ${user.username}`)}
                    >
                        Leave Group
                    </button>
                </div>
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
