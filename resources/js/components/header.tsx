import { useState, useEffect } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import { ShoppingCart, Search, ChevronDown, User, Menu, X, Store, LayoutGrid } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/use-cart-store"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { sharedCategories, url } = usePage<any>().props

  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Hydration fix for persist
  const [isHydrated, setIsHydrated] = useState(false)
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setSearchQuery(params.get('search') || "")
    }
  }, [url])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.get('/shop', { search: searchQuery }, { preserveState: true })
    } else {
      router.get('/shop')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo-shop-3.png"
              alt="Vio Logo"
              width={40}
              height={40}
              className="rounded-full bg-primary object-cover"
            />
            <span className="text-xl font-bold">Vio<span className="text-xs text-muted-foreground">.com.ua</span></span>
          </Link>
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {/* <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent cursor-pointer flex-row !items-center`}>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent cursor-pointer flex-row !items-center`}>
                    <Link href="/shop">
                      <Store className="mr-2 h-4 w-4" />
                      Shop
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col w-[300px] gap-2 p-4 md:w-[350px]">
                      {sharedCategories?.map((category: any) => (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/category/${category.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                            >
                              <div className="text-sm font-medium leading-none">{category.name}</div>
                              {category.description && (
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                  {category.description}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent cursor-pointer flex-row !items-center`}>
                    <Link href="/about">About</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent cursor-pointer flex-row !items-center`}>
                    <Link href="/contact">Contact</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-[200px] pl-8 md:w-[250px] rounded-full bg-muted"
              />
            </form>
          </div>

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Sign In</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {isHydrated && cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 rounded-full bg-muted"
            />
          </form>
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/shop" className="flex items-center text-sm font-medium transition-colors hover:text-primary">
              <Store className="mr-2 h-4 w-4" />
              Shop
            </Link>
            <details className="group">
              <summary className="flex cursor-pointer items-center text-sm font-medium transition-colors hover:text-primary outline-none">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Categories
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <nav className="mt-2 ml-4 flex flex-col space-y-2">
                {sharedCategories?.map((category: any) => (
                  <Link key={category.id} href={`/category/${category.slug}`} className="text-sm transition-colors hover:text-primary">
                    {category.name}
                  </Link>
                ))}
              </nav>
            </details>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
