export const Field = ({ label, required, ...rest }) => {
  return (
    <label className="block mb-4">
      <span className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...rest}
        className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none 
                focus:border-green-600 placeholder:text-gray-300"
      />
    </label>
  );
}

export const SelectField = ({ label, options, required, ...rest }) => {
  return (
    <label className="block mb-4">
      <span className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        {...rest}
        className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

//stat card for admin home
export const StatCard = ({ label, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

// filterpill for home page filter buttons
export const FilterPill = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm border ${active
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
        }`}
    >
      {children}
    </button>
  );
}

// for details - 2 columns, labels on left values on right
export const Row = ({ label, value }) => {
  return (
    <div className="grid grid-cols-2 items-center py-3 border-b border-gray-200 last:border-0">
      <span className="text-base font-semibold text-gray-900">{label}</span>
      <span className="text-base text-gray-900 text-right">{value}</span>
    </div>
  );
}
