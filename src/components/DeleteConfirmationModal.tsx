import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DeleteConfirmationModalProps } from '@/types/types';



export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  product,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!product) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="font-medium text-gray-900">{product.name}</p>
          <p className="text-gray-500">
           GH₵{product.price.toFixed(2)} - {product.category}
          </p>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            onClick={onClose}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            className='cursor-pointer'
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}