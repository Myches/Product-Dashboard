import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { updateProduct } from '@/services/apiService';
import type { EditProductFormProps } from '@/types/types';





export default function EditProductForm({ isOpen, onClose, onSuccess, product, categories }: EditProductFormProps) {
  const queryClient = useQueryClient();


  const [formData, setFormData] = useState<Product>({
    id: 0, 
    name: '',
    price: 0,
    description: '',
    category: '',
    rating: 0
  });
  

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');


  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        rating: product.rating
      });
      setIsNewCategory(false);
      setNewCategory('');
    }
  }, [product]);


  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onSuccess();
      toast.success("Product Updated Successfully");
    },
    onError: (error) => {
      console.error('Edit error:', error);
      toast.error("Failed to Update Product, Please try again.");
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

  // Handle edit product form submission
  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditProduct}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
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
              <Label htmlFor="edit-rating" className="text-right">
                Rating
              </Label>
              <Input
                id="edit-rating"
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
            <Button type="button" className='cursor-pointer' onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className='cursor-pointer' disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}