export type Product = {
  id?: number 
  code: string
  name: string
  quantity: number
  category: string
  price: number
}

export const ProductService = {
  getAll: () => window.api.products.get() as Promise<Product[]>,
  create: (p: Product) => window.api.products.create(p),
  update: (p: Product) => window.api.products.update(p),
  delete: (id: number) => window.api.products.delete(id)
}
