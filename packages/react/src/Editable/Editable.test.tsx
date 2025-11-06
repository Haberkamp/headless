import { useState } from 'react'
import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import {
  EditableArea,
  EditableCancelTrigger,
  EditableEditTrigger,
  EditableInput,
  EditablePreview,
  EditableRoot,
  EditableSubmitTrigger,
} from './index'

it('respects a default value if provided', () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" defaultValue="Default Value">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>

      <EditableEditTrigger data-testid="edit" />
      <EditableSubmitTrigger data-testid="submit" />
      <EditableCancelTrigger data-testid="cancel" />
    </EditableRoot>,
  )

  // ACT & ASSERT
  expect(page.getByTestId('preview')).toHaveTextContent('Default Value')
})

it('respects a default value if provided - `value`', () => {
  render(
    <EditableRoot data-testid="root" value="Default Value">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
    </EditableRoot>,
  )

  // ACT & ASSERT
  expect(page.getByTestId('preview')).toHaveTextContent('Default Value')
})

it('sets the placeholder value if any value isn\'t set', () => {
  render(
    <EditableRoot data-testid="root" placeholder="Enter text...">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
    </EditableRoot>,
  )

  // ACT & ASSERT
  expect(page.getByTestId('preview')).toHaveTextContent('Enter text...')
})

it('changes to editable mode when clicking on the preview', async () => {
  render(
    <EditableRoot data-testid="root">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>

      <EditableEditTrigger data-testid="edit" />
    </EditableRoot>,
  )

  // ACT
  await userEvent.click(page.getByTestId('preview'))

  // ASSERT
  expect(page.getByTestId('edit')).toBeVisible()
})

it('changes to editable mode when clicking on the edit button', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
      <EditableEditTrigger data-testid="edit" />
    </EditableRoot>,
  )

  // ACT
  await userEvent.click(page.getByTestId('edit'))

  // ASSERT
  await expect.element(page.getByTestId('input')).toBeVisible()
})

it('changes to editable mode when double clicking on the preview', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" activationMode="dblclick">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
    </EditableRoot>,
  )

  // ACT
  await userEvent.dblClick(page.getByTestId('preview'))

  // ASSERT
  await expect.element(page.getByTestId('input')).toBeVisible()
})

it('selects the input value when entering edit mode and selectOnFocus is true', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" defaultValue="Default Value" selectOnFocus>
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
    </EditableRoot>,
  )

  // ACT
  await userEvent.click(page.getByTestId('preview'))

  // ASSERT
  await expect.element(page.getByTestId('input')).toHaveFocus()
  await expect.element(page.getByTestId('input')).toHaveValue('Default Value')
  await expect.element(page.getByTestId('input')).toHaveSelection('Default Value')
})

it('starts in edit mode if the property is set', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" startWithEditMode>
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
    </EditableRoot>,
  )

  // ACT & ASSERT
  await expect.element(page.getByTestId('input')).toBeVisible()
})

it('submits the value when pressing enter', async () => {
  // ARRANGE
  function Wrapper() {
    const [value, setValue] = useState('')

    return (
      <EditableRoot data-testid="root" submitMode="enter" value={value} onValueChange={setValue}>
        <EditableArea data-testid="area">
          <EditablePreview data-testid="preview" />
          <EditableInput data-testid="input" />
        </EditableArea>
      </EditableRoot>
    )
  }

  render(<Wrapper />)

  // ACT
  await userEvent.click(page.getByTestId('preview'))

  await userEvent.type(page.getByTestId('input'), 'New Value')
  await userEvent.type(page.getByTestId('input'), '{Enter}')

  // ASSERT
  await expect.element(page.getByTestId('preview')).toBeVisible()
  await expect.element(page.getByTestId('preview')).toHaveTextContent('New Value')
})

it('submits the value on blur', async () => {
  // ARRANGE
  function Wrapper() {
    const [value, setValue] = useState('')

    return (
      <EditableRoot data-testid="root" submitMode="blur" value={value} onValueChange={setValue}>
        <EditableArea data-testid="area">
          <EditablePreview data-testid="preview" />
          <EditableInput data-testid="input" />
        </EditableArea>
      </EditableRoot>
    )
  }

  render(<Wrapper />)

  // ACT
  await userEvent.dblClick(page.getByTestId('preview'))
  await userEvent.type(page.getByTestId('input'), 'New Value')
  await userEvent.click(document.body)

  // ASSERT
  await expect.element(page.getByTestId('preview')).toBeVisible()
  await expect.element(page.getByTestId('preview')).toHaveTextContent('New Value')
})

it('submits the value when pressing enter if submitMode is both', async () => {
  // ARRANGE
  function Wrapper() {
    const [value, setValue] = useState('')

    return (
      <EditableRoot data-testid="root" submitMode="both" value={value} onValueChange={setValue}>
        <EditableArea data-testid="area">
          <EditablePreview data-testid="preview" />
          <EditableInput data-testid="input" />
        </EditableArea>
      </EditableRoot>
    )
  }

  render(<Wrapper />)

  // ACT
  await userEvent.click(page.getByTestId('preview'))

  await userEvent.type(page.getByTestId('input'), 'New Value')
  await userEvent.type(page.getByTestId('input'), '{Enter}')

  // ASSERT
  expect(page.getByTestId('preview')).toBeVisible()
  expect(page.getByTestId('preview')).toHaveTextContent('New Value')
})

it('submits the value on blur if submitMode is both', async () => {
  // ARRANGE
  function Wrapper() {
    const [value, setValue] = useState('')

    return (
      <EditableRoot data-testid="root" submitMode="both" value={value} onValueChange={setValue}>
        <EditableArea data-testid="area">
          <EditablePreview data-testid="preview" />
          <EditableInput data-testid="input" />
        </EditableArea>
      </EditableRoot>
    )
  }

  render(<Wrapper />)

  // ACT
  await userEvent.dblClick(page.getByTestId('preview'))
  await userEvent.type(page.getByTestId('input'), 'New Value')
  await userEvent.click(document.children[0])

  // ASSERT
  expect(page.getByTestId('preview')).toBeVisible()
  expect(page.getByTestId('preview')).toHaveTextContent('New Value')
})

it('prevents entering edit mode when disabled', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" disabled>
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
    </EditableRoot>,
  )

  // ACT
  await userEvent.click(page.getByTestId('preview'))

  // ASSERT
  await expect.element(page.getByTestId('edit')).not.toBeInTheDocument()
})

it('prevents editing the input value when readonly', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" readonly defaultValue="Default Value">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>

      <EditableEditTrigger data-testid="edit" />
    </EditableRoot>,
  )

  await userEvent.click(page.getByTestId('edit'))
  await expect.element(page.getByTestId('input')).toBeVisible()

  // ACT
  await userEvent.type(page.getByTestId('input'), 'New Value')

  // ASSERT
  await expect.element(page.getByTestId('input')).toHaveValue('Default Value')
})

it('uses the proper styles when autoResize is true', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" autoResize defaultValue="Default Value">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
      <EditableEditTrigger data-testid="edit" />
    </EditableRoot>,
  )

  await expect.element(page.getByTestId('input')).toHaveStyle({ visibility: 'hidden' })

  // ACT
  await userEvent.click(page.getByTestId('edit'))

  // ASSERT
  await expect.element(page.getByTestId('preview')).toHaveStyle({ visibility: 'hidden' })
})

it('should prevent user input text more than given `maxLength`', async () => {
  // ARRANGE
  render(
    <EditableRoot data-testid="root" maxLength={10} defaultValue="Default Value">
      <EditableArea data-testid="area">
        <EditablePreview data-testid="preview" />
        <EditableInput data-testid="input" />
      </EditableArea>
      <EditableEditTrigger data-testid="edit" />
    </EditableRoot>,
  )

  // ACT
  await userEvent.click(page.getByTestId('edit'))
  await userEvent.type(page.getByTestId('input'), 'lorem ipsum dolor sit amet')

  // ASSERT
  await expect.element(page.getByTestId('input')).toHaveValue('Default Value')
})

it('skips to the input when pressing shift+tab and the editable is closed', async () => {
  // ARRANGE
  render(
    <>
      <EditableRoot data-testid="root">
        <EditableArea data-testid="area">
          <EditablePreview data-testid="preview" />
          <EditableInput data-testid="input" />
        </EditableArea>

        <EditableEditTrigger data-testid="edit" />
        <EditableSubmitTrigger data-testid="submit" />
        <EditableCancelTrigger data-testid="cancel" />
      </EditableRoot>

      <div data-testid="skip-target" tabIndex={0}>
        Skip target
      </div>
    </>,
  )

  await userEvent.click(page.getByTestId('skip-target'))

  // ACT
  await userEvent.tab({
    shift: true,
  })

  // ASSERT
  await expect.element(page.getByTestId('input')).toBeVisible()
  await expect.element(page.getByTestId('input')).toHaveFocus()
})
