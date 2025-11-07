import { useState } from 'react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { CheckboxGroupRoot, CheckboxIndicator, CheckboxRoot } from './index'

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  return Object.fromEntries(formData)
}

describe('given a default Checkbox', () => {
  it('should render checkbox', () => {
    // ARRANGE
    render(
      <CheckboxRoot aria-label="Test">
        <CheckboxIndicator data-testid="indicator" />
      </CheckboxRoot>,
    )

    // ASSERT
    expect(page.getByRole('checkbox')).toBeTruthy()
  })

  describe('when clicking the checkbox', () => {
    it('should render a visible indicator', async () => {
      // ARRANGE
      render(
        <CheckboxRoot aria-label="Test">
          <CheckboxIndicator data-testid="indicator">✓</CheckboxIndicator>
        </CheckboxRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('checkbox'))

      // ASSERT
      await expect.element(page.getByTestId('indicator')).toBeVisible()
    })

    describe('when clicking the checkbox again', () => {
      it('should remove the indicator', async () => {
        // ARRANGE
        render(
          <CheckboxRoot aria-label="Test">
            <CheckboxIndicator data-testid="indicator">✓</CheckboxIndicator>
          </CheckboxRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('checkbox'))
        await userEvent.click(page.getByRole('checkbox'))

        // ASSERT
        await expect.element(page.getByTestId('indicator')).not.toBeInTheDocument()
      })
    })
  })
})

describe('given a required Checkbox', () => {
  it('should have [aria-required] of "true"', () => {
    // ARRANGE
    render(
      <form>
        <CheckboxRoot required name="test" aria-label="Test">
          <CheckboxIndicator />
        </CheckboxRoot>
      </form>,
    )

    // ASSERT
    expect(page.getByRole('checkbox')).toHaveAttribute('aria-required', 'true')
    const hiddenInput = document.querySelector('input[type="checkbox"][name]')
    expect(hiddenInput).toBeTruthy()
  })
})

describe('given CheckboxGroup', () => {
  it('should render checkbox', () => {
    // ARRANGE
    render(
      <CheckboxGroupRoot>
        <CheckboxRoot value="jack" aria-label="jack">
          <CheckboxIndicator data-testid="indicator" />
        </CheckboxRoot>
      </CheckboxGroupRoot>,
    )

    // ASSERT
    expect(page.getByRole('checkbox')).toBeTruthy()
  })

  describe('when clicking the checkbox', () => {
    it('should render a visible indicator', async () => {
      // ARRANGE
      render(
        <CheckboxGroupRoot>
          <CheckboxRoot value="jack" aria-label="jack">
            <CheckboxIndicator data-testid="indicator">✓</CheckboxIndicator>
          </CheckboxRoot>
          <CheckboxRoot value="john" aria-label="john">
            <CheckboxIndicator>✓</CheckboxIndicator>
          </CheckboxRoot>
          <CheckboxRoot value="mike" aria-label="mike">
            <CheckboxIndicator>✓</CheckboxIndicator>
          </CheckboxRoot>
        </CheckboxGroupRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('checkbox', { name: 'jack' }))

      // ASSERT
      await expect.element(page.getByTestId('indicator')).toBeVisible()
    })

    describe('when clicking the checkbox again', () => {
      it('should remove the indicator', async () => {
        // ARRANGE
        render(
          <CheckboxGroupRoot>
            <CheckboxRoot value="jack" aria-label="jack">
              <CheckboxIndicator data-testid="indicator">✓</CheckboxIndicator>
            </CheckboxRoot>
            <CheckboxRoot value="john" aria-label="john">
              <CheckboxIndicator>✓</CheckboxIndicator>
            </CheckboxRoot>
            <CheckboxRoot value="mike" aria-label="mike">
              <CheckboxIndicator>✓</CheckboxIndicator>
            </CheckboxRoot>
          </CheckboxGroupRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('checkbox', { name: 'jack' }))
        await userEvent.click(page.getByRole('checkbox', { name: 'jack' }))

        // ASSERT
        await expect.element(page.getByTestId('indicator')).not.toBeInTheDocument()
      })
    })

    describe('when clicking another checkbox', () => {
      it('should render 2 checkboxes', async () => {
        // ARRANGE
        render(
          <CheckboxGroupRoot>
            <CheckboxRoot value="jack" aria-label="jack">
              <CheckboxIndicator>✓</CheckboxIndicator>
            </CheckboxRoot>
            <CheckboxRoot value="john" aria-label="john">
              <CheckboxIndicator>✓</CheckboxIndicator>
            </CheckboxRoot>
            <CheckboxRoot value="mike" aria-label="mike">
              <CheckboxIndicator>✓</CheckboxIndicator>
            </CheckboxRoot>
          </CheckboxGroupRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('checkbox', { name: 'jack' }))
        await userEvent.click(page.getByRole('checkbox', { name: 'john' }))

        // ASSERT
        expect(page.getByRole('checkbox', { name: 'jack' })).toHaveAttribute('data-state', 'checked')
        expect(page.getByRole('checkbox', { name: 'john' })).toHaveAttribute('data-state', 'checked')
        expect(page.getByRole('checkbox', { name: 'mike' })).toHaveAttribute('data-state', 'unchecked')
      })
    })
  })
})

