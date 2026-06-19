import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GoldButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'gold-btn',
  secondary:
    'relative px-6 py-3 font-display font-semibold tracking-wider text-plasma-100 border border-plasma-400/60 rounded-sm bg-gradient-to-b from-plasma-500/10 to-space-500/90 transition-all duration-300 ease-out hover:border-plasma-300 hover:text-plasma-50 hover:shadow-plasma active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:text-plasma-100',
  danger:
    'relative px-6 py-3 font-display font-semibold tracking-wider text-alert-300 border border-alert-400/60 rounded-sm bg-gradient-to-b from-alert-500/10 to-space-500/90 transition-all duration-300 ease-out hover:border-alert-300 hover:text-alert-50 hover:shadow-[0_0_20px_rgba(255,77,109,0.4)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:text-alert-300',
  ghost:
    'relative px-6 py-3 font-display font-semibold tracking-wider text-stardust-200 border border-stardust-400/40 rounded-sm bg-transparent transition-all duration-300 ease-out hover:border-stardust-300 hover:bg-stardust-400/10 hover:text-stardust-50 hover:shadow-gold active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:text-stardust-200 disabled:hover:bg-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: '!px-3 !py-1.5 text-xs tracking-wider',
  md: '',
  lg: '!px-8 !py-4 text-base',
};

export const GoldButton: React.FC<GoldButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        'inline-flex items-center justify-center gap-2 select-none',
        className
      )}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

export default GoldButton;
