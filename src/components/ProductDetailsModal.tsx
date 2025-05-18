import type { Product } from '@/types/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductDetailsModal({ 
  isOpen, 
  onClose, 
  product, 
  onEdit, 
  onDelete 
}: ProductDetailsModalProps) {
  if (!product) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="cursor-pointer sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-2xl font-bold text-gray-700 mt-1">GH₵{product.price.toFixed(2)}</p>
            </div>
            
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
              
              <div className="flex items-center mt-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
   
        <DialogFooter >
            <Button type="button"  className='cursor-pointer' onClick={onClose}>
              Cancel
            </Button>
          <Button 
       
        
            onClick={() => onEdit(product)}
            className=' cursor-pointer'
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(product)}
            className='cursor-pointer'
          >
            Delete
          </Button>
        </DialogFooter>
 
      </DialogContent>
    </Dialog>
  );
}