import type { Product } from "@/types/types";
import { useState, useEffect } from "react";

interface ProductsTableProps {
  currentProducts: Product[];
  openDetailsModal: (product: Product) => void;
}

const ProductsTable = ({ currentProducts, openDetailsModal }: ProductsTableProps) => {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [minHeight, setMinHeight] = useState("auto");

  // Load favorites from local storage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('productFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
  
    const table = document.querySelector('.products-table');
    if (table) {
      setMinHeight(`${table.clientHeight}px`);
    }
  }, []);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = {
        ...prev,
        [id]: !prev[id]
      };
      localStorage.setItem('productFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
 <div 
  className="flex-1 overflow-auto "
  style={{ minHeight }}
>
  <table className="min-w-full table-auto divide-y divide-gray-200 products-table text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="w-12 px-4 py-3"></th>
        <th className="px-6 py-3 text-left font-semibold text-gray-600 tracking-wide">Name</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-600 tracking-wide">Price</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-600 tracking-wide">Category</th>
        <th className="px-6 py-3 text-left font-semibold text-gray-600 tracking-wide">Rating</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 bg-white">
      {currentProducts.length > 0 ? (
        currentProducts.map((product) => (
          <tr 
            key={product.id}
            className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
            onClick={() => openDetailsModal(product)}
          >
            <td 
              className="px-4 py-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => toggleFavorite(product.id, e)}
                className="focus:outline-none hover:scale-110 transition-transform"
                aria-label={favorites[product.id] ? "Remove from favorites" : "Add to favorites"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${favorites[product.id] ? 'text-red-500' : 'text-gray-300 group-hover:text-red-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium group-hover:text-indigo-600">
              {product.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
              GH₵{product.price}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-block rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 capitalize">
                {product.category}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-gray-500 text-sm ml-1">{product.rating.toFixed(1)}</span>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="px-6 py-12 text-center">
            <div className="text-gray-400">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search or filter</p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

  )
}

export default ProductsTable;