interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
}

export const LogoutIcon = ({
  width = 20,
  height = 20,
  className = "text-muted-foreground",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={strokeWidth}
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
    <polyline points='16 17 21 12 16 7' />
    <line x1='21' y1='12' x2='9' y2='12' />
  </svg>
);

export const LoginIcon = ({
  width = 20,
  height = 20,
  className = "text-muted-foreground",
  strokeWidth = 2,
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={strokeWidth}
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4' />
    <polyline points='10 17 15 12 10 7' />
    <line x1='15' y1='12' x2='3' y2='12' />
  </svg>
);

export const UserIcon = ({
  width = 20,
  height = 20,
  className = "text-muted-foreground",
}: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
  >
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' />
  </svg>
);
