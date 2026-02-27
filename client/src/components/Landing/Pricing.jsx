import { Check } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const plans = [
    {
        name: 'Free',
        price: '$0',
        desc: 'Perfect for getting started.',
        features: ['1 Resume Analysis / mo', '3 AI Cover Letters', 'Basic Interview Prep', 'Community Access'],
    },
    {
        name: 'Pro',
        price: '$19',
        desc: 'For serious job seekers.',
        features: ['Unlimited Resume Analysis', 'Unlimited AI Cover Letters', 'Advanced Mock Interviews', 'Real-time Market Insights', 'Priority Support'],
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        desc: 'For university & teams.',
        features: ['Batch Analysis', 'Custom AI Training', 'Team Analytics', 'Dedicated Manager'],
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="section-padding bg-white">
            <div className="container-main">
                <div className="text-center mb-16">
                    <h2 className="h2 mb-4">Simple, Transparent Pricing</h2>
                    <p className="body-large">Choose the plan that fits your career goals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((p, idx) => (
                        <Card
                            key={idx}
                            className={`p-8 relative flex flex-col ${p.popular ? 'bg-primary-900 border-primary-900 text-white shadow-heavy' : 'bg-white'}`}
                        >
                            {p.popular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary-500 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="h3 mb-2">{p.name}</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{p.price}</span>
                                {p.price !== 'Custom' && <span className={`text-sm ${p.popular ? 'text-primary-200' : 'text-txt-muted'}`}>/month</span>}
                            </div>
                            <p className={`text-[15px] mb-8 ${p.popular ? 'text-primary-100' : 'text-txt-muted'}`}>{p.desc}</p>

                            <ul className="space-y-4 mb-10 flex-1">
                                {p.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        <Check size={18} className={p.popular ? 'text-primary-400' : 'text-primary-500'} />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={p.popular ? 'primary' : 'secondary'}
                                className={`w-full ${p.popular ? 'bg-white text-primary-900 hover:bg-primary-50 border-0' : ''}`}
                            >
                                Get Started
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
