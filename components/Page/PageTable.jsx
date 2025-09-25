import React from 'react';

const PageTable = ({ columns, data, onEditClick, onDeleteClick }) => {
  const showActionsColumn = onEditClick || onDeleteClick;

  return (
    <div className="rounded-lg shadow-sm overflow-hidden flex flex-col flex-grow">
      <div className="overflow-x-auto overflow-y-auto flex-grow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {showActionsColumn && (
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className={`hover:bg-gray-100 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {column.render ? column.render(item) : item[column.accessor]}
                  </td>
                ))}
                {showActionsColumn && (
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium flex items-center">
                    {onEditClick && (
                      <button
                        onClick={() => onEditClick(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Edit"
                      >
                        <ion-icon name="create-outline"></ion-icon>
                      </button>
                    )}
                    {onDeleteClick && (
                      <button
                        onClick={() => onDeleteClick(item)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <ion-icon name="trash-outline"></ion-icon>
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageTable;
