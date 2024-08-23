import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import colors from '../data/colors';

const MyGroups = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, BASE_URL } = useAuth();

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        const getGroups = async () => {
            try {
                const resp = await axios.get(`${BASE_URL}/users/${user.id}/groups`);
                const groupIds = resp.data || [];

                if (groupIds.length === 0) {
                    setGroups([]);
                    setLoading(false);
                    return;
                }

                const newGroups = await Promise.all(
                    groupIds.map(async (groupId) => {
                        const { data: group } = await axios.get(`${BASE_URL}/groups/${groupId}`);

                        const members = await Promise.all(
                            group.groupMembers.map(async (memberId) => {
                                const { data: { username } } = await axios.get(`${BASE_URL}/users/${memberId}`);
                                return username;
                            })
                        );

                        return { ...group, members };
                    })
                );
                setGroups(newGroups);
            } catch (error) {
                console.error("Error fetching groups:", error);
                setError('Failed to load groups. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            getGroups();
        }
    }, [user, BASE_URL]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-xl font-semibold">Loading your groups...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 text-xl font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">My Groups</h1>
            {groups.length === 0 ? (
                <p className="text-center text-gray-600">You are not part of any groups yet. Create or join a group to get started.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className={`p-6 rounded-lg shadow-md ${getRandomColor()}`}>
                            <h2 className="text-2xl font-semibold mb-4">{group.groupName}</h2>
                            <div className="flex items-center mb-4">
                                {group.members.slice(0, 3).map((member, index) => (
                                    <div
                                        key={index}
                                        className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 -ml-2 first:ml-0"
                                    >
                                        {member[0].toUpperCase()}
                                    </div>
                                ))}
                                {group.members.length > 3 && (
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 -ml-2">
                                        +{group.members.length - 3}
                                    </div>
                                )}
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                <Link to={`/groups/${group?.id}`}>
                                    View Details
                                </Link>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyGroups;
