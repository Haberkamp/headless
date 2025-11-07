import { beforeAll, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { AvatarFallback, AvatarImage, AvatarRoot } from './index'

const FALLBACK = 'CT'
const DELAY = 350

const ImgClass = class MockImage {
  onload: () => void = () => {}
  src = ''
  eventListeners: Record<string, Array<() => void>> = {}

  constructor() {
    setTimeout(() => {
      this.onload()
      if (this.eventListeners.load) {
        this.eventListeners.load.forEach(callback => callback())
      }
    }, DELAY)
    return this
  }

  addEventListener(event: string, callback: () => void) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  removeEventListener(event: string, callback: () => void) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback)
    }
  }
}

describe('given an Avatar with fallback and a working image', () => {
  beforeAll(() => {
    ;(window.Image as any) = ImgClass
  })

  it('should render the fallback initially', () => {
    render(
      <AvatarRoot>
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback>{FALLBACK}</AvatarFallback>
      </AvatarRoot>,
    )

    expect(page.getByText(FALLBACK)).toBeInTheDocument()
  })

  it('should render the image, but show `display:none` initially', () => {
    render(
      <AvatarRoot>
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback>{FALLBACK}</AvatarFallback>
      </AvatarRoot>,
    )

    const image = page.getByAltText('Colm Tuite')
    expect(image).toBeInTheDocument()
    expect(image).toHaveStyle({ display: 'none' })
  })

  it('should have alt text on the image', () => {
    render(
      <AvatarRoot>
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback>{FALLBACK}</AvatarFallback>
      </AvatarRoot>,
    )

    expect(page.getByAltText('Colm Tuite')).toBeInTheDocument()
  })

  it('should hide fallback after image loaded', async () => {
    render(
      <AvatarRoot>
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback>{FALLBACK}</AvatarFallback>
      </AvatarRoot>,
    )

    expect(page.getByText(FALLBACK)).toBeInTheDocument()

    await new Promise(resolve => setTimeout(resolve, DELAY + 100))

    await expect.element(page.getByText(FALLBACK)).not.toBeInTheDocument()
  })
})

describe('given an Avatar with fallback and delayed render', () => {
  beforeAll(() => {
    ;(window.Image as any) = ImgClass
  })

  it('should not render a fallback immediately', async () => {
    render(
      <AvatarRoot>
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback delayMs={300}>{FALLBACK}</AvatarFallback>
      </AvatarRoot>,
    )

    await expect.element(page.getByText(FALLBACK)).not.toBeInTheDocument()
  })

  it('should render a fallback after the delay', async () => {
    render(
      <AvatarRoot>
        <AvatarImage
          src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          alt="Colm Tuite"
        />
        <AvatarFallback delayMs={300}>{FALLBACK}</AvatarFallback>
      </AvatarRoot>,
    )

    await new Promise(resolve => setTimeout(resolve, 350))

    expect(page.getByText(FALLBACK)).toBeInTheDocument()
  })
})
