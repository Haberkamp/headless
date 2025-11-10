import type { ReactNode } from 'react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from './index'

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  return Object.fromEntries(formData)
}

function ControlledSlider({
  defaultValue = [50],
  children,
  ...props
}: {
  defaultValue?: number[]
  children: ReactNode
  [key: string]: any
}) {
  const [value, setValue] = useState(defaultValue)
  return (
    <SliderRoot value={value} onChange={v => v && setValue(v)} {...props}>
      {children}
    </SliderRoot>
  )
}

describe('given default Slider', () => {
  it('should have a default value', async () => {
    // ARRANGE
    render(
      <SliderRoot value={[50]}>
        <SliderTrack>
          <SliderRange />
        </SliderTrack>

        <SliderThumb />
      </SliderRoot>,
    )

    // ASSERT
    await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '50')
  })

  describe('when disabled', () => {
    it('should disable the thumb', async () => {
      // ARRANGE
      render(
        <SliderRoot value={[50]} disabled>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </SliderRoot>,
      )

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-disabled', 'true')
      await expect.element(page.getByRole('slider')).toHaveAttribute('data-disabled', '')
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuemin', '0')
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuemax', '100')
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '50')
    })
  })

  describe('when inverted', () => {
    describe('when pressing navigation key', () => {
      it('arrowRight should decrease by 1', async () => {
        // ARRANGE
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowRight}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
      })

      it('arrowLeft should increase by 1', async () => {
        // ARRANGE
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowLeft}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
      })

      it('arrowUp should increase by 1', async () => {
        // ARRANGE
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowUp}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
      })

      it('arrowDown should decrease by 1', async () => {
        // ARRANGE
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowDown}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
      })

      it('pageUp should increase by 10', async () => {
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{PageUp}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '60')
      })

      it('pageDown should decrease by 10', async () => {
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{PageDown}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '40')
      })

      it('home should set value to 0', async () => {
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{Home}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
      })

      it('home should set value to max', async () => {
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <SliderRoot value={value} onChange={v => v && setValue(v)} inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{End}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '100')
      })
    })
  })

  describe('when vertical', () => {
    describe('when inverted', () => {
      describe('after pressing the navigation key', () => {
        it('arrowRight should increase by 1', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{ArrowRight}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
        })

        it('arrowLeft should decrease by 1', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{ArrowLeft}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
        })

        it('arrowUp should decrease by 1', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{ArrowUp}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
        })

        it('arrowDown should increase by 1', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{ArrowDown}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
        })

        it('pageUp should decrease by 10', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{PageUp}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '40')
        })

        it('pageDown should increase by 10', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{PageDown}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '60')
        })

        it('home should set value to 0', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{Home}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
        })

        it('end should set value to max', async () => {
          render(
            <ControlledSlider orientation="vertical" inverted>
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </ControlledSlider>,
          )

          // ACT
          await userEvent.click(page.getByRole('slider'))
          await userEvent.keyboard('{End}')

          // ASSERT
          await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '100')
        })
      })
    })

    describe('after pressing the navigation key', () => {
      it('arrowRight should increase by 1', async () => {
        // ARRANGE
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowRight}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
      })

      it('arrowLeft should decrease by 1', async () => {
        // ARRANGE
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowLeft}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
      })

      it('arrowUp should increase by 1', async () => {
        // ARRANGE
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowUp}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
      })

      it('arrowDown should decrease by 1', async () => {
        // ARRANGE
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowDown}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
      })

      it('pageUp should increase by 10', async () => {
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{PageUp}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '60')
      })

      it('pageDown should decrease by 10', async () => {
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{PageDown}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '40')
      })

      it('home should set value to 0', async () => {
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{Home}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
      })

      it('home should set value to max', async () => {
        render(
          <ControlledSlider orientation="vertical">
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </ControlledSlider>,
        )

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{End}')

        // ASSERT
        await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '100')
      })
    })
  })

  describe('after pressing the navigation key', () => {
    it('arrowRight should increase by 1', async () => {
      // ARRANGE
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{ArrowRight}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
    })

    it('arrowLeft should decrease by 1', async () => {
      // ARRANGE
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{ArrowLeft}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
    })

    it('arrowUp should increase by 1', async () => {
      // ARRANGE
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{ArrowUp}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '51')
    })

    it('arrowDown should decrease by 1', async () => {
      // ARRANGE
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{ArrowDown}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '49')
    })

    it('pageUp should increase by 10', async () => {
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{PageUp}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '60')
    })

    it('pageDown should decrease by 10', async () => {
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{PageDown}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '40')
    })

    it('home should set value to 0', async () => {
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{Home}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
    })

    it('home should set value to max', async () => {
      render(
        <ControlledSlider>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>

          <SliderThumb />
        </ControlledSlider>,
      )

      // ACT
      await userEvent.click(page.getByRole('slider'))
      await userEvent.keyboard('{End}')

      // ASSERT
      await expect.element(page.getByRole('slider')).toHaveAttribute('aria-valuenow', '100')
    })
  })

  describe('given slider in a form', () => {
    it('should have a hidden input field', async () => {
      // ARRANGE
      render(
        <form>
          <SliderRoot value={[50]}>
            <SliderTrack>
              <SliderRange />
            </SliderTrack>

            <SliderThumb />
          </SliderRoot>
        </form>,
      )

      // ASSERT
      await expect.element(page.getByRole('spinbutton')).toBeInTheDocument()
    })

    describe('after clicking the submit button', () => {
      it('should trigger submit once', async () => {
        // ARRANGE
        const formSubmitMock = vi.fn(handleSubmit)
        render(
          <form onSubmit={formSubmitMock}>
            <SliderRoot value={[50]} name="slider">
              <SliderTrack>
                <SliderRange />
              </SliderTrack>

              <SliderThumb />
            </SliderRoot>

            <button type="submit">Submit form</button>
          </form>,
        )

        // ACT
        await userEvent.click(page.getByRole('button'))

        // ASSERT
        expect(formSubmitMock).toHaveBeenCalledTimes(1)
        expect(formSubmitMock.mock.results[0].value).toStrictEqual({ slider: '50' })
      })
    })

    describe('after uncheck and click submit button again', () => {
      it('should trigger submit twice with updated value', async () => {
        // ARRANGE
        const formSubmitMock = vi.fn(handleSubmit)
        function Wrapper() {
          const [value, setValue] = useState([50])
          return (
            <form onSubmit={formSubmitMock}>
              <SliderRoot value={value} onChange={v => v && setValue(v)} name="slider">
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>

                <SliderThumb />
              </SliderRoot>

              <button type="submit">Submit form</button>
            </form>
          )
        }
        render(<Wrapper />)

        // ACT
        await userEvent.click(page.getByRole('slider'))
        await userEvent.keyboard('{ArrowRight}')

        await userEvent.click(page.getByRole('button'))

        // ASSERT
        expect(formSubmitMock).toHaveBeenCalledTimes(1)
        expect(formSubmitMock.mock.results[0].value).toStrictEqual({ slider: '51' })
      })
    })
  })
})
