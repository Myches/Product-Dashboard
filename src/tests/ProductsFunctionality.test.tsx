import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Products from '@/pages/Products';
import { useQuery } from '@tanstack/react-query';

// Mock the API calls and hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

// Mock child components
vi.mock('@/components/AddProductForm', () => ({
  default: () => <div>AddProductForm</div>,
}));
vi.mock('@/components/EditProductForm', () => ({
  default: () => <div>EditProductForm</div>,
}));
vi.mock('@/components/ProductDetailsModal', () => ({
  default: () => <div>ProductDetailsModal</div>,
}));
vi.mock('@/components/DeleteConfirmationModal', () => ({
  default: () => <div>DeleteConfirmationModal</div>,
}));
vi.mock('@/components/Pagination', () => ({
  default: () => <div>Pagination</div>,
}));
vi.mock('@/components/Dropdown', () => ({
  default: ({ setSortOption }: { setSortOption: (value: string) => void }) => (
    <select onChange={(e) => setSortOption(e.target.value)}>
      <option value="">Default</option>
      <option value="price-low-high">Price: Low to High</option>
      <option value="price-high-low">Price: High to Low</option>
    </select>
  ),
}));
vi.mock('@/components/SearchInput', () => ({
  default: ({ setSearchTerm }: { setSearchTerm: (value: string) => void }) => (
    <input 
      type="text" 
      placeholder="Search..." 
      onChange={(e) => setSearchTerm(e.target.value)} 
    />
  ),
}));
vi.mock('@/components/CategoryFilter', () => ({
  default: ({ setCategoryFilter }: { setCategoryFilter: (value: string) => void }) => (
    <select onChange={(e) => setCategoryFilter(e.target.value)}>
      <option value="">All Categories</option>
      <option value="Electronics">Electronics</option>
      <option value="Clothing">Clothing</option>
    </select>
  ),
}));
vi.mock('@/components/ProductsTable', () => ({
  default: ({ currentProducts }: { currentProducts: any[] }) => (
    <div>
      {currentProducts.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  ),
}));

const mockProducts = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 2, name: 'Smartphone', category: 'Electronics', price: 699.99 },
  { id: 3, name: 'T-Shirt', category: 'Clothing', price: 19.99 },
  { id: 4, name: 'Jeans', category: 'Clothing', price: 49.99 },
];

