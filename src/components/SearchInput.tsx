import { useState, useEffect } from 'react';

interface SearchInputProps {
  setSearchTerm: (term: string) => void;
  initialValue?: string;
}

const SearchInput = ({ setSearchTerm, initialValue = '' }: SearchInputProps) => {
  const [searchTermLocal, setSearchTermLocal] = useState(initialValue);

  useEffect(() => {
    if (setSearchTerm) {
      setSearchTerm(searchTermLocal);
    }
  }, [searchTermLocal, setSearchTerm]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchTermLocal}
      onChange={(e) => setSearchTermLocal(e.target.value)}
      className='p-2 border border-black focus:outline-none rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
    />
  );
};

export default SearchInput;