import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from './index'

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  return Object.fromEntries(formData)
}

describe('given a default RadioGroup', () => {
  it('should have a default selected', async () => {
    // ARRANGE
    render(
      <RadioGroupRoot>
        <RadioGroupItem id="r1" value="default">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r1">Default</label>

        <RadioGroupItem id="r2" value="comfortable">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r2">Comfortable</label>

        <RadioGroupItem id="r3" value="compact">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r3">Compact</label>
      </RadioGroupRoot>,
    )

    // ASSERT
    await expect.element(page.getByRole('radio', { name: 'Default' })).toBeChecked()
  })

  describe('on keyboard navigation', () => {
    it('should select next item on keydown', async () => {
      // ARRANGE
      render(
        <RadioGroupRoot>
          <RadioGroupItem id="r1" value="default">
            <RadioGroupIndicator />
          </RadioGroupItem>

          <label htmlFor="r1">Default</label>

          <RadioGroupItem id="r2" value="comfortable" disabled>
            <RadioGroupIndicator />
          </RadioGroupItem>

          <label htmlFor="r2">Comfortable</label>

          <RadioGroupItem id="r3" value="compact">
            <RadioGroupIndicator />
          </RadioGroupItem>

          <label htmlFor="r3">Compact</label>
        </RadioGroupRoot>,
      )

      await userEvent.click(page.getByRole('radio', { name: 'Default' }))

      // ACT
      await userEvent.keyboard('{ArrowDown}')

      // ASSERT
      await expect.element(page.getByRole('radio', { name: 'Default' })).not.toBeChecked()
      await expect.element(page.getByRole('radio', { name: 'Compact' })).toBeChecked()
    })

    it('should skip disabled item', async () => {
      // ARRANGE
      render(
        <RadioGroupRoot>
          <RadioGroupItem id="r1" value="default"><RadioGroupIndicator /></RadioGroupItem>
          <label htmlFor="r1">Default</label>

          <RadioGroupItem id="r2" value="comfortable" disabled><RadioGroupIndicator /></RadioGroupItem>
          <label htmlFor="r2">Comfortable</label>

          <RadioGroupItem id="r3" value="compact"><RadioGroupIndicator /></RadioGroupItem>
          <label htmlFor="r3">Compact</label>
        </RadioGroupRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('radio', { name: 'Default' }))
      await userEvent.keyboard('{ArrowDown}')

      // ASSERT
      await expect.element(page.getByRole('radio', { name: 'Comfortable' })).toHaveAttribute('data-state', 'unchecked')
      await expect.element(page.getByRole('radio', { name: 'Compact' })).toHaveFocus()
    })

    describe('on arrow up', () => {
      it('should select the first item again', async () => {
      // ARRANGE
        render(
          <RadioGroupRoot>
            <RadioGroupItem id="r1" value="default">
              <RadioGroupIndicator />
            </RadioGroupItem>

            <label htmlFor="r1">Default</label>

            <RadioGroupItem id="r2" value="comfortable" disabled>
              <RadioGroupIndicator />
            </RadioGroupItem>

            <label htmlFor="r2">Comfortable</label>

            <RadioGroupItem id="r3" value="compact">
              <RadioGroupIndicator />
            </RadioGroupItem>

            <label htmlFor="r3">Compact</label>
          </RadioGroupRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('radio', { name: 'Default' }))
        await userEvent.keyboard('{ArrowDown}')
        await userEvent.keyboard('{ArrowUp}')

        // ASSERT
        await expect.element(page.getByRole('radio', { name: 'Default' })).toBeChecked()
        await expect.element(page.getByRole('radio', { name: 'Compact' })).not.toBeChecked()
      })
    })
  })
})

