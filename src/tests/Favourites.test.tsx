import { render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductsTable from '@/components/ProductsTable'
import type { Product } from '@/types/types'

describe('ProductsTable', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product',
      price: 10.99,
      category: 'electronics',
      rating: 4.5,
      description: 'Test description',

    }
  ]

  const mockOpenDetailsModal = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<ProductsTable currentProducts={mockProducts} openDetailsModal={mockOpenDetailsModal} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('loads favorites from localStorage on mount', () => {
    localStorage.setItem('productFavorites', JSON.stringify({ 1: true }))
    
    render(<ProductsTable currentProducts={mockProducts} openDetailsModal={mockOpenDetailsModal} />)
    
   
    const heartIcon = screen.getByRole('button', { name: /remove from favorites/i })
    expect(heartIcon.querySelector('svg')).toHaveClass('text-red-500')
  })

  it('toggles favorite status when heart icon is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductsTable currentProducts={mockProducts} openDetailsModal={mockOpenDetailsModal} />)
    
    
    const heartButton = screen.getByRole('button', { name: /add to favorites/i })
    expect(heartButton.querySelector('svg')).toHaveClass('text-gray-300')
    

    await user.click(heartButton)
    
  
    expect(heartButton.querySelector('svg')).toHaveClass('text-red-500')
    expect(heartButton).toHaveAccessibleName(/remove from favorites/i)
    
  
    await user.click(heartButton)
    
 
    expect(heartButton.querySelector('svg')).toHaveClass('text-gray-300')
    expect(heartButton).toHaveAccessibleName(/add to favorites/i)
  })

  it('persists favorites to localStorage', async () => {
    const user = userEvent.setup()
    render(<ProductsTable currentProducts={mockProducts} openDetailsModal={mockOpenDetailsModal} />)
    
    
    expect(localStorage.getItem('productFavorites')).toBeNull()
    
   
    const heartButton = screen.getByRole('button', { name: /add to favorites/i })
    await user.click(heartButton)
    

    const favorites = JSON.parse(localStorage.getItem('productFavorites') || '{}')
    expect(favorites[1]).toBe(true)
    

    await user.click(heartButton)
    

    const updatedFavorites = JSON.parse(localStorage.getItem('productFavorites') || '{}')
    expect(updatedFavorites[1]).toBe(false)
  })

  it('does not trigger row click when heart icon is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductsTable currentProducts={mockProducts} openDetailsModal={mockOpenDetailsModal} />)
    
    const heartButton = screen.getByRole('button', { name: /add to favorites/i })
    await user.click(heartButton)
    
    expect(mockOpenDetailsModal).not.toHaveBeenCalled()
  })
})