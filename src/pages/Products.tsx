import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddProductForm from '@/components/AddProductForm';
import EditProductForm from '@/components/EditProductForm';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { fetchProducts, deleteProduct } from '@/services/apiService';
import Pagination from '@/components/Pagination'; 
import type { Product } from '@/types/types';
import Dropdown from '@/components/Dropdown';
import SearchInput from '@/components/SearchInput';
import CategoryFilter from '@/components/CategoryFilter';
import ProductsTable from '@/components/ProductsTable';

type SortOption = '' | 'price-low-high' | 'price-high-low';

export default function Products() {
  const queryClient = useQueryClient();

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
  // State for selected product
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 12; // Increased from 10 to 12 for better grid layout

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('');

  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDeleteModalOpen(false);
      toast.success("Product Deleted Successfully");
    },
    onError: (error: Error) => {
      console.error('Delete error:', error);
      toast.error("Failed to Delete Product, Please try again.");
    }
  });

  // Open modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const openDetailsModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  // Handle add success
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  };

  // Filter and sort products
  const filteredAndSortedProducts = products ? [...products].filter(product => {
    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      if (!product.name.toLowerCase().includes(lowercasedSearch) && 
          !product.category.toLowerCase().includes(lowercasedSearch)) {
        return false;
      }
    }
    
    // Apply category filter
    if (categoryFilter && product.category !== categoryFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    if (sortOption === 'price-low-high') {
      return a.price - b.price;
    } else if (sortOption === 'price-high-low') {
      return b.price - a.price;
    }
    return 0;
  }) : [];

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, sortOption]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-300 border-l-blue-300 border-r-blue-300 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading Products...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex items-center text-red-500 mb-4">
          <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold">Error Occurred</h2>
        </div>
        <p className="text-gray-700 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Calculate pagination details
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  // Get current products for display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Categories from products
  const categories = products 
    ? [...new Set(products.map(product => product.category))]
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 
        <div className="p-6 mb-8">


          <div className='flex flex-col justify-center items-center '>
              <h1 className="md:text-4xl text-3xl font-semibold text-gray-900 mb-4">Product Management Dashboard</h1>
          </div>

            <div className='w-auto md:flex-row flex flex-col md:justify-between py-5 md:space-y-0 space-y-2'>           
                <Button 
              onClick={openAddModal} 
              className="bg-black hover:bg-gray-700 text-white px-6 py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center  cursor-pointer "
            >
              <svg className="w-5 h-5 mr-2 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Product
            </Button>

             <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 cursor-pointer">
               <div className="flex items-center justify-between">
              {searchTerm || categoryFilter || sortOption ? (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setSortOption('');
                  }}
                  className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All Filters
                </button>
              ) : null}
            </div>
              <SearchInput setSearchTerm={setSearchTerm} initialValue={searchTerm} />
              <CategoryFilter categories={categories} setCategoryFilter={setCategoryFilter} initialValue={categoryFilter} />
              <Dropdown setSortOption={setSortOption} initialValue={sortOption} />
            </div>
            </div>
              <p className="text-sm text-gray-500 py-2">
                Showing {totalProducts > 0 ? indexOfFirstProduct + 1 : 0}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} products
              </p>
            
           
    

          {/* Products Grid */}
          <ProductsTable currentProducts={currentProducts} openDetailsModal={openDetailsModal} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddProductForm 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        categories={categories}
      />

      {selectedProduct && (
        <>
          <EditProductForm 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleEditSuccess}
            product={selectedProduct}
            categories={categories}
          />

          <ProductDetailsModal 
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            product={selectedProduct}
            onEdit={() => {
              setIsDetailsModalOpen(false);
              openEditModal(selectedProduct);
            }}
            onDelete={() => {
              setIsDetailsModalOpen(false);
              openDeleteModal(selectedProduct);
            }}
          />

          <DeleteConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            product={selectedProduct}
            onConfirm={handleDeleteProduct}
          />
        </>
      )}
    </div>
  );
}