import React from "react";

const PageTable = ({ columns, data, onEditClick, onDeleteClick }) => {
  const showActionsColumn = onEditClick || onDeleteClick;

  return (
    <div className="flex flex-grow flex-col overflow-hidden rounded-lg shadow-sm">
      <div className="flex-grow overflow-x-auto overflow-y-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="border-b bg-gray-100">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
                >
                  {column.header}
                </th>
              ))}
              {showActionsColumn && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-100 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                  >
                    {column.render
                      ? column.render(item)
                      : item[column.accessor]}
                  </td>
                ))}
                {showActionsColumn && (
                  <td className="flex items-center whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {onEditClick && (
                      <button
                        onClick={() => onEditClick(item)}
                        className="mr-3 text-indigo-600 hover:text-indigo-900"
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
