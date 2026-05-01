import { useEffect, useState } from 'react';

// Debounced text input. onChange fires 300ms after the user stops typing.
export default function SearchBar({ onChange, placeholder = 'Search...' }) {
  const [input, setInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(input);
    }, 300);

    // restart 300ms timer when input changes
    return () => clearTimeout(timer);
  }, [input, onChange]);

  return (
    <input
      type="search"
      value={input}
      onChange={(event) => setInput(event.target.value)}
      placeholder={placeholder}
      className="w-full max-w-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
    />
  );
}