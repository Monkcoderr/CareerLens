import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-primary-500 hover:bg-primary-600 text-white shadow-soft hover:shadow-heavy',
  secondary:
    'bg-white hover:bg-surface-alt text-txt-primary border border-border shadow-soft',
  ghost:
    'bg-transparent hover:bg-primary-50 text-primary-500',
  dark:
    'bg-surface-dark hover:bg-slate-800 text-white shadow-soft',
  outline:
    'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
};

const sizes = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-6 py-2.5 text-[15px]',
  lg: 'px-8 py-3.5 text-[16px]',
};

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2
          font-semibold rounded-lg
          transition-all duration-200
          hover:scale-[1.02] active:scale-[0.98]
          tracking-[0.02em]
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