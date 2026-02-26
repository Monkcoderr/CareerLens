export default function Card({ className = '', hover = false, children, ...props }) {
  return (
    <div
      className={`
        bg-white rounded-3xl border border-border
        ${hover ? 'hover:shadow-card hover:-translate-y-1 transition-all duration-300 cursor-pointer' : 'shadow-soft'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}