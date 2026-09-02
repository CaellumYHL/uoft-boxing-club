'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSheetTeam, TeamMember } from '@/hooks/useSheetTeam';

export default function Team() {
    const { data: members, loading, error } = useSheetTeam();

    return (
        // Lighter blue background distinguishes this page from the rest (issue #18).
        <main className="min-h-screen bg-background-light text-white flex flex-col">
            <Navbar />

            <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-20">
                <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 sm:mb-16">Meet Our Team</h1>

                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center border border-white/10 animate-pulse">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-700 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="h-4 bg-gray-700 rounded w-1/3" />
                                    <div className="h-6 bg-gray-700 rounded w-2/3" />
                                    <div className="h-4 bg-gray-700 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-center py-16">
                        <p className="text-red-400 text-lg">{error}</p>
                    </div>
                )}

                {!loading && !error && members.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-300 text-lg">No team members to display.</p>
                    </div>
                )}

                {!loading && !error && members.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {members.map((member, index) => (
                            <MemberCard key={`${member.role}-${index}`} member={member} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

/** A single team member card: avatar (or initial), role, name and bio. */
function MemberCard({ member }: { member: TeamMember }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center border border-white/10 hover:border-white/30 transition shadow-xl">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-600 rounded-full flex-shrink-0 border-4 border-secondary overflow-hidden flex items-center justify-center">
                {member.image ? (
                    <img
                        src={member.image}
                        alt={member.name || member.role}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <span className="text-4xl text-gray-300">
                        {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                    </span>
                )}
            </div>

            <div className="text-center sm:text-left">
                <p className="text-secondary font-bold uppercase tracking-wider text-sm mb-2">{member.role}</p>
                {member.name && <h3 className="text-xl sm:text-2xl font-semibold mb-3">{member.name}</h3>}
                {member.bio && <p className="text-gray-300 leading-relaxed">{member.bio}</p>}
            </div>
        </div>
    );
}
