import React from "react";

const ErrorCard: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className='bg-red-500 text-white p-6 rounded-md text-center'>
      <p className='mb-4'>Oops! Something went wrong: {message}</p>
    </div>
  );
};

export default ErrorCard;
