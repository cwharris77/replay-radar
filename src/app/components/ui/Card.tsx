import React from "react";

interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outline | error";
}

const variantClasses: Record<string, string> = {
  default: "bg-white text-gray-900",
  elevated: "bg-white text-gray-900 shadow-md",
  outline: "bg-transparent border border-gray-200 text-gray-900",
};

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = "",
  variant = "default",
}) => {
  return (
    <div
      className={`p-4 rounded-lg ${variantClasses[variant]} ${className}`.trim()}
    >
      {(title || subtitle) && (
        <div className='mb-2'>
          {title && <h3 className='text-lg font-semibold'>{title}</h3>}
          {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
        </div>
      )}
      <div className='mb-4'>{children}</div>
      {actions && <div className='flex justify-end gap-2'>{actions}</div>}
    </div>
  );
};

export default Card;
