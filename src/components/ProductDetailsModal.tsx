import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ProductDetailsModalProps } from '@/types/types';


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