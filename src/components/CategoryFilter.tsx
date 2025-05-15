import { useState, useEffect } from 'react';

const CategoryFilter = ({ categories, setCategoryFilter, initialValue = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialValue);

  useEffect(() => {
    if (setCategoryFilter) {
      setCategoryFilter(selectedCategory);
    }
  }, [selectedCategory, setCategoryFilter]);

  return (
    <div className="w-full sm:w-48">
      <select
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
