import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { SwitchRoot, SwitchThumb } from './index'

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  return Object.fromEntries(formData)
}

describe('test switch functionalities', () => {
  it('thumb can render', () => {
    render(
      <SwitchRoot aria-label="Test">
        <SwitchThumb data-testid="thumb" />
      </SwitchRoot>,
    )
    expect(page.getByTestId('thumb')).toBeTruthy()
  })

  it('clicking root will toggle value', async () => {
    function Wrapper() {
      const [checked, setChecked] = useState(false)
      return (
        <>
          <p>{checked ? 'checked' : 'unchecked'}</p>
          <SwitchRoot
            aria-label="Airplane mode"
            modelValue={checked}
            onModelValueChange={setChecked}
          >
            <SwitchThumb data-testid="thumb" />
          </SwitchRoot>
        </>
      )
    }

    render(<Wrapper />)
    expect(page.getByText('unchecked')).toBeTruthy()

    await userEvent.click(page.getByRole('switch'))
    expect(page.getByText('checked')).toBeTruthy()

    await userEvent.click(page.getByRole('switch'))
    expect(page.getByText('unchecked')).toBeTruthy()
  })

  it('keydown enter root will toggle value', async () => {
    function Wrapper() {
      const [checked, setChecked] = useState(false)
      return (
        <>
          <p>{checked ? 'checked' : 'unchecked'}</p>
          <SwitchRoot
            aria-label="Airplane mode"
            modelValue={checked}
            onModelValueChange={setChecked}
          >
            <SwitchThumb data-testid="thumb" />
          </SwitchRoot>
        </>
      )
    }

    render(<Wrapper />)
    expect(page.getByText('unchecked')).toBeTruthy()

    await userEvent.keyboard('{Tab}')
    await userEvent.keyboard('{Enter}')
    expect(page.getByText('checked')).toBeTruthy()

    await userEvent.keyboard('{Enter}')
    expect(page.getByText('unchecked')).toBeTruthy()
  })
})

describe('given switch in a form', () => {
  it('should have hidden input field', () => {
    render(
      <form>
        <SwitchRoot name="test" aria-label="Test">
          <SwitchThumb />
        </SwitchRoot>
      </form>,
    )
    const hiddenInput = document.querySelector('input[type="checkbox"][name="test"]')
    expect(hiddenInput).toBeTruthy()
  })

  describe('after clicking submit button', () => {
    it('should trigger submit once', async () => {
      const handleSubmitMock = vi.fn(handleSubmit)
      function Wrapper() {
        return (
          <form onSubmit={handleSubmitMock}>
            <SwitchRoot name="test" defaultValue aria-label="Test">
              <SwitchThumb />
            </SwitchRoot>
            <button type="submit">Submit</button>
          </form>
        )
      }

      render(<Wrapper />)
      await userEvent.click(page.getByRole('button', { name: 'Submit' }))
      expect(handleSubmitMock).toHaveBeenCalledTimes(1)
      expect(handleSubmitMock.mock.results[0].value).toStrictEqual({ test: 'on' })
    })
  })

  describe('after uncheck and click submit button again', () => {
    it('should trigger submit once', async () => {
      const handleSubmitMock = vi.fn(handleSubmit)
      function Wrapper() {
        const [checked, setChecked] = useState(true)
        return (
          <form onSubmit={handleSubmitMock}>
            <SwitchRoot name="test" modelValue={checked} onModelValueChange={setChecked} aria-label="Test">
              <SwitchThumb />
            </SwitchRoot>
            <button type="submit">Submit</button>
          </form>
        )
      }

      render(<Wrapper />)
      await userEvent.click(page.getByRole('switch'))
      await userEvent.click(page.getByRole('button', { name: 'Submit' }))
      expect(handleSubmitMock).toHaveBeenCalledTimes(1)
      expect(handleSubmitMock.mock.results[0].value).toStrictEqual({})
    })
  })
})
