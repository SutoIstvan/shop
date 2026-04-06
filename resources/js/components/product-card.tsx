import { Link } from "@inertiajs/react"
import { Heart, Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { storageUrl } from "@/lib/image-url"
import { useCartStore } from "@/store/use-cart-store"
import { toast } from "sonner"

export interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    slug: string;
    price: number | string;
    compare_price?: number | string | null;
    images?: string[];
    category?: {
      name: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]
    ? storageUrl(product.images[0])
    : "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/White-Wireless-Earbuds-in-Charging-Case-1.jpeg"

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: product.images,
    })
    toast.success(`${product.name} added to cart`, {
      description: "You can view it in your shopping cart.",
    })
  }

  return (
    <Link href={`/product/${product.slug}`} className="group relative block">
      <div className="aspect-square overflow-hidden rounded-lg bg-background relative">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => { e.preventDefault() }}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>

        </div>
        <div className="absolute inset-x-0 bottom-8 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <Button className="mx-auto" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-1 text-center">
        <Badge variant="outline" className="mb-2">
          {product.category?.name || "Uncategorized"}
        </Badge>
        <h3 className="font-medium">{product.name}</h3>
        <div className="flex justify-center gap-2">
          {product.compare_price && (
            <span className="text-muted-foreground line-through">${Number(product.compare_price).toFixed(2)}</span>
          )}
          <span className="font-medium text-primary">${Number(product.price).toFixed(2)}</span>
        </div>
        <div className="flex justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-4 flex flex-col items-center space-y-2">
        <Skeleton className="mb-1 h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="mt-1 h-4 w-24" />
      </div>
    </div>
  )
}
