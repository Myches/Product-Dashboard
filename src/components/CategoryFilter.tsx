import { useState, useEffect } from 'react';

interface CategoryFilterProps {
  categories: string[];
  setCategoryFilter: (category: string) => void;
  initialValue?: string;
}

export default function CategoryFilter({ 
  categories, 
  setCategoryFilter, 
  initialValue = '' 
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialValue);

  useEffect(() => {
    if (setCategoryFilter) {
      setCategoryFilter(selectedCategory);
    }
  }, [selectedCategory, setCategoryFilter]);

  return (
    <div className="w-full sm:w-48">
      <select
        className="block w-full pl-3 pr-10 py-2 text-base cursor-pointer border border-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        value={selectedCategory}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories?.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}