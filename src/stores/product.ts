import { defineStore } from 'pinia'
import type { Product, CreateProductForm } from '@/types'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    categories: [
      'Electronics',
      'Clothing',
      'Books',
      'Home & Garden',
      'Sports',
      'Toys',
      'Beauty',
      'Automotive',
    ] as string[],
  }),

  actions: {
    async createProduct(form: CreateProductForm) {
      try {
        // TODO: Implementar cuando tengas la API lista
        // const formData = new FormData()
        // formData.append('name', form.name)
        // formData.append('description', form.description)
        // formData.append('category', form.category)
        // formData.append('price', form.price.toString())
        // if (form.image) {
        //   formData.append('image', form.image)
        // }
        // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        // })
        // if (!response.ok) throw new Error('Error creating product')
        // return await response.json()

        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simular respuesta exitosa
        return {
          id: Math.random().toString(36).substr(2, 9),
          ...form,
          imageId: form.image ? URL.createObjectURL(form.image) : undefined,
          sellerId: 'store1',
          rating: 0,
          ratingCount: 0,
          paused: false,
          seller: {
            firstName: 'Juan',
            store: {
              storeId: 'store1',
              storeName: 'TechStore',
              storeImageId: null,
            },
          },
        }
      } catch (error) {
        console.error('Error creating product:', error)
        throw error
      }
    },
  },
})
