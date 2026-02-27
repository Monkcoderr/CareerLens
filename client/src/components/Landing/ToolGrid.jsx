import { FileText, Mail, MessageSquare, TrendingUp, Search, Target } from 'lucide-react';
import Card from '../ui/Card';

const tools = [
    { icon: FileText, title: 'Resume Analyzer', desc: 'ATS-optimized feedback' },
    { icon: Mail, title: 'Cover Letter Gen', desc: 'Role-specific tailoring' },
    { icon: MessageSquare, title: 'AI Mock Interviews', desc: 'Real-time performance feedback' },
    { icon: Target, title: 'Goal Setting', desc: 'Plan your career path' },
    { icon: Search, title: 'Market Insights', desc: 'Real-time demand tracking' },
    { icon: TrendingUp, title: 'Job Tracker', desc: 'Visual application board' },
];

export default function ToolGrid() {
    return (
        <section className="section-padding bg-surface-alt">
            <div className="container-main">
                <div className="text-center mb-16">
                    <h2 className="h2 mb-4">Explore our full suite of AI Career Tools</h2>
                    <p className="body-large max-w-2xl mx-auto">Everything you need to navigate the modern job market with confidence.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((t, idx) => (
                        <Card key={idx} hover className="p-8 group bg-white">
                            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                                <t.icon size={24} />
                            </div>
                            <h3 className="h3 mb-2">{t.title}</h3>
                            <p className="text-txt-muted">{t.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
