import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Header from '@/components/Header'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  it('should render the logo and navigation', () => {
    renderWithRouter(<Header />)
    
    expect(screen.getByText(/hamburger paulinia/i)).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should have working navigation links', () => {
    renderWithRouter(<Header />)
    
    const menuLink = screen.getByText(/menu/i)
    const aboutLink = screen.getByText(/sobre/i)
    const contactLink = screen.getByText(/contato/i)
    
    expect(menuLink).toBeInTheDocument()
    expect(aboutLink).toBeInTheDocument()
    expect(contactLink).toBeInTheDocument()
  })

  it('should show cart icon', () => {
    renderWithRouter(<Header />)
    
    const cartIcon = screen.getByTestId('cart-icon')
    expect(cartIcon).toBeInTheDocument()
  })
}) 