import { db } from '../db/sqlite.ts'

export type Product = {
    id?: number
    code: string
    name: string
    category: string
    quantity: number
    price: number
}

export const ProductRepo = {
    getAll(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM products ORDER BY id DESC`, [], (err, rows) => {
                if (err) reject(err)
                else resolve(rows as Product[])
            })
        })
    },

    create(product: Product) {
        console.log('Repo creating product', product)
        return new Promise<void>((resolve, reject) => {
            db.run(
                `INSERT INTO products (code, name, category, quantity, price) VALUES (?, ?, ?, ?, ?)`,
                [product.code, product.name, product.category, product.quantity, product.price],
                err => err ? reject(err) : resolve()
            )
        })
    },

    update(product: Product) {
        return new Promise<void>((resolve, reject) => {
            db.run(
                `UPDATE products SET code=?, name=?, category=?, quantity=?, price=? WHERE id=?`,
                [product.code, product.name, product.category, product.quantity,   product.price, product.id],
                err => err ? reject(err) : resolve()
            )
        })
    },

    delete(id: number) {
        return new Promise<void>((resolve, reject) => {
            db.run(`DELETE FROM products WHERE id=?`, [id],
                err => err ? reject(err) : resolve()
            )
        })
    }
}
