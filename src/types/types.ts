

export interface Product {
id:number,
name:string,
description:string,
price:number,
category:string,
rating:number,
}

export interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: string[];
}

export interface ProductFormData {
  name: string;
  price: string | number;
  description: string;
  category: string;
  rating: number;
}

export interface CategoryFilterProps {
  categories: string[];
  setCategoryFilter: (category: string) => void;
  initialValue?: string;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: () => void;
}

export type SortOption = '' | 'price-low-high' | 'price-high-low';
export interface DropdownProps {
  setSortOption: (option: SortOption) => void;
  initialValue?: SortOption;
}

export interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
  categories: string[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ProductsTableProps {
  currentProducts: Product[];
  openDetailsModal: (product: Product) => void;
}

export interface SearchInputProps {
  setSearchTerm: (term: string) => void;
  initialValue?: string;
}

export interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}