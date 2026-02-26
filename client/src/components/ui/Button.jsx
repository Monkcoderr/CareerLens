import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md',
  secondary:
    'bg-white hover:bg-slate-50 text-txt-primary border border-border shadow-sm',
  ghost:
    'bg-transparent hover:bg-slate-100 text-txt-secondary',
  dark:
    'bg-surface-dark hover:bg-slate-800 text-white shadow-sm',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-3.5 text-base',
};

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          font-semibold rounded-xl
          transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;