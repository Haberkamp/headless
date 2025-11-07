import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from './index'

describe('given default Tabs', () => {
  describe('when navigating by keyboard', () => {
    describe('on `ArrowRight`', () => {
      it('should move focus to the next trigger', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue={1}>
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await userEvent.click(page.getByRole('tab', { name: 'Account' }))

        // ACT
        await userEvent.keyboard('{ArrowRight}')

        // ASSERT
        await expect.element(page.getByRole('tab', { name: 'Password' })).toHaveFocus()
      })

      it('should move focus to the first item if at the end', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue="tab2">
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await userEvent.click(page.getByRole('tab', { name: 'Password' }))

        // ACT
        await userEvent.keyboard('{ArrowRight}')

        // ASSERT
        await expect.element(page.getByRole('tab', { name: 'Account' })).toHaveFocus()
      })
    })

    describe('on `ArrowLeft`', () => {
      it('should move focus to the previous trigger', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue="tab2">
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await userEvent.click(page.getByRole('tab', { name: 'Password' }))

        // ACT
        await userEvent.keyboard('{ArrowLeft}')

        // ASSERT
        await expect.element(page.getByRole('tab', { name: 'Account' })).toHaveFocus()
      })

      it('should move focus to the last item if at the beginning', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue={1}>
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await userEvent.click(page.getByRole('tab', { name: 'Account' }))

        // ACT
        await userEvent.keyboard('{ArrowLeft}')

        // ASSERT
        await expect.element(page.getByRole('tab', { name: 'Password' })).toHaveFocus()
      })
    })

    describe('on `Home`', () => {
      it('should move focus to the first trigger', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue="tab2">
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await userEvent.click(page.getByRole('tab', { name: 'Password' }))

        // ACT
        await userEvent.keyboard('{Home}')

        // ASSERT
        await expect.element(page.getByRole('tab', { name: 'Account' })).toHaveFocus()
      })
    })

    describe('on `End`', () => {
      it('should move focus to the last trigger', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue={1}>
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await userEvent.click(page.getByRole('tab', { name: 'Account' }))

        // ACT
        await userEvent.keyboard('{End}')

        // ASSERT
        await expect.element(page.getByRole('tab', { name: 'Password' })).toHaveFocus()
      })
    })
  })

  describe('when clicking a trigger', () => {
    it('should show the content', async () => {
      // ARRANGE
      render(
        <TabsRoot>
          <TabsList>
            <TabsTrigger value={1}>Account</TabsTrigger>
          </TabsList>
          <TabsContent value={1}>Make changes</TabsContent>
        </TabsRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('tab', { name: 'Account' }))

      // ASSERT
      await expect.element(page.getByText('Make changes')).toBeVisible()
    })

    it('should call onModelValueChange', async () => {
      // ARRANGE
      const onModelValueChange = vi.fn()
      render(
        <TabsRoot onModelValueChange={onModelValueChange}>
          <TabsList>
            <TabsTrigger value={1}>Account</TabsTrigger>
          </TabsList>
          <TabsContent value={1}>Make changes</TabsContent>
        </TabsRoot>,
      )

      // ACT
      await userEvent.click(page.getByRole('tab', { name: 'Account' }))

      // ASSERT
      expect(onModelValueChange).toHaveBeenCalledWith(1)
    })

    describe('then clicking another trigger', () => {
      it('should show the new content', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue={1}>
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await expect.element(page.getByText('Make changes')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('tab', { name: 'Password' }))

        // ASSERT
        await expect.element(page.getByText('Change your password')).toBeVisible()
      })

      it('should call onModelValueChange', async () => {
        // ARRANGE
        const onModelValueChange = vi.fn()
        render(
          <TabsRoot defaultValue={1} onModelValueChange={onModelValueChange}>
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        // ACT
        await userEvent.click(page.getByRole('tab', { name: 'Password' }))

        // ASSERT
        expect(onModelValueChange).toHaveBeenCalledWith('tab2')
      })

      it('should hide the previous content', async () => {
        // ARRANGE
        render(
          <TabsRoot defaultValue={1}>
            <TabsList>
              <TabsTrigger value={1}>Account</TabsTrigger>
              <TabsTrigger value="tab2">Password</TabsTrigger>
            </TabsList>
            <TabsContent value={1}>Make changes</TabsContent>
            <TabsContent value="tab2">Change your password</TabsContent>
          </TabsRoot>,
        )

        await expect.element(page.getByText('Make changes')).toBeVisible()

        // ACT
        await userEvent.click(page.getByRole('tab', { name: 'Password' }))

        // ASSERT
        await expect.element(page.getByText('Make changes')).not.toBeInTheDocument()
      })
    })
  })
})
