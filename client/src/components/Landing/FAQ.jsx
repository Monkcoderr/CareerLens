import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        q: "How accurate is the AI Resume Analyzer?",
        a: "Our AI is trained on over 1M+ successful resumes and uses the same ATS algorithms as Top 500 companies, providing 98% accuracy in scoring."
    },
    {
        q: "Can I use the cover letters for any industry?",
        a: "Yes! Our AI understands role-specific nuances across Tech, Finance, Healthcare, Creative, and many other industries."
    },
    {
        q: "How do mock interviews work?",
        a: "You select a role and difficulty level, and our AI conducts a verbal or text-based interview, giving you feedback on both content and delivery."
    },
    {
        q: "Is my personal data safe?",
        a: "We use AES-256 encryption. Your data is yours; we never sell it to third parties or use it to train public models."
    }
];

export default function FAQ() {
    const [open, setOpen] = useState(0);

    return (
        <section className="section-padding bg-surface-alt">
            <div className="container-main max-w-3xl">
                <h2 className="h2 text-center mb-16">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((f, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-border overflow-hidden">
                            <button
                                onClick={() => setOpen(open === idx ? -1 : idx)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface-alt transition-colors"
                            >
                                <span className="font-semibold text-txt-primary">{f.q}</span>
                                {open === idx ? <ChevronUp size={20} className="text-primary-500" /> : <ChevronDown size={20} className="text-txt-muted" />}
                            </button>
                            {open === idx && (
                                <div className="px-6 pb-6 text-txt-muted text-[15px] animate-fade-in">
                                    {f.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
