import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MyGroups = () => {
    const [groups, setGroups] = useState([]);
    const { user, BASE_URL } = useAuth();

    const colors = [
        'bg-red-200',
        'bg-green-200',
        'bg-blue-200',
        'bg-yellow-200',
        'bg-purple-200',
        'bg-pink-200',
        'bg-indigo-200',
        'bg-teal-200',
        'bg-orange-200',
        'bg-cyan-200',
        'bg-amber-200',
        'bg-lime-200',
        'bg-fuchsia-200',
        'bg-rose-200',
        'bg-violet-200',
        'bg-emerald-200',
        'bg-sky-200'
    ];

    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    useEffect(() => {
        const getGroups = async () => {
            try {
                const groupIds = user.groups || [];
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

                console.log(newGroups);
                setGroups(newGroups);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        if (user) getGroups();
    }, [user, BASE_URL]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">My Groups</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <div key={group.id} className={`p-6 rounded-lg shadow-md ${getRandomColor()}`}>
                        <h2 className="text-2xl font-semibold mb-4">{group.groupName}</h2>
                        <div className="flex items-center mb-4">
                            {group.members.slice(0, 3).map((member, index) => (
                                <div key={index} className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 -ml-2 first:ml-0">
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
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default MyGroups;
