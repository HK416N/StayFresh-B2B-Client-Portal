import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

// Debounced text input. onChange fires 300ms after the user stops typing.
const SearchBar = ({ onChange, placeholder = 'Search...' }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input);
    }, 300);

    // restart 300ms timer when input changes
    return () => clearTimeout(timer);
  }, [input, onChange]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-green-600"
      />
    </div>
  );
}

export default SearchBar;