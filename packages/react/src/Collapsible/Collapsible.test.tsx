import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from './index'

const CONTENT_TEXT = 'Content'

describe('given a default Collapsible', () => {
  it('should have hidden content', async () => {
    // ARRANGE
    render(
      <CollapsibleRoot>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
      </CollapsibleRoot>,
    )

    // ASSERT
    await expect.element(page.getByText(CONTENT_TEXT)).not.toBeInTheDocument()
  })

  describe('when clicking the trigger', () => {
    it('should open the content', async () => {
      // ARRANGE
      render(
        <CollapsibleRoot>
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
        </CollapsibleRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Trigger' }))

      // ASSERT
      await expect.element(page.getByText(CONTENT_TEXT)).toBeVisible()
    })

    describe('and clicking the trigger again', () => {
      it('should close the content', async () => {
        // ARRANGE
        render(
          <CollapsibleRoot>
            <CollapsibleTrigger>Trigger</CollapsibleTrigger>
            <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
          </CollapsibleRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Trigger' }))
        await expect.element(page.getByText(CONTENT_TEXT)).toBeVisible()

        await userEvent.click(page.getByRole('button', { name: 'Trigger' }))

        // ASSERT
        await expect.element(page.getByText(CONTENT_TEXT)).not.toBeInTheDocument()
      })
    })
  })
})

describe('given a Collapsible with `unmountOnHide:false`', () => {
  it('should have hidden attribute', async () => {
    // ARRANGE
    render(
      <CollapsibleRoot unmountOnHide={false}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
      </CollapsibleRoot>,
    )

    const content = page.getByText(CONTENT_TEXT)

    // ASSERT
    expect(content).toHaveAttribute('hidden', 'until-found')
  })

  describe('when clicking the trigger', () => {
    it('should open the content', async () => {
      // ARRANGE
      render(
        <CollapsibleRoot unmountOnHide={false}>
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
        </CollapsibleRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Trigger' }))

      // ASSERT
      await expect.element(page.getByText(CONTENT_TEXT)).toBeVisible()
    })

    describe('and clicking the trigger again', () => {
      it('should close the content', async () => {
        // ARRANGE
        render(
          <CollapsibleRoot unmountOnHide={false}>
            <CollapsibleTrigger>Trigger</CollapsibleTrigger>
            <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
          </CollapsibleRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('button', { name: 'Trigger' }))
        await expect.element(page.getByText(CONTENT_TEXT)).toBeVisible()

        await userEvent.click(page.getByRole('button', { name: 'Trigger' }))

        // ASSERT
        const content = page.getByText(CONTENT_TEXT)
        expect(content).toHaveAttribute('data-state', 'closed')
        expect(content).toHaveAttribute('hidden', 'until-found')
        expect(content).toBeInTheDocument()
      })
    })
  })
})

describe('given an open uncontrolled Collapsible', () => {
  describe('when clicking the trigger', () => {
    it('should open the content by default', async () => {
      // ARRANGE
      render(
        <CollapsibleRoot defaultOpen>
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
        </CollapsibleRoot>,
      )

      // ASSERT
      await expect.element(page.getByText(CONTENT_TEXT)).toBeVisible()
    })

    it('should close the content', async () => {
      // ARRANGE
      render(
        <CollapsibleRoot defaultOpen>
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
        </CollapsibleRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Trigger' }))

      // ASSERT
      await expect.element(page.getByText(CONTENT_TEXT)).not.toBeInTheDocument()
    })

    it('should call `onOpenChange` prop with `false` value', async () => {
      // ARRANGE
      const onOpenChange = vi.fn()
      render(
        <CollapsibleRoot defaultOpen onOpenChange={onOpenChange}>
          <CollapsibleTrigger>Trigger</CollapsibleTrigger>
          <CollapsibleContent>{CONTENT_TEXT}</CollapsibleContent>
        </CollapsibleRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('button', { name: 'Trigger' }))

      // ASSERT
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