describe('Products Component', () => {
  beforeEach(() => {
    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data: mockProducts,
      isLoading: false,
      error: null,
    }));
  });

  it('renders without crashing', () => {
    render(<Products />);
    expect(screen.getByText('Product Management Dashboard')).toBeInTheDocument();
  });

  describe('Search Functionality', () => {
    it('filters products by search term', () => {
      render(<Products />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Laptop' } });
      
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.queryByText('Smartphone')).not.toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    });

    it('shows no products when search term matches nothing', () => {
      render(<Products />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
      
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('searches both name and category fields', () => {
      render(<Products />);
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'Electronics' } });
      
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Smartphone')).toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    });
  });

  describe('Category Filter', () => {
    it('filters products by category', () => {
      render(<Products />);
      
      const categoryFilter = screen.getAllByRole('combobox')[0];
      fireEvent.change(categoryFilter, { target: { value: 'Electronics' } });
      
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Smartphone')).toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    });

    it('shows all products when "All Categories" is selected', () => {
      render(<Products />);
      
      const categoryFilter = screen.getAllByRole('combobox')[0];
      fireEvent.change(categoryFilter, { target: { value: '' } });
      
      mockProducts.forEach(product => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });
  });

  describe('Sort Functionality', () => {
    it('sorts products by price low to high', () => {
      render(<Products />);
      
      const sortDropdown = screen.getAllByRole('combobox')[1];
      fireEvent.change(sortDropdown, { target: { value: 'price-low-high' } });
      
      const displayedProducts = screen.getAllByText(/Laptop|Smartphone|T-Shirt|Jeans/);
      expect(displayedProducts[0].textContent).toBe('T-Shirt');
      expect(displayedProducts[1].textContent).toBe('Jeans');
      expect(displayedProducts[2].textContent).toBe('Smartphone');
      expect(displayedProducts[3].textContent).toBe('Laptop');
    });

    it('sorts products by price high to low', () => {
      render(<Products />);
      
      const sortDropdown = screen.getAllByRole('combobox')[1];
      fireEvent.change(sortDropdown, { target: { value: 'price-high-low' } });
      
      const displayedProducts = screen.getAllByText(/Laptop|Smartphone|T-Shirt|Jeans/);
      expect(displayedProducts[0].textContent).toBe('Laptop');
      expect(displayedProducts[1].textContent).toBe('Smartphone');
      expect(displayedProducts[2].textContent).toBe('Jeans');
      expect(displayedProducts[3].textContent).toBe('T-Shirt');
    });

    it('returns to default order when no sort option is selected', () => {
      render(<Products />);
      
      const sortDropdown = screen.getAllByRole('combobox')[1];
      // First set to high-low
      fireEvent.change(sortDropdown, { target: { value: 'price-high-low' } });
      // Then reset to default
      fireEvent.change(sortDropdown, { target: { value: '' } });
      
      // Default order is the original array order
      const displayedProducts = screen.getAllByText(/Laptop|Smartphone|T-Shirt|Jeans/);
      expect(displayedProducts[0].textContent).toBe('Laptop');
      expect(displayedProducts[1].textContent).toBe('Smartphone');
      expect(displayedProducts[2].textContent).toBe('T-Shirt');
      expect(displayedProducts[3].textContent).toBe('Jeans');
    });
  });

  describe('Combined Filters', () => {
    it('combines search and category filters', () => {
      render(<Products />);
      
      // Set category to Electronics
      const categoryFilter = screen.getAllByRole('combobox')[0];
      fireEvent.change(categoryFilter, { target: { value: 'Electronics' } });
      
      // Search for "phone"
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'phone' } });
      
      expect(screen.getByText('Smartphone')).toBeInTheDocument();
      expect(screen.queryByText('Laptop')).not.toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    });

    it('combines all filters (search, category, sort)', () => {
      render(<Products />);
      
      // Set category to Clothing
      const categoryFilter = screen.getAllByRole('combobox')[0];
      fireEvent.change(categoryFilter, { target: { value: 'Clothing' } });
      
      // Sort by price high to low
      const sortDropdown = screen.getAllByRole('combobox')[1];
      fireEvent.change(sortDropdown, { target: { value: 'price-high-low' } });
      
      // Search for "T"
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'T' } });
      
      // Should only show T-Shirt (Jeans is filtered out by search, Electronics are filtered out by category)
      const displayedProducts = screen.getAllByText(/T-Shirt/);
      expect(displayedProducts.length).toBe(1);
      expect(displayedProducts[0].textContent).toBe('T-Shirt');
    });

    it('resets all filters when clear button is clicked', () => {
      render(<Products />);
      
      // Set some filters
      const categoryFilter = screen.getAllByRole('combobox')[0];
      fireEvent.change(categoryFilter, { target: { value: 'Clothing' } });
      
      const sortDropdown = screen.getAllByRole('combobox')[1];
      fireEvent.change(sortDropdown, { target: { value: 'price-high-low' } });
      
      const searchInput = screen.getByPlaceholderText('Search...');
      fireEvent.change(searchInput, { target: { value: 'T' } });
      
      // Click clear button
      const clearButton = screen.getByText('Clear All Filters');
      fireEvent.click(clearButton);
      
      // All products should be visible in default order
      const displayedProducts = screen.getAllByText(/Laptop|Smartphone|T-Shirt|Jeans/);
      expect(displayedProducts.length).toBe(4);
      expect(displayedProducts[0].textContent).toBe('Laptop');
      expect(displayedProducts[1].textContent).toBe('Smartphone');
      expect(displayedProducts[2].textContent).toBe('T-Shirt');
      expect(displayedProducts[3].textContent).toBe('Jeans');
    });
  });

});