'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { TeamMember } from '../../utils/data';

export default function Team() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/team')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load team data');
                return res.json();
            })
            .then((data) => {
                setMembers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Could not load team members. Please try again later.');
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-background text-white pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-32">
                <h1 className="text-5xl font-bold text-center mb-16">Meet Our Team</h1>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center border border-white/10 animate-pulse">
                                <div className="w-40 h-40 bg-gray-700 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="h-4 bg-gray-700 rounded w-1/3" />
                                    <div className="h-6 bg-gray-700 rounded w-2/3" />
                                    <div className="h-4 bg-gray-700 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16">
                        <p className="text-red-400 text-lg">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && members.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">No team members to display.</p>
                    </div>
                )}

                {/* Members Grid */}
                {!loading && !error && members.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {members.map((member, index) => (
                            <div key={`${member.role}-${index}`} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center border border-white/10 hover:border-white/30 transition shadow-xl">

                                {/* Avatar */}
                                <div className="w-40 h-40 bg-gray-600 rounded-full flex-shrink-0 border-4 border-secondary overflow-hidden flex items-center justify-center">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name || member.role}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl text-gray-400">
                                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="text-center md:text-left">
                                    <p className="text-secondary font-bold uppercase tracking-wider text-sm mb-2">{member.role}</p>
                                    {member.name && (
                                        <h3 className="text-2xl font-semibold mb-3">{member.name}</h3>
                                    )}
                                    {member.bio && (
                                        <p className="text-gray-300 leading-relaxed">{member.bio}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
