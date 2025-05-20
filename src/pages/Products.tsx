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


  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 12; 


  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('');

 
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

 
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  };

 
  const filteredAndSortedProducts = products ? [...products].filter(product => {
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
    <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading Products...
      </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-r from-rose-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all duration-500 hover:shadow-2xl">
        <div className="flex items-center text-red-500 mb-6">
          <svg className="w-10 h-10 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold">Error Occurred</h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>
    </div>
  );

  
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  
  // Get current products for display
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

 
  const categories = products 
    ? [...new Set(products.map(product => product.category))]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 
        <div className="p-6 mb-8">
          <div className="flex flex-col justify-center items-center mb-8">
            <div className=" mb-6">
              <h1 className="md:text-5xl text-2xl font-bold text-center  ">
                Product Management Dashboard
              </h1>
              <div className="h-1 w-24 bg-neutral-800 mx-auto mt-4 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-center max-w-2xl text-lg">
              Manage your product inventory with ease. Add, edit, and delete products with a simple interface.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="md:flex justify-between items-center mb-6">
              <Button 
                onClick={openAddModal} 
                className="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer font-medium text-md mb-4 md:mb-0 w-full md:w-auto transform hover:translate-y-px"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Product
              </Button>
              
              <div className="flex items-center text-sm">
                <svg className="w-4 h-4 text-indigo-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-500">
                  Showing {totalProducts > 0 ? indexOfFirstProduct + 1 : 0}-{Math.min(indexOfLastProduct, totalProducts)} of {totalProducts} products
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                <div className="flex-grow">
                  <SearchInput setSearchTerm={setSearchTerm} initialValue={searchTerm} />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                  <CategoryFilter categories={categories} setCategoryFilter={setCategoryFilter} initialValue={categoryFilter} />
                  <Dropdown setSortOption={setSortOption} initialValue={sortOption} />
                </div>
              </div>
              
              {(searchTerm || categoryFilter || sortOption) && (
                <div className="flex items-center mt-3 px-2 py-1 bg-indigo-50 rounded-lg w-fit">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('');
                      setSortOption('');
                    }}
                    className="text-sm cursor-pointer text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Products Display */}
            <div className="bg-white rounded-xl transition-all duration-300">
              <ProductsTable currentProducts={currentProducts} openDetailsModal={openDetailsModal} />
              
              {/* Empty state */}
              {currentProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 max-w-sm">
                    {searchTerm || categoryFilter || sortOption 
                      ? "Try adjusting your search or filter criteria to see more results." 
                      : "Add your first product to get started with inventory management."}
                  </p>
                  {(searchTerm || categoryFilter || sortOption) && (
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('');
                        setSortOption('');
                      }}
                      className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
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