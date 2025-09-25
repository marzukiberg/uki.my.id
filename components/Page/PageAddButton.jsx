import React from 'react';

const PageAddButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <ion-icon name="add-outline" class="mr-2"></ion-icon> {/* Added icon */}
      {children}
    </button>
  );
};

export default PageAddButton;
