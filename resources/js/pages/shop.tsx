import { useState } from "react"
import { Link, Head } from "@inertiajs/react"
import { ShoppingCart, Heart, Search, ChevronDown, Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

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
  price: number | string;
  compare_price?: number | string;
  images?: string[];
  category?: Category;
  brand?: Brand;
}

interface ShopProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  initialCategory?: string;
}

export default function ShopPage({ products, categories, brands, initialCategory }: ShopProps) {
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedFilters, setSelectedFilters] = useState<{ categories: string[]; brands: string[]; ratings: number[] }>({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    ratings: [],
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)



  const toggleFilter = (type: "categories" | "brands" | "ratings", value: string | number) => {
    setSelectedFilters((prev) => {
      // @ts-ignore
      const current = [...prev[type]]
      const index = current.indexOf(value as never)

      if (index === -1) {
        current.push(value as never)
      } else {
        current.splice(index, 1)
      }

      return {
        ...prev,
        [type]: current,
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      ratings: [],
    })
    setPriceRange([0, 10000])
  }

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`space-y-6 ${isMobile ? "" : "sticky top-20"}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Filters</h3>
        {(selectedFilters.categories.length > 0 ||
          selectedFilters.brands.length > 0 ||
          selectedFilters.ratings.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 10000) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs text-primary hover:text-primary/80"
            >
              Clear all
            </Button>
          )}
      </div>

      <div className="space-y-4">
        <Accordion type="single" collapsible defaultValue="categories">
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.slug}`}
                      checked={selectedFilters.categories.includes(category.name)}
                      onCheckedChange={() => toggleFilter("categories", category.name)}
                    />
                    <Label htmlFor={`category-${category.slug}`} className="text-sm font-normal cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 px-1">
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.slug}`}
                      checked={selectedFilters.brands.includes(brand.name)}
                      onCheckedChange={() => toggleFilter("brands", brand.name)}
                    />
                    <Label htmlFor={`brand-${brand.slug}`} className="text-sm font-normal cursor-pointer">
                      {brand.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ratings">
            <AccordionTrigger>Ratings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={selectedFilters.ratings.includes(rating)}
                      onCheckedChange={() => toggleFilter("ratings", rating)}
                    />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className="text-sm font-normal cursor-pointer flex items-center"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="ml-1">& Up</span>
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )

  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (selectedFilters.categories.length > 0 && !selectedFilters.categories.includes(product.category?.name || "")) {
      return false
    }

    // Filter by brand
    if (selectedFilters.brands.length > 0 && !selectedFilters.brands.includes(product.brand?.name || "")) {
      return false
    }

    // Filter by rating
    if (selectedFilters.ratings.length > 0 && !selectedFilters.ratings.some((r) => 5 >= r)) {
      return false
    }

    // Filter by price
    const prodPrice = Number(product.price)
    if (prodPrice < priceRange[0] || prodPrice > priceRange[1]) {
      return false
    }

    return true
  })

  return (
    <>
      <Head title="Shop - PetDo" />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-8 md:px-6 md:py-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span>Shop</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters - Desktop */}
              <div className="hidden md:block w-64 shrink-0">
                <FilterSidebar />
              </div>

              {/* Filters - Mobile */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetContent side="left" className="w-full sm:max-w-md">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow down your product search</SheetDescription>
                  </SheetHeader>
                  <FilterSidebar isMobile={true} />
                </SheetContent>
              </Sheet>

              {/* Product Grid */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden flex items-center gap-2"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>

                    {/* Active filters */}
                    <div className="flex flex-wrap gap-2">
                      {selectedFilters.categories.map((category) => (
                        <Badge key={`cat-${category}`} variant="secondary" className="flex items-center gap-1">
                          {category}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter("categories", category)} />
                        </Badge>
                      ))}
                      {selectedFilters.brands.map((brand) => (
                        <Badge key={`brand-${brand}`} variant="secondary" className="flex items-center gap-1">
                          {brand}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter("brands", brand)} />
                        </Badge>
                      ))}
                      {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          ${priceRange[0]} - ${priceRange[1]}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 10000])} />
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-muted-foreground hidden sm:inline">{filteredProducts.length} products</span>
                    <Select defaultValue="featured">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest Arrivals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
                    <Button onClick={clearFilters}>Clear all filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Link key={product.id} href={`/product/${product.slug}`} className="group relative block">
                        <div className="aspect-square overflow-hidden rounded-lg bg-background relative">
                          <img
                            src={product.images?.[0] ? storageUrl(product.images[0]) : "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/White-Wireless-Earbuds-in-Charging-Case-1.jpeg"}
                            alt={product.name}
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
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Search className="h-4 w-4" />
                              <span className="sr-only">Quick view</span>
                            </Button>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <Button className="mx-auto mt-40" onClick={(e) => e.preventDefault()}>
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
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