describe('given disabled RadioGroup', () => {
  it('should have default selected', async () => {
    // ARRANGE
    render(
      <RadioGroupRoot disabled>
        <RadioGroupItem id="r1" value="default">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r1">Default</label>

        <RadioGroupItem id="r2" value="comfortable">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r2">Comfortable</label>

        <RadioGroupItem id="r3" value="compact">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r3">Compact</label>
      </RadioGroupRoot>,
    )

    // ASSERT
    await expect.element(page.getByRole('radio', { name: 'Default' })).toBeChecked()
  })

  it('should disable every item', async () => {
    // ARRANGE
    render(
      <RadioGroupRoot disabled>
        <RadioGroupItem id="r1" value="default">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r1">Default</label>

        <RadioGroupItem id="r2" value="comfortable">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r2">Comfortable</label>

        <RadioGroupItem id="r3" value="compact">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r3">Compact</label>
      </RadioGroupRoot>,
    )

    // ASSERT
    await expect.element(page.getByRole('radio', { name: 'Default' })).toHaveAttribute('aria-disabled', 'true')
    await expect.element(page.getByRole('radio', { name: 'Comfortable' })).toHaveAttribute('aria-disabled', 'true')
    await expect.element(page.getByRole('radio', { name: 'Compact' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('should not select any item', async () => {
    // ARRANGE
    render(
      <RadioGroupRoot disabled>
        <RadioGroupItem id="r1" value="default">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r1">Default</label>

        <RadioGroupItem id="r2" value="comfortable">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r2">Comfortable</label>

        <RadioGroupItem id="r3" value="compact">
          <RadioGroupIndicator />
        </RadioGroupItem>

        <label htmlFor="r3">Compact</label>
      </RadioGroupRoot>,
    )

    // ACT & ASSERT
    await page.getByRole('radio', { name: 'Default' }).click({ force: true })
    await expect.element(page.getByRole('radio', { name: 'Default' })).toHaveAttribute('data-state', 'checked')

    await page.getByRole('radio', { name: 'Comfortable' }).click({ force: true })
    await expect.element(page.getByRole('radio', { name: 'Comfortable' })).toHaveAttribute('data-state', 'unchecked')

    await page.getByRole('radio', { name: 'Compact' }).click({ force: true })
    await expect.element(page.getByRole('radio', { name: 'Compact' })).toHaveAttribute('data-state', 'unchecked')
  })
})

describe('given radio in a form', () => {
  it('should have a hidden input field', async () => {
    // ARRANGE
    render(
      <form>
        <RadioGroupRoot name="test">
          <RadioGroupItem id="r1" value="true">
            <RadioGroupIndicator />
          </RadioGroupItem>
        </RadioGroupRoot>
      </form>,
    )

    // ASSERT
    const hiddenInput = document.querySelector('input[type="hidden"][name="test"]')
    expect(hiddenInput).toBeTruthy()
  })

  describe('after clicking submit button', () => {
    it('should trigger submit once', async () => {
      // ARRANGE
      const formSubmitMock = vi.fn(handleSubmit)
      render(
        <form onSubmit={formSubmitMock}>
          <RadioGroupRoot name="test">
            <RadioGroupItem id="r1" value="true">
              <RadioGroupIndicator />
            </RadioGroupItem>
          </RadioGroupRoot>

          <button type="submit">Submit form</button>
        </form>,
      )

      // ACT
      await userEvent.click(page.getByRole('button'))

      // ASSERT
      expect(formSubmitMock).toHaveBeenCalledTimes(1)
      expect(formSubmitMock.mock.results[0].value).toStrictEqual({ test: 'true' })
    })
  })

  describe('after uncheck and click submit button again', () => {
    it('should trigger submit once', async () => {
      // ARRANGE
      const formSubmitMock = vi.fn(handleSubmit)
      render(
        <form onSubmit={formSubmitMock}>
          <RadioGroupRoot name="test">
            <RadioGroupItem id="r1" value="true">
              <RadioGroupIndicator />
            </RadioGroupItem>
          </RadioGroupRoot>

          <button type="submit">Submit form</button>
        </form>,
      )

      // ACT
      await userEvent.click(page.getByRole('radio'))
      await userEvent.click(page.getByRole('button'))

      await userEvent.click(page.getByRole('radio'))
      await userEvent.click(page.getByRole('button'))

      // ASSERT
      expect(formSubmitMock).toHaveBeenCalledTimes(2)
      expect(formSubmitMock.mock.results[1].value).toStrictEqual({ test: 'true' })
    })
  })
})
