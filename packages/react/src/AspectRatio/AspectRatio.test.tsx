import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { AspectRatio } from './index'

describe('given a default AspectRatio', () => {
  it('should render correctly', async () => {
    // ARRANGE
    render(
      <AspectRatio data-testid="aspect-ratio">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
          alt="Landscape photograph by Tobias Tullius"
        />
      </AspectRatio>,
    )

    // ASSERT
    const wrapper = page.getByTestId('aspect-ratio')
    await expect.element(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute('data-reka-aspect-ratio-wrapper')
  })

  it('should render with custom ratio', async () => {
    // ARRANGE
    render(
      <AspectRatio ratio={16 / 9} data-testid="aspect-ratio">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=300&dpr=2&q=80"
          alt="Landscape photograph by Tobias Tullius"
        />
      </AspectRatio>,
    )

    // ASSERT
    const wrapper = page.getByTestId('aspect-ratio')
    await expect.element(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveAttribute('data-reka-aspect-ratio-wrapper')
  })

  it('should pass aspect value to children function', async () => {
    // ARRANGE
    render(
      <AspectRatio ratio={16 / 9}>
        {({ aspect }) => (
          <div data-testid="content">
            Aspect:
            {' '}
            {aspect}
            %
          </div>
        )}
      </AspectRatio>,
    )

    // ASSERT
    const content = page.getByTestId('content')
    await expect.element(content).toBeInTheDocument()
    await expect.element(content).toHaveTextContent(`Aspect: ${(1 / (16 / 9)) * 100}%`)
  })
})
