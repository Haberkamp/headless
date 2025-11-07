import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { Separator } from './index'

describe('given a default Separator', () => {
  it('should have horizontal orientation', () => {
    render(<Separator data-testid="separator" />)

    expect(page.getByTestId('separator')).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('should have separator role', () => {
    render(<Separator data-testid="separator" />)

    expect(page.getByTestId('separator')).toHaveAttribute('role', 'separator')
  })

  it('should not have aria-orientation for horizontal', () => {
    render(<Separator data-testid="separator" />)

    expect(page.getByTestId('separator')).not.toHaveAttribute('aria-orientation')
  })
})

describe('given a vertical Separator', () => {
  it('should have vertical orientation', () => {
    render(<Separator data-testid="separator" orientation="vertical" />)

    expect(page.getByTestId('separator')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('should have separator role', () => {
    render(<Separator data-testid="separator" orientation="vertical" />)

    expect(page.getByTestId('separator')).toHaveAttribute('role', 'separator')
  })

  it('should have aria-orientation for vertical', () => {
    render(<Separator data-testid="separator" orientation="vertical" />)

    expect(page.getByTestId('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })
})

describe('given a decorative Separator', () => {
  it('should have none role', () => {
    render(<Separator data-testid="separator" decorative />)

    expect(page.getByTestId('separator')).toHaveAttribute('role', 'none')
  })

  it('should not have aria-orientation', () => {
    render(<Separator data-testid="separator" decorative />)

    expect(page.getByTestId('separator')).not.toHaveAttribute('aria-orientation')
  })

  it('should still have data-orientation', () => {
    render(<Separator data-testid="separator" decorative />)

    expect(page.getByTestId('separator')).toHaveAttribute('data-orientation', 'horizontal')
  })
})

describe('given a decorative vertical Separator', () => {
  it('should have none role', () => {
    render(<Separator data-testid="separator" decorative orientation="vertical" />)

    expect(page.getByTestId('separator')).toHaveAttribute('role', 'none')
  })

  it('should not have aria-orientation', () => {
    render(<Separator data-testid="separator" decorative orientation="vertical" />)

    expect(page.getByTestId('separator')).not.toHaveAttribute('aria-orientation')
  })

  it('should have vertical data-orientation', () => {
    render(<Separator data-testid="separator" decorative orientation="vertical" />)

    expect(page.getByTestId('separator')).toHaveAttribute('data-orientation', 'vertical')
  })
})

describe('given a Separator with children', () => {
  it('should render children', () => {
    render(
      <Separator data-testid="separator">
        <span>Content</span>
      </Separator>,
    )

    expect(page.getByText('Content')).toBeInTheDocument()
  })
})
