import { useState, useEffect } from 'react';
import type { DropdownProps } from '@/types/types';
import type { SortOption } from '@/types/types';

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
        className="block w-full pl-3 pr-10 py-2 text-base cursor-pointer border border-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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