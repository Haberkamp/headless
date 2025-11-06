import { expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Foo from './Foo.tsx'

it('renders name', async () => {
  const { getByText } = await render(<Foo />)

  await expect.element(getByText('Foo')).toBeInTheDocument()
})
