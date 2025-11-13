"use client"

import { Button } from "./ui/button"

export function ProductList({ products, onDelete }) {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex justify-between items-center p-4 bg-card border border-border rounded-lg hover:shadow-md hover:border-primary/30 transition-all duration-200 animate-scale-in"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>S/. {product.price.toFixed(2)}</span>
              <span className="text-primary font-medium">Stock: {product.stock}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => onDelete(product.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            ✕
          </Button>
        </div>
      ))}
    </div>
  )
}