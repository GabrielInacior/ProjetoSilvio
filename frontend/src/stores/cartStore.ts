import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  produtoId: number
  nome: string
  preco: number
  imagemUrl?: string
  quantidade: number
}

interface CartState {
  items: CartItem[]
  add: (item: Omit<CartItem, 'quantidade'>) => void
  remove: (produtoId: number) => void
  updateQty: (produtoId: number, qty: number) => void
  clear: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.produtoId === item.produtoId)
          if (existing) {
            return { items: s.items.map((i) => i.produtoId === item.produtoId ? { ...i, quantidade: i.quantidade + 1 } : i) }
          }
          return { items: [...s.items, { ...item, quantidade: 1 }] }
        }),
      remove: (produtoId) => set((s) => ({ items: s.items.filter((i) => i.produtoId !== produtoId) })),
      updateQty: (produtoId, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.produtoId !== produtoId)
            : s.items.map((i) => i.produtoId === produtoId ? { ...i, quantidade: qty } : i),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.preco * i.quantidade, 0),
    }),
    { name: 'inovatech-cart' }
  )
)
