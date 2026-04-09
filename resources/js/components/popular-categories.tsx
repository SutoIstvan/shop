import { Link } from '@inertiajs/react'

interface Category {
  id: number
  name: string
  slug: string
  image?: string
}

interface PopularCategoriesProps {
  categories: Category[]
}

export function PopularCategories({ categories }: PopularCategoriesProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Popular Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Up to 50% off Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center"
            >
              {/* Circular Image Container */}
              <div className="relative w-full aspect-square mb-3 rounded-full overflow-hidden bg-muted">
                <img
                  src={category.image || 'https://ochaka.vercel.app/images/category/cate-12.jpg'}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Category Info */}
              <div className="text-center">
                <h3 className="font-semibold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
