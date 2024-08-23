import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const Group = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, BASE_URL } = useAuth();

    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMember, setIsMember] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [addMemberLoading, setAddMemberLoading] = useState(false);
    const [addMemberError, setAddMemberError] = useState('');
    const [leaveGroupLoading, setLeaveGroupLoading] = useState(false);
    const [leaveGroupError, setLeaveGroupError] = useState('');

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const { data: groupData } = await axios.get(`${BASE_URL}/groups/${id}`);

                const memberDetails = await Promise.all(
                    groupData.groupMembers.map(async (memberId) => {
                        const { data: memberData } = await axios.get(`${BASE_URL}/users/${memberId}`);
                        return memberData;
                    })
                );

                setGroup({ ...groupData, members: memberDetails });
                setNewGroupName(groupData.groupName);
                setIsMember(groupData.groupMembers.includes(user.id));
            } catch (err) {
                console.error('Error fetching group details:', err);
                setError('Failed to load group details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            setError('');
            fetchGroupDetails();
        } else {
            setLoading(false);
            setError('You must be logged in to view this page.');
        }
    }, [BASE_URL, id, user]);

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
        setNewGroupName(group.groupName);
    };

    const handleGroupNameChange = (e) => {
        setNewGroupName(e.target.value);
    };

    const handleSaveGroupName = async () => {
        if (!newGroupName.trim()) {
            setError('Group name cannot be empty.');
            return;
        }

        try {
            setLoading(true);
            axios.patch(`${BASE_URL}/groups/${id}/update`, { groupName: newGroupName });
            setGroup((prevGroup) => ({ ...prevGroup, groupName: newGroupName }));
            setIsEditing(false);
            setError('');
        } catch (err) {
            console.error('Error updating group name:', err);
            setError('Failed to update group name. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!newMemberEmail.trim()) {
            setAddMemberError('Please enter a valid email address.');
            return;
        }

        try {
            setAddMemberLoading(true);
            setAddMemberError('');

            const { data: userData } = await axios.get(`${BASE_URL}/users/getId`, {
                params: { email: newMemberEmail.trim() },
            });

            if (!userData.id) {
                setAddMemberError('User with this email does not exist.');
                return;
            }

            await axios.patch(`${BASE_URL}/groups/${id}/add`, { memberId: userData.id });

            const { data: newMemberData } = await axios.get(`${BASE_URL}/users/${userData.id}`);

            setGroup((prevGroup) => ({
                ...prevGroup,
                members: [...prevGroup.members, newMemberData],
                groupMembers: [...prevGroup.groupMembers, userData.id],
            }));

            setNewMemberEmail('');
        } catch (err) {
            console.error('Error adding new member:', err);
            setAddMemberError('Failed to add member. Please ensure the email is correct and try again.');
        } finally {
            setAddMemberLoading(false);
        }
    };

    const handleLeaveGroup = async () => {
        const confirmLeave = window.confirm('Are you sure you want to leave this group?');
        if (!confirmLeave) return;

        try {
            setLeaveGroupLoading(true);
            setLeaveGroupError('');

            await axios.patch(`${BASE_URL}/groups/${id}/remove`, { memberId: user.id });

            navigate('/groups');
        } catch (err) {
            console.error('Error leaving group:', err);
            setLeaveGroupError('Failed to leave the group. Please try again.');
        } finally {
            setLeaveGroupLoading(false);
        }
    };

    const handleShowTransactions = () => {
        navigate(`/groups/${id}/transactions`);
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!isMember) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You are not a member of this group.</p>
                    <button
                        onClick={() => navigate('/groups')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go to My Groups
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-32">
            {/* Group Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 mr-4">
                        <img
                            src={group.photo || '/assets/group_dp.jpg'}
                            alt={group.groupName}
                            className="object-cover w-full h-full rounded-full"
                        />
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={handleGroupNameChange}
                            className="border border-gray-300 p-2 rounded w-full md:w-auto"
                        />
                    ) : (
                        <h2 className="text-3xl font-bold">{group.groupName}</h2>
                    )}
                </div>
                <div className="flex mt-4 md:mt-0">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSaveGroupName}
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={handleEditToggle}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditToggle}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Edit Group Name
                        </button>
                    )}
                </div>
            </div>

            {/* Members List */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Members</h3>
                <ul className="space-y-3">
                    {group.members.map((member) => (
                        <li key={member.id} className="flex items-center justify-between bg-gray-100 p-4 rounded">
                            <div className="flex items-center">
                                <img
                                    src={member.profilePicture || '/assets/user.png'}
                                    alt={member.username}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <span className="font-medium">{member.username}</span>
                            </div>
                            {/* Optionally, add remove member functionality here */}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add Member */}
            <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-4">Add New Member</h3>
                <div className="flex flex-col md:flex-row items-center md:space-x-4">
                    <input
                        type="email"
                        placeholder="Enter member's email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full md:w-1/2"
                    />
                    <button
                        onClick={handleAddMember}
                        className="bg-green-500 text-white px-4 py-2 rounded mt-4 md:mt-0 hover:bg-green-600"
                        disabled={addMemberLoading}
                    >
                        {addMemberLoading ? 'Adding...' : 'Add Member'}
                    </button>
                </div>
                {addMemberError && (
                    <p className="text-red-500 mt-2">{addMemberError}</p>
                )}
            </div>

            {/* Group Actions */}
            <div className="flex flex-col md:flex-row md:space-x-4">
                <button
                    onClick={handleShowTransactions}
                    className="bg-purple-500 text-white px-6 py-3 rounded mb-4 md:mb-0 hover:bg-purple-600"
                >
                    View Transactions
                </button>
                <button
                    onClick={handleLeaveGroup}
                    className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
                    disabled={leaveGroupLoading}
                >
                    {leaveGroupLoading ? 'Leaving...' : 'Leave Group'}
                </button>
            </div>
            {leaveGroupError && (
                <p className="text-red-500 mt-2">{leaveGroupError}</p>
            )}
        </div>
    );
};

export default Group;
