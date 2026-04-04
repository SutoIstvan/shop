import { useState } from "react"
import { Link, Head } from "@inertiajs/react"
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Minus, Plus, TruckIcon, ShieldCheck, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { storageUrl } from "@/lib/image-url"

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number | string;
  compare_price?: number | string;
  sku?: string;
  quantity?: number;
  images?: string[];
  category?: Category;
  brand?: Brand;
  in_stock?: boolean;
}

interface ProductPageProps {
  product: Product;
  relatedProducts: Product[];
}

const placeholderImage = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/White-Wireless-Earbuds-in-Charging-Case-1.jpeg"

export default function ProductPage({ product, relatedProducts }: ProductPageProps) {
  const images = product.images && product.images.length > 0 ? product.images.map(storageUrl) : [placeholderImage]
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const price = Number(product.price)
  const comparePrice = product.compare_price ? Number(product.compare_price) : null
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <Head title={`${product.name} - PetDo`} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-8 md:px-6 md:py-12">
            {/* Breadcrumbs */}
            <div className="mb-8">
              <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/shop" className="hover:text-primary">
                  Shop
                </Link>
                {product.category && (
                  <>
                    <span className="mx-2">/</span>
                    <Link href={`/category/${product.category.slug}`} className="hover:text-primary">
                      {product.category.name}
                    </Link>
                  </>
                )}
                <span className="mx-2">/</span>
                <span className="text-foreground">{product.name}</span>
              </div>
            </div>

            {/* Product Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-background relative group">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                  {discount > 0 && (
                    <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white">
                      -{discount}%
                    </Badge>
                  )}
                </div>
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                          selectedImage === index
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:border-muted-foreground/30"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {product.category && (
                      <Badge variant="outline">
                        <Link href={`/category/${product.category.slug}`}>
                          {product.category.name}
                        </Link>
                      </Badge>
                    )}
                    {product.brand && (
                      <Badge variant="secondary">
                        {product.brand.name}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(5.0)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">${price.toFixed(2)}</span>
                  {comparePrice && (
                    <span className="text-xl text-muted-foreground line-through">${comparePrice.toFixed(2)}</span>
                  )}
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-sm">Save {discount}%</Badge>
                  )}
                </div>

                <Separator />

                {product.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  </div>
                )}

                <Separator />

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Quantity</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-r-none"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-l-none"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {product.in_stock !== false ? (
                        <span className="text-sm text-green-600 font-medium">✓ In stock</span>
                      ) : (
                        <span className="text-sm text-red-500 font-medium">✗ Out of stock</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="lg" className="flex-1 font-medium">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button size="lg" variant="outline">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Product details */}
                <div className="space-y-3">
                  {product.sku && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">SKU</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Link href={`/category/${product.category.slug}`} className="font-medium hover:text-primary">
                        {product.category.name}
                      </Link>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">{product.brand.name}</span>
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="bg-muted/50">
                    <CardContent className="flex flex-col items-center text-center p-4">
                      <TruckIcon className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-xs font-medium">Free Shipping</span>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="flex flex-col items-center text-center p-4">
                      <ShieldCheck className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-xs font-medium">Quality Guarantee</span>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="flex flex-col items-center text-center p-4">
                      <RotateCcw className="h-6 w-6 mb-1 text-primary" />
                      <span className="text-xs font-medium">Easy Returns</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relProduct) => {
                    const relImageUrl = relProduct.images?.[0] ? storageUrl(relProduct.images[0]) : placeholderImage
                    return (
                      <Link key={relProduct.id} href={`/product/${relProduct.slug}`} className="group relative block">
                        <div className="aspect-square overflow-hidden rounded-lg bg-background relative">
                          <img
                            src={relImageUrl}
                            alt={relProduct.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Heart className="h-4 w-4" />
                              <span className="sr-only">Add to wishlist</span>
                            </Button>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <Button className="mx-auto" onClick={(e) => e.preventDefault()}>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 space-y-1 text-center">
                          <Badge variant="outline" className="mb-2">
                            {relProduct.category?.name || "Uncategorized"}
                          </Badge>
                          <h3 className="font-medium">{relProduct.name}</h3>
                          <div className="flex justify-center gap-2">
                            {relProduct.compare_price && (
                              <span className="text-muted-foreground line-through">${Number(relProduct.compare_price).toFixed(2)}</span>
                            )}
                            <span className="font-medium text-primary">${Number(relProduct.price).toFixed(2)}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