describe('given a disabled Checkbox', () => {
  it('should not render a indicator when disabled', async () => {
    // ARRANGE
    render(
      <CheckboxRoot disabled aria-label="Test">
        <CheckboxIndicator data-testid="indicator">✓</CheckboxIndicator>
      </CheckboxRoot>,
    )

    // ASSERT
    await expect.element(page.getByTestId('indicator')).not.toBeInTheDocument()
  })
})

describe('given a disabled CheckboxGroup', () => {
  it('should not render a indicator when disabled', async () => {
    // ARRANGE
    render(
      <CheckboxGroupRoot disabled>
        <CheckboxRoot value="jack" aria-label="jack">
          <CheckboxIndicator data-testid="indicator">✓</CheckboxIndicator>
        </CheckboxRoot>
      </CheckboxGroupRoot>,
    )

    // ASSERT
    await expect.element(page.getByTestId('indicator')).not.toBeInTheDocument()
  })
})

describe('given value as "indeterminate"', () => {
  it('should have [data-state] of "indeterminate"', () => {
    // ARRANGE
    render(
      <CheckboxRoot modelValue="indeterminate" aria-label="Test">
        <CheckboxIndicator data-testid="indicator">✓</CheckboxIndicator>
      </CheckboxRoot>,
    )

    // ASSERT
    expect(page.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate')
    expect(page.getByTestId('indicator')).toHaveAttribute('data-state', 'indeterminate')
  })

  it('should still be clickable', async () => {
    // ARRANGE
    function Wrapper() {
      const [value, setValue] = useState<boolean | 'indeterminate'>('indeterminate')
      return (
        <CheckboxRoot modelValue={value} onModelValueChange={setValue} aria-label="Test">
          <CheckboxIndicator>✓</CheckboxIndicator>
        </CheckboxRoot>
      )
    }
    render(<Wrapper />)

    // ACT
    await userEvent.click(page.getByRole('checkbox'))

    // ASSERT
    expect(page.getByRole('checkbox')).toHaveAttribute('data-state', 'checked')
  })
})

describe('given checkbox in a form', () => {
  const handleSubmitMock = vi.fn(handleSubmit)

  afterAll(() => {
    handleSubmitMock.mockReset()
  })

  it('should have hidden input field', () => {
    // ARRANGE
    render(
      <form onSubmit={handleSubmitMock}>
        <CheckboxRoot value="true" name="test" aria-label="Test">
          <CheckboxIndicator>✓</CheckboxIndicator>
        </CheckboxRoot>
      </form>,
    )

    // ASSERT
    const hiddenInput = document.querySelector('input[type="checkbox"][name]')
    expect(hiddenInput).toBeTruthy()
  })

  describe('after clicking submit button', () => {
    beforeEach(async () => {
      handleSubmitMock.mockClear()
      // ARRANGE
      render(
        <form onSubmit={handleSubmitMock}>
          <CheckboxRoot value="true" name="test" aria-label="Test">
            <CheckboxIndicator>✓</CheckboxIndicator>
          </CheckboxRoot>
          <button type="submit">Submit</button>
        </form>,
      )

      // ACT
      await userEvent.click(page.getByRole('checkbox'))
      await userEvent.click(page.getByRole('button', { name: 'Submit' }))
    })

    it('should trigger submit once', () => {
      // ASSERT
      expect(handleSubmitMock).toHaveBeenCalledTimes(1)
      const event = handleSubmitMock.mock.calls[0][0] as React.FormEvent<HTMLFormElement>
      const formData = new FormData(event.target as HTMLFormElement)
      const submittedData = Object.fromEntries(formData)
      expect(submittedData).toStrictEqual({ test: 'true' })
    })
  })

  describe('after uncheck and click submit button again', () => {
    beforeEach(async () => {
      handleSubmitMock.mockClear()
      // ARRANGE
      render(
        <form onSubmit={handleSubmitMock}>
          <CheckboxRoot value="true" name="test" aria-label="Test">
            <CheckboxIndicator>✓</CheckboxIndicator>
          </CheckboxRoot>
          <button type="submit">Submit</button>
        </form>,
      )

      // ACT
      await userEvent.click(page.getByRole('checkbox'))
      await userEvent.click(page.getByRole('checkbox'))
      await userEvent.click(page.getByRole('button', { name: 'Submit' }))
    })

    it('should trigger submit once', () => {
      // ASSERT
      expect(handleSubmitMock).toHaveBeenCalledTimes(1)
      const event = handleSubmitMock.mock.calls[0][0] as React.FormEvent<HTMLFormElement>
      const formData = new FormData(event.target as HTMLFormElement)
      const submittedData = Object.fromEntries(formData)
      expect(submittedData).toStrictEqual({})
    })
  })
})

describe('given checkboxGroup in a form', () => {
  const handleSubmitMock = vi.fn(handleSubmit)

  afterAll(() => {
    handleSubmitMock.mockReset()
  })

  it('should have hidden input field', () => {
    // ARRANGE
    render(
      <form onSubmit={handleSubmitMock}>
        <CheckboxGroupRoot name="test">
          <CheckboxRoot value={{ name: 'jack' }} id="jack" aria-label="jack">
            <CheckboxIndicator>✓</CheckboxIndicator>
          </CheckboxRoot>
        </CheckboxGroupRoot>
      </form>,
    )

    // ASSERT
    const input = document.querySelector('input[data-hidden]')
    expect(input).toBeTruthy()
  })

  describe('after clicking submit button', () => {
    beforeEach(async () => {
      handleSubmitMock.mockClear()
      // ARRANGE
      render(
        <form onSubmit={handleSubmitMock}>
          <CheckboxGroupRoot name="test">
            <CheckboxRoot value={{ name: 'jack' }} id="jack" aria-label="jack">
              <CheckboxIndicator>✓</CheckboxIndicator>
            </CheckboxRoot>
          </CheckboxGroupRoot>
          <button type="submit">Submit</button>
        </form>,
      )

      // ACT
      const checkbox = page.getByRole('checkbox', { name: 'jack' })
      const checkboxElement = await checkbox.element()
      const state = checkboxElement?.getAttribute('data-state')
      if (state === 'unchecked') {
        await userEvent.click(checkbox)
      }
      await userEvent.click(page.getByRole('button', { name: 'Submit' }))
    })

    it('should trigger submit once', () => {
      // ASSERT
      expect(handleSubmitMock).toHaveBeenCalledTimes(1)
      const event = handleSubmitMock.mock.calls[0][0] as React.FormEvent<HTMLFormElement>
      const formData = new FormData(event.target as HTMLFormElement)
      const submittedData = Object.fromEntries(formData)
      expect(submittedData).toHaveProperty('test')
    })
  })

  describe('after uncheck and click submit button again', () => {
    beforeEach(async () => {
      handleSubmitMock.mockClear()
      // ARRANGE
      render(
        <form onSubmit={handleSubmitMock}>
          <CheckboxGroupRoot name="test">
            <CheckboxRoot value={{ name: 'jack' }} id="jack" aria-label="jack">
              <CheckboxIndicator>✓</CheckboxIndicator>
            </CheckboxRoot>
          </CheckboxGroupRoot>
          <button type="submit">Submit</button>
        </form>,
      )

      // ACT
      const checkbox = page.getByRole('checkbox', { name: 'jack' })
      await userEvent.click(checkbox)
      await userEvent.click(checkbox)
      await userEvent.click(page.getByRole('button', { name: 'Submit' }))
    })

    it('should trigger submit once', () => {
      // ASSERT
      expect(handleSubmitMock).toHaveBeenCalledTimes(1)
      const event = handleSubmitMock.mock.calls[0][0] as React.FormEvent<HTMLFormElement>
      const formData = new FormData(event.target as HTMLFormElement)
      const submittedData = Object.fromEntries(formData)
      expect(submittedData).toHaveProperty('test')
    })
  })
})
