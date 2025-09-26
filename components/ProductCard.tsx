import { useCartStore } from '../store/cart';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
};

export function ProductCard({ id, name, price, image_url }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          {image_url ? (
            <img 
              src={image_url} 
              alt={name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-400 text-sm">No Image</div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[2.5rem]">{name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">${price.toFixed(2)}</span>
            <Button
              onClick={() => addToCart({ id, name, price, image_url: image_url || '', quantity: 1 })}
              size="sm"
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
