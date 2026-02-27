import { CheckCircle2, ShieldCheck, Mail, BookOpen, Globe } from 'lucide-react';
import Card from '../ui/Card';

const resources = [
  {
    title: 'The AI Resume Guide',
    desc: 'How to optimize your resume for 2026 hiring trends.',
    image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&q=80&w=400',
    icon: BookOpen
  },
  {
    title: 'Interview Strategy',
    desc: 'Master behavioral interviews with AI-backed pointers.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400',
    icon: Globe
  },
  {
    title: 'Market Trends 2026',
    desc: 'Which roles are in highest demand this quarter?',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
    icon: Mail
  },
];

export default function Trust() {
  return (
    <>
      {/* Trust / Privacy Section */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4 block">Privacy First</span>
              <h2 className="h2 mb-6">Your Data is <span className="text-primary-500">Yours.</span></h2>
              <p className="body-large mb-10">We built CareerLens with privacy at its core. Your documents stay private, and we never sell your data.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'End-to-end encryption',
                  'Zero data selling policy',
                  'Full GDPR compliance',
                  'Secure AI processing'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="font-semibold text-txt-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary-100/50 rounded-full blur-[80px]"></div>
              <Card className="p-10 text-center relative max-w-md mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-primary-50 to-primary-100">
                  <ShieldCheck size={40} className="text-primary-500" />
                </div>
                <h3 className="h3 mb-4">Enterprise-grade Security</h3>
                <p className="text-txt-muted leading-relaxed">Your resume and personal information are treated with the highest security standards in the industry.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Section */}
      <section id="resources" className="section-padding bg-surface-alt">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="h2 mb-4">Helpful Resources</h2>
              <p className="body-large">Latest insights from our career experts.</p>
            </div>
            <a href="#blog" className="text-primary-500 font-semibold hover:underline underline-offset-4">View All Resources →</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((r, idx) => (
              <Card key={idx} hover className="overflow-hidden bg-white border-0 shadow-soft">
                <img src={r.image} alt={r.title} className="w-full h-48 object-cover" />
                <div className="p-8">
                  <div className="w-10 h-10 rounded-lg bg-surface-alt flex items-center justify-center mb-6">
                    <r.icon size={20} className="text-primary-500" />
                  </div>
                  <h3 className="h3 mb-3">{r.title}</h3>
                  <p className="text-txt-muted text-[15px] mb-6">{r.desc}</p>
                  <a href="#" className="font-bold text-sm text-txt-primary hover:text-primary-500 transition-colors uppercase tracking-wider">Read Article</a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}