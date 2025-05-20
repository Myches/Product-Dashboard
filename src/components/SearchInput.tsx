import { useState, useEffect } from 'react';
import type { SearchInputProps } from '@/types/types';



const SearchInput = ({ setSearchTerm, initialValue = '' }: SearchInputProps) => {
  const [searchTermLocal, setSearchTermLocal] = useState(initialValue);

  useEffect(() => {
    if (setSearchTerm) {
      setSearchTerm(searchTermLocal);
    }
  }, [searchTermLocal, setSearchTerm]);

    useEffect(() => {
    setSearchTermLocal(initialValue);
  }, [initialValue]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchTermLocal);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchTermLocal}
      onChange={(e) => setSearchTermLocal(e.target.value)}
      onKeyDown={handleKeyDown}
      className='p-2 border border-black focus:outline-none rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
    />
  );
};

export default SearchInput;