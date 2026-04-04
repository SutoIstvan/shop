import { useState } from "react"
import { Link, Head } from "@inertiajs/react"
import { ShoppingCart, Heart, Search, ChevronDown, Globe, User, Menu, X, Star, TruckIcon, ShieldCheck, Clock, CreditCard } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price?: number;
  images?: string[];
  category?: Category;
}

interface WelcomeProps {
  categories: Category[];
  featuredProducts: Product[];
}

export default function Welcome({ categories, featuredProducts }: WelcomeProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)



  const testimonials = [
    {
      id: 1,
      name: "Вячеслав Худокормов",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      text: "Все отлично!!! Связались быстро, оговорили заказ, отправили в срок. Спасибо большое за отличную работу. Буду сотрудничать еще.",
    },
    {
      id: 2,
      name: "Michael Brown",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 5,
      text: "The dog bed I bought is amazing quality. My furry friend hasn't left it since it arrived. Great customer service too!",
    },
    {
      id: 3,
      name: "Emily Davis",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3",
      rating: 4,
      text: "The interactive toys keep my puppy entertained for hours. Definitely coming back for more products!",
    },
  ]

  return (
    <>
      <Head title="PetDo - Everything Your Dog Needs" />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Banner */}
          <section className="relative">
            <div className="container px-4 py-12 md:px-6 md:py-24 lg:py-32">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Everything Your Dog Needs in One Place
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Premium quality products for your furry friends. From nutritious food to comfortable accessories.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="font-medium" asChild>
                      <Link href="/shop">Shop Now</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="font-medium">
                      View Deals
                    </Button>
                  </div>
                </div>
                <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden pointer-events-none">
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
                    alt="Happy dog"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Product Categories */}
          <section className="bg-muted py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-lg bg-background shadow-md transition-all hover:shadow-lg"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={category.image || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/jascent-leung--uF6u5Cmnsw-unsplash-3.jpg"}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-0 w-full p-4 pointer-events-none">
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const imageUrl = product.images?.[0] || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/White-Wireless-Earbuds-in-Charging-Case-1.jpeg";
                  return (
                    <div key={product.id} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-lg bg-background relative">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="sr-only">Add to wishlist</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Quick view</span>
                          </Button>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <Button className="mx-auto">
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
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-10 text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/shop">View All Products</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Why Our Store */}
          <section className="bg-muted py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">Why Choose PetDo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-background">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <TruckIcon className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
                    <p className="text-muted-foreground">
                      On orders over $50. Get your pet supplies delivered to your doorstep.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <ShieldCheck className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
                    <p className="text-muted-foreground">
                      All our products are carefully selected for quality and safety.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <Clock className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                    <p className="text-muted-foreground">
                      Our customer service team is available around the clock to help you.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <CreditCard className="h-10 w-10 mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                    <p className="text-muted-foreground">
                      Multiple secure payment options for your convenience and safety.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <h2 className="text-2xl font-bold tracking-tight text-center mb-8 md:text-3xl">What Our Customers Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-background">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={50}
                          height={50}
                          className="rounded-full object-cover w-[50px] h-[50px]"
                        />
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{testimonial.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="bg-primary text-primary-foreground py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Join Our Newsletter</h2>
                <p className="max-w-[600px] text-primary-foreground/90 md:text-lg">
                  Subscribe to get special offers, free giveaways, and pet care tips.
                </p>
                <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                  <Input type="email" placeholder="Enter your email" className="bg-primary-foreground text-foreground" />
                  <Button variant="secondary">Subscribe</Button>
                </div>
                <p className="text-xs text-primary-foreground/70">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
