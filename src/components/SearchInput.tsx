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
    />
  );
};

export default SearchInput;