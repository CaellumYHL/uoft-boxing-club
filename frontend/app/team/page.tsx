import Navbar from '../../components/Navbar';
import { teamMembers } from '../../utils/data';

export default function Team() {
    return (
        <main className="min-h-screen bg-background text-white pb-20">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 mt-10">
                <h1 className="text-5xl font-bold text-center mb-16">Meet Our Team</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center border border-white/10 hover:border-white/30 transition shadow-xl">

                            {/* Image Placeholder */}
                            <div className="w-40 h-40 bg-gray-600 rounded-full flex-shrink-0 border-4 border-secondary overflow-hidden flex items-center justify-center text-4xl">
                                User
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                                <p className="text-secondary font-bold uppercase tracking-wider text-sm mb-4">{member.role}</p>
                                <p className="text-gray-300 leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
