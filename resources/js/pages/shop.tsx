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
import { ProductCard } from "@/components/product-card"

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
  initialSearch?: string;
}

export default function ShopPage({ products, categories, brands, initialCategory, initialSearch }: ShopProps) {
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedFilters, setSelectedFilters] = useState<{ categories: string[]; brands: string[] }>({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [startPage, setStartPage] = useState(1)
  const [endPage, setEndPage] = useState(1)
  const [sortBy, setSortBy] = useState("featured")
  const itemsPerPage = 9

  const resetPagination = () => {
    setStartPage(1)
    setEndPage(1)
  }

  const toggleFilter = (type: "categories" | "brands", value: string | number) => {
    resetPagination()
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
    })
    setPriceRange([0, 10000])
    resetPagination()
  }

  const renderFilterSidebar = (isMobile = false) => (
    <div className={`space-y-6 ${isMobile ? "" : "sticky top-20"}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Filters</h3>
        {(selectedFilters.categories.length > 0 ||
          selectedFilters.brands.length > 0 ||
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
                  onValueCommit={resetPagination}
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



    // Filter by price
    const prodPrice = Number(product.price)
    if (prodPrice < priceRange[0] || prodPrice > priceRange[1]) {
      return false
    }

    return true
  })

  let sortedProducts = [...filteredProducts]
  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case "price-high":
      sortedProducts.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case "newest":
      sortedProducts.sort((a, b) => b.id - a.id)
      break
    case "featured":
    default:
      break
  }


  return (
    <>
      <Head title={initialSearch ? `Search: ${initialSearch} - PetDo` : "Shop - PetDo"} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container px-4 py-8 md:px-6 md:py-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {initialSearch ? `Search Results for "${initialSearch}"` : "Shop All Products"}
              </h1>
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
                {renderFilterSidebar()}
              </div>

              {/* Filters - Mobile */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetContent side="left" className="w-full sm:max-w-md">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow down your product search</SheetDescription>
                  </SheetHeader>
                  {renderFilterSidebar(true)}
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
                      {initialSearch && (
                        <Badge 
                          variant="secondary" 
                          className="flex items-center gap-1 pl-2 pr-1 py-1"
                        >
                          <span>Search: {initialSearch}</span>
                          <Link
                            href="/shop"
                            className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20 focus:outline-none"
                            preserveState
                            preserveScroll
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Link>
                        </Badge>
                      )}
                      {selectedFilters.categories.map((category) => (
                        <Badge 
                          key={`cat-${category}`} 
                          variant="secondary" 
                          className="flex items-center gap-1 pl-2 pr-1 py-1"
                        >
                          <span>{category}</span>
                          <button
                            type="button"
                            className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20 focus:outline-none"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFilter("categories", category);
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </Badge>
                      ))}
                      {selectedFilters.brands.map((brand) => (
                        <Badge 
                          key={`brand-${brand}`} 
                          variant="secondary" 
                          className="flex items-center gap-1 pl-2 pr-1 py-1"
                        >
                          <span>{brand}</span>
                          <button
                            type="button"
                            className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20 focus:outline-none"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFilter("brands", brand);
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </Badge>
                      ))}
                      {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                        <Badge 
                          variant="secondary" 
                          className="flex items-center gap-1 pl-2 pr-1 py-1"
                        >
                          <span>${priceRange[0]} - ${priceRange[1]}</span>
                          <button
                            type="button"
                            className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20 focus:outline-none"
                            onClick={(e) => {
                              e.preventDefault();
                              setPriceRange([0, 10000]);
                              resetPagination();
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-muted-foreground hidden sm:inline">{filteredProducts.length} products</span>
                    <Select value={sortBy} onValueChange={(val) => { setSortBy(val); resetPagination(); }}>
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
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.slice((startPage - 1) * itemsPerPage, endPage * itemsPerPage).map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                      ))}
                    </div>

                    {/* Pagination Options */}
                    <div className="mt-12 flex flex-col items-center gap-6">
                      {/* Show More Button */}
                      {endPage * itemsPerPage < filteredProducts.length && (
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full sm:w-auto px-12"
                          onClick={() => setEndPage(prev => prev + 1)}
                        >
                          Показать еще товары
                        </Button>
                      )}

                      {/* Pagination Numbers */}
                      <div className="flex items-center justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          disabled={startPage === 1 && endPage === 1}
                          onClick={() => {
                            const newPage = Math.max(1, startPage - 1)
                            setStartPage(newPage)
                            setEndPage(newPage)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                        >
                          <ChevronDown className="h-4 w-4 rotate-90" />
                        </Button>
                        
                        {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => i + 1).map((page) => {
                          const isActive = page >= startPage && page <= endPage;
                          const isSingleActive = isActive && startPage === endPage;
                          const isMultiActive = isActive && startPage !== endPage;
                          
                          return (
                            <Button
                              key={page}
                              variant={isSingleActive ? "default" : (isMultiActive ? "secondary" : "outline")}
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setStartPage(page)
                                setEndPage(page)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                            >
                              {page}
                            </Button>
                          );
                        })}

                        <Button 
                          variant="outline" 
                          size="icon"
                          disabled={endPage === Math.ceil(filteredProducts.length / itemsPerPage) || filteredProducts.length === 0}
                          onClick={() => {
                            const newPage = Math.min(Math.ceil(sortedProducts.length / itemsPerPage), endPage + 1)
                            setStartPage(newPage)
                            setEndPage(newPage)
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }}
                        >
                          <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
