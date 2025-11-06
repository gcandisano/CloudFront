import type { ApiResponse, Product, ProductFilters, ProductsResponse, CreateProductForm } from '@/types'
import { API_BASE_URL } from '.'

async function fetchProducts(filters: ProductFilters = {}): Promise<ApiResponse<ProductsResponse>> {
  try {
    const queryParams = new URLSearchParams()

    // Convert filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const url = `${API_BASE_URL}/api/products?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transform the API response to match our frontend types
    const transformedProducts: Product[] = data.products.map((product: Product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image_url: product.image_url,
      paused: product.paused,
      seller_id: product.seller_id,
      first_name: product.first_name,
      last_name: product.last_name,
    }))

    return {
      data: {
        products: transformedProducts,
        pagination: data.pagination,
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    // Datos hardcodeados cuando no hay backend
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        description: 'El último iPhone con chip A17 Pro y cámara de 48MP',
        category: 'Electronics',
        price: 1299.99,
        image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 1,
        first_name: 'Juan',
        last_name: 'Pérez',
        rating: 4.5,
        ratingCount: 23,
      },
      {
        id: 2,
        name: 'MacBook Air M2',
        description: 'Laptop ultradelgada con chip M2 de Apple',
        category: 'Electronics',
        price: 1199.99,
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 2,
        first_name: 'María',
        last_name: 'García',
        rating: 4.8,
        ratingCount: 45,
      },
      {
        id: 3,
        name: 'AirPods Pro',
        description: 'Auriculares inalámbricos con cancelación de ruido activa',
        category: 'Electronics',
        price: 249.99,
        image_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 1,
        first_name: 'Juan',
        last_name: 'Pérez',
        rating: 4.7,
        ratingCount: 67,
      },
      {
        id: 4,
        name: 'iPad Air',
        description: 'Tablet versátil con pantalla Liquid Retina de 10.9 pulgadas',
        category: 'Electronics',
        price: 599.99,
        image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 2,
        first_name: 'María',
        last_name: 'García',
        rating: 4.6,
        ratingCount: 34,
      },
      {
        id: 5,
        name: 'Nike Air Max 270',
        description: 'Zapatillas deportivas cómodas y modernas',
        category: 'Sports',
        price: 129.99,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 3,
        first_name: 'Carlos',
        last_name: 'López',
        rating: 4.4,
        ratingCount: 89,
      },
      {
        id: 6,
        name: 'Samsung Galaxy S24',
        description: 'Smartphone Android con pantalla AMOLED de 6.2 pulgadas',
        category: 'Electronics',
        price: 899.99,
        image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
        paused: false,
        seller_id: 1,
        first_name: 'Juan',
        last_name: 'Pérez',
        rating: 4.3,
        ratingCount: 56,
      },
    ]
    
    return {
      data: {
        products: mockProducts,
        pagination: {
          page: 1,
          limit: 10,
          total: mockProducts.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function fetchProduct(id: string): Promise<ApiResponse<Product>> {
  try {
    const url = `${API_BASE_URL}/api/products/${id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.product,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    // Datos hardcodeados cuando no hay backend
    const mockProduct: Product = {
      id: parseInt(id),
      name: 'iPhone 15 Pro',
      description: 'El último iPhone con chip A17 Pro y cámara de 48MP. Incluye pantalla Super Retina XDR de 6.1 pulgadas, sistema de cámaras Pro con zoom óptico de 3x, y batería de larga duración.',
      category: 'Electronics',
      price: 1299.99,
      image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
      paused: false,
      seller_id: 1,
      first_name: 'Juan',
      last_name: 'Pérez',
      rating: 4.5,
      ratingCount: 23,
    }
    return {
      data: mockProduct,
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function createProduct(product: CreateProductForm): Promise<ApiResponse<Product>> {
  try {
    // Prepare JSON payload - only include fields that are provided
    const payload: {
      name: string
      description: string
      category: string
      price: number
      email: string
      stock?: number
      store_name?: string
      image_url?: string
    } = {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      email: product.email
    }

    // Only add optional fields if they have values
    if (product.stock !== undefined && product.stock !== null) {
      payload.stock = product.stock
    }
    if (product.store_name) {
      payload.store_name = product.store_name
    }
    if (product.image_url) {
      payload.image_url = product.image_url
    }

    const url = `${API_BASE_URL}/api/products`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.product,
      success: true,
      message: data.message || 'Product created successfully',
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      data: null,
      success: false,
      message: 'Error creating product',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const productService = {
  fetchProducts,
  fetchProduct,
  createProduct,
}
