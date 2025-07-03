interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  text?: string;
}

export default function Loading({
  size = "md",
  text = "Loading...",
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-1 h-4",
    md: "w-1 h-6",
    lg: "w-2 h-8",
    xl: "w-2 h-10",
    "2xl": "w-3 h-12",
  };

  return (
    <div className='flex flex-col items-center justify-center p-8'>
      <div className='flex space-x-1 items-end'>
        <div
          className={`${sizeClasses[size]} bg-green-500 animate-bounce`}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-green-500 animate-bounce`}
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-green-500 animate-bounce`}
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-green-500 animate-bounce`}
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-green-500 animate-bounce`}
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      {text && <p className='mt-3 text-gray-600'>{text}</p>}
    </div>
  );
}
