import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from './index'

describe('given a single Accordion', () => {
  describe('when navigating by keyboard', () => {
    describe('on `ArrowDown`', () => {
      it('should move focus to the next trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.keyboard('{ArrowDown}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 2' }),
        ).toHaveFocus()
      })

      it('should move focus to the first item if at the end', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ACT
        await userEvent.keyboard('{ArrowDown}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 1' }),
        ).toHaveFocus()
      })
    })

    describe('on `ArrowUp`', () => {
      it('should move focus to the previous trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ACT
        await userEvent.keyboard('{ArrowUp}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 1' }),
        ).toHaveFocus()
      })

      it('should move focus to the last item if at the beginning', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.keyboard('{ArrowUp}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 2' }),
        ).toHaveFocus()
      })
    })

    describe('on `Home`', () => {
      it('should move focus to the first trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ACT
        await userEvent.keyboard('{Home}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 1' }),
        ).toHaveFocus()
      })
    })

    describe('on `End`', () => {
      it('should move focus to the last trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.keyboard('{End}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 2' }),
        ).toHaveFocus()
      })
    })
  })

  describe('when clicking a trigger', () => {
    it('should show the content', async () => {
      // ARRANGE
      render(
        <AccordionRoot>
          <AccordionItem value="item-1">
            <AccordionHeader>
              <AccordionTrigger>
                Accordion 1
              </AccordionTrigger>
            </AccordionHeader>

            <AccordionContent>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

      // ASSERT
      await expect.element(page.getByText('Content 1')).toBeVisible()
    })

    it('should call onModelValueChange', async () => {
      // ARRANGE
      const onModelValueChange = vi.fn()
      render(
        <AccordionRoot onModelValueChange={onModelValueChange}>
          <AccordionItem value="item-1">
            <AccordionHeader>
              <AccordionTrigger>
                Accordion 1
              </AccordionTrigger>
            </AccordionHeader>

            <AccordionContent>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

      // ASSERT
      expect(onModelValueChange).toHaveBeenCalledWith('item-1')
    })

    describe('then clicking the trigger again', () => {
      it('should not close the content', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        await expect.element(page.getByText('Content 1')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ASSERT
        await expect.element(page.getByText('Content 1')).toBeVisible()
      })

      it('should not call onModelValueChange', async () => {
        // ARRANGE
        const onModelValueChange = vi.fn()
        render(
          <AccordionRoot onModelValueChange={onModelValueChange}>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        expect(onModelValueChange).toHaveBeenCalledTimes(1)

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ASSERT
        expect(onModelValueChange).toHaveBeenCalledTimes(1)
      })
    })

    describe('then clicking another trigger', () => {
      it('should show the new content', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        await expect.element(page.getByText('Content 1')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ASSERT
        await expect.element(page.getByText('Content 2')).toBeVisible()
      })

      it('should call onModelValueChange', async () => {
        // ARRANGE
        const onModelValueChange = vi.fn()
        render(
          <AccordionRoot onModelValueChange={onModelValueChange}>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ASSERT
        expect(onModelValueChange).toHaveBeenCalledTimes(2)
        expect(onModelValueChange).toHaveBeenNthCalledWith(2, 'item-2')
      })

      it('should hide the previous content', async () => {
        // ARRANGE
        render(
          <AccordionRoot>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        await expect.element(page.getByText('Content 1')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ASSERT
        await expect.element(page.getByText('Content 1')).not.toBeInTheDocument()
      })
    })
  })
})

describe('given a multiple Accordion', () => {
  describe('when navigating by keyboard', () => {
    describe('on `ArrowDown`', () => {
      it('should move focus to the next trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot type="multiple">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.keyboard('{ArrowDown}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 2' }),
        ).toHaveFocus()
      })
    })

    describe('on `ArrowUp`', () => {
      it('should move focus to the previous trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot type="multiple">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.keyboard('{ArrowUp}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 2' }),
        ).toHaveFocus()
      })
    })

    describe('on `Home`', () => {
      it('should move focus to the first trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot type="multiple">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ACT
        await userEvent.keyboard('{Home}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 1' }),
        ).toHaveFocus()
      })
    })

    describe('on `End`', () => {
      it('should move focus to the last trigger', async () => {
        // ARRANGE
        render(
          <AccordionRoot type="multiple">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.keyboard('{End}')

        // ASSERT
        await expect.element(
          page.getByRole('button', { name: 'Accordion 2' }),
        ).toHaveFocus()
      })
    })
  })

  describe('when clicking a trigger', () => {
    it('should show the content', async () => {
      // ARRANGE
      render(
        <AccordionRoot type="multiple">
          <AccordionItem value="item-1">
            <AccordionHeader>
              <AccordionTrigger>
                Accordion 1
              </AccordionTrigger>
            </AccordionHeader>

            <AccordionContent>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

      // ASSERT
      await expect.element(page.getByText('Content 1')).toBeVisible()
    })

    it('should call onModelValueChange', async () => {
      // ARRANGE
      const onModelValueChange = vi.fn()
      render(
        <AccordionRoot type="multiple" onModelValueChange={onModelValueChange}>
          <AccordionItem value="item-1">
            <AccordionHeader>
              <AccordionTrigger>
                Accordion 1
              </AccordionTrigger>
            </AccordionHeader>

            <AccordionContent>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

      // ASSERT
      expect(onModelValueChange).toHaveBeenCalledWith(['item-1'])
    })

    describe('then clicking the trigger again', () => {
      it('should hide the content', async () => {
        // ARRANGE
        render(
          <AccordionRoot type="multiple">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        await expect.element(page.getByText('Content 1')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ASSERT
        await expect.element(page.getByText('Content 1')).not.toBeInTheDocument()
      })

      it('should call onModelValueChange', async () => {
        // ARRANGE
        const onModelValueChange = vi.fn()
        render(
          <AccordionRoot type="multiple" onModelValueChange={onModelValueChange}>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        expect(onModelValueChange).toHaveBeenCalledTimes(1)

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ASSERT
        expect(onModelValueChange).toHaveBeenCalledTimes(2)
        expect(onModelValueChange).toHaveBeenNthCalledWith(2, [])
      })
    })

    describe('then clicking another trigger', () => {
      it('should show the new content', async () => {
        // ARRANGE
        render(
          <AccordionRoot type="multiple">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        await expect.element(page.getByText('Content 1')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ASSERT
        await expect.element(page.getByText('Content 2')).toBeVisible()
      })

      it('should call onModelValueChange', async () => {
        // ARRANGE
        const onModelValueChange = vi.fn()
        render(
          <AccordionRoot type="multiple" onModelValueChange={onModelValueChange}>
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ASSERT
        expect(onModelValueChange).toHaveBeenCalledTimes(2)
        expect(onModelValueChange).toHaveBeenNthCalledWith(2, ['item-1', 'item-2'])
      })

      it('should not hide the previous content', async () => {
        // ARRANGE
        render(
          <AccordionRoot type="multiple">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 1
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 1
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger>
                  Accordion 2
                </AccordionTrigger>
              </AccordionHeader>

              <AccordionContent>
                Content 2
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 1' }))
        await expect.element(page.getByText('Content 1')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Accordion 2' }))

        // ASSERT
        await expect.element(page.getByText('Content 1')).toBeVisible()
      })
    })
  })
})
