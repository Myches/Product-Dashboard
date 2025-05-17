
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProduct } from '@/services/apiService';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from '@/types/types';

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: string[];
}

interface ProductFormData {
  name: string;
  price: string | number;
  description: string;
  category: string;
  rating: number;
}

export default function AddProductForm({ isOpen, onClose, onSuccess, categories }: AddProductFormProps) {
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    category: '',
    rating: 0
  });
  
  // New category state
  const [isNewCategory, setIsNewCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');

  // Add mutation
  const addMutation = useMutation({
    mutationFn: (data: Omit<Product, 'id'>) => addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
      onSuccess();
      toast.success("Product Added Successfully");
    },
    onError: (error: Error) => {
      console.error('Add error:', error);
      toast.error("Failed to Add Product, Please try again.");
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle category select change
  const handleCategoryChange = (value: string) => {
    if (value === 'new') {
      setIsNewCategory(true);
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    } else {
      setIsNewCategory(false);
      setFormData(prev => ({
        ...prev,
        category: value
      }));
    }
  };

  // Handle new category input change
  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewCategory(value);
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      rating: 0
    });
    setIsNewCategory(false);
    setNewCategory('');
  };

  // Handle form close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle add product form submission
  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Convert form data to the required format for API
    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      price: typeof formData.price === 'string' ? parseFloat(formData.price) || 0 : formData.price,
      description: formData.description,
      category: formData.category,
      rating: formData.rating
    };
    
    addMutation.mutate(productData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddProduct}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price.toString()}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select
                  value={isNewCategory ? 'new' : formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">New Category</SelectItem>
                  </SelectContent>
                </Select>
                {isNewCategory && (
                  <Input
                    className="mt-2"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    required={isNewCategory}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="cursor-pointer" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={addMutation.isPending}>
              {addMutation.isPending ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}