import { useEffect, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { ProgressIndicator, ProgressRoot } from './index'

describe('given a default Progress', () => {
  it('should contain correct value', () => {
    render(
      <ProgressRoot data-testid="progress" modelValue={0}>
        <ProgressIndicator />
      </ProgressRoot>,
    )

    expect(page.getByTestId('progress')).toHaveAttribute('data-value', '0')
  })

  describe('after 200ms', () => {
    it('should contain correct value', async () => {
      function Progress() {
        const [value, setValue] = useState(0)

        useEffect(() => {
          setTimeout(() => {
            setValue(50)
          }, 200)
        }, [])

        return (
          <ProgressRoot data-testid="progress" modelValue={value}>
            <ProgressIndicator />
          </ProgressRoot>
        )
      }

      render(<Progress />)

      expect(page.getByTestId('progress')).toHaveAttribute('data-value', '0')

      await new Promise(resolve => setTimeout(resolve, 250))

      await expect.element(page.getByTestId('progress')).toHaveAttribute('data-value', '50')
    })
  })
})
