import { useState, useEffect } from 'react';

type SortOption = '' | 'price-low-high' | 'price-high-low';

interface DropdownProps {
  setSortOption: (option: SortOption) => void;
  initialValue?: SortOption;
}

export default function Dropdown({ 
  setSortOption, 
  initialValue = '' 
}: DropdownProps) {
  const [sortOption, setSortOptionLocal] = useState<SortOption>(initialValue);

  useEffect(() => {
    setSortOption(sortOption);
  }, [sortOption, setSortOption]);

  return (
    <div className="w-full sm:w-48">
      <select
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        value={sortOption}
        onChange={(e) => setSortOptionLocal(e.target.value as SortOption)}
      >
        <option value="">Sort by</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
      </select>
    </div>
  );
}