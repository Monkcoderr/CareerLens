import { CheckCircle2, ShieldCheck } from 'lucide-react';

const bullets = [
  'End-to-end encrypted storage',
  'We never sell your resume data',
  'Full privacy & data control',
  'Secure AI processing pipeline',
];

export default function Trust() {
  return (
    <section id="trust" className="bg-surface section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <h2 className="heading-2 mb-6">
              Your data is <span className="text-primary-500">yours.</span>
            </h2>
            <p className="body-text mb-8 max-w-md">
              We built CareerLens with privacy at the core. Your personal information
              and documents stay private — always.
            </p>
            <ul className="space-y-4">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-txt-secondary font-medium text-[15px]">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Floating Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-3xl shadow-elevated p-10 max-w-sm w-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-txt-primary mb-2">
                Zero Data Selling Policy
              </h3>
              <p className="text-sm text-txt-muted leading-relaxed">
                Your resume, interview data, and personal information are never
                shared with third parties or used for advertising.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}