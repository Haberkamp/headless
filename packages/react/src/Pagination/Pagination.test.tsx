import React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from './index'

function DefaultPagination(props?: { root?: Partial<React.ComponentProps<typeof PaginationRoot>> }) {
  return (
    <PaginationRoot itemsPerPage={10} total={100} {...props?.root}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationFirst />
            <PaginationPrev />
            {items.map((page, index) => (
              page.type === 'page'
                ? (
                    <PaginationListItem key={index} value={page.value} />
                  )
                : (
                    <PaginationEllipsis key={page.type} />
                  )
            ))}
            <PaginationNext />
            <PaginationLast />
          </>
        )}
      </PaginationList>
    </PaginationRoot>
  )
}

describe('given default Pagination', () => {
  it('should have first page selected by default', () => {
    render(<DefaultPagination />)

    expect(page.getByLabelText('Page 1')).toHaveAttribute('data-selected', 'true')
    expect(page.getByLabelText('Page 2')).not.toHaveAttribute('data-selected')
  })

  describe('after clicking on Next Page trigger', () => {
    it('should have set to page 2', async () => {
      render(<DefaultPagination />)

      await userEvent.click(page.getByLabelText('Next Page'))

      expect(page.getByLabelText('Page 1')).not.toHaveAttribute('data-selected')
      expect(page.getByLabelText('Page 2')).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('after clicking on Page 3 trigger', () => {
    it('should have set to page 3', async () => {
      render(<DefaultPagination />)

      await userEvent.click(page.getByLabelText('Page 3'))

      expect(page.getByLabelText('Page 1')).not.toHaveAttribute('data-selected')
      expect(page.getByLabelText('Page 3')).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('after clicking on Last Page trigger', () => {
    it('should have set to page 10', async () => {
      render(<DefaultPagination />)

      await userEvent.click(page.getByLabelText('Last Page'))

      const page1Element = document.querySelector('[aria-label="Page 1"]')
      expect(page1Element).toBeNull()
      expect(page.getByLabelText('Page 10')).toHaveAttribute('data-selected', 'true')
    })
  })
})

const ALL_PAGINATION_BUTTONS_AS_A_PROPS = {
  first: { as: 'a' as const },
  prev: { as: 'a' as const },
  listItem: { as: 'a' as const },
  next: { as: 'a' as const },
  last: { as: 'a' as const },
}

function PaginationWithAs(props?: { root?: Partial<React.ComponentProps<typeof PaginationRoot>> }) {
  return (
    <PaginationRoot itemsPerPage={10} total={100} {...props?.root}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationFirst {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.first} />
            <PaginationPrev {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.prev} />
            {items.map((page, index) => (
              page.type === 'page'
                ? (
                    <PaginationListItem key={index} value={page.value} {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.listItem} />
                  )
                : (
                    <PaginationEllipsis key={page.type} />
                  )
            ))}
            <PaginationNext {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.next} />
            <PaginationLast {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.last} />
          </>
        )}
      </PaginationList>
    </PaginationRoot>
  )
}

describe('given Pagination with <a> as buttons', () => {
  it('should not unselect page 1 after clicking on Prev Page trigger', async () => {
    render(<PaginationWithAs />)

    await userEvent.click(page.getByLabelText('Previous Page'))
    expect(page.getByLabelText('Page 1')).toHaveAttribute('data-selected', 'true')
  })

  it('should not unselect last page after clicking on Next Page trigger', async () => {
    render(<PaginationWithAs />)

    await userEvent.click(page.getByLabelText('Last Page'))
    const lastPageButton = document.querySelector('[data-selected="true"]')
    const lastPageLabel = lastPageButton?.getAttribute('aria-label')
    await userEvent.click(page.getByLabelText('Next Page'))
    const currentPageButton = document.querySelector('[data-selected="true"]')
    const currentPageLabel = currentPageButton?.getAttribute('aria-label')
    expect(currentPageLabel).toBe(lastPageLabel)
  })
})

function PaginationDisabled(props?: { root?: Partial<React.ComponentProps<typeof PaginationRoot>> }) {
  const INITIAL_PAGE = 2

  return (
    <PaginationRoot itemsPerPage={10} total={100} defaultPage={INITIAL_PAGE} disabled {...props?.root}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationFirst {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.first} />
            <PaginationPrev {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.prev} />
            {items.map((page, index) => (
              page.type === 'page'
                ? (
                    <PaginationListItem key={index} value={page.value} {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.listItem} />
                  )
                : (
                    <PaginationEllipsis key={page.type} />
                  )
            ))}
            <PaginationNext {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.next} />
            <PaginationLast {...ALL_PAGINATION_BUTTONS_AS_A_PROPS.last} />
          </>
        )}
      </PaginationList>
    </PaginationRoot>
  )
}

describe('given Pagination with <a> as buttons and disabled', () => {
  const INITIAL_PAGE = 2

  it('should ignore clicking on First Page trigger', async () => {
    render(<PaginationDisabled />)

    await userEvent.click(page.getByLabelText('First Page'))

    expect(page.getByLabelText(`Page ${INITIAL_PAGE}`)).toHaveAttribute('data-selected', 'true')
  })

  it('should ignore clicking on Last Page trigger', async () => {
    render(<PaginationDisabled />)

    await userEvent.click(page.getByLabelText('Last Page'))

    expect(page.getByLabelText(`Page ${INITIAL_PAGE}`)).toHaveAttribute('data-selected', 'true')
  })

  it('should ignore clicking on any non-selected page', async () => {
    render(<PaginationDisabled />)

    await userEvent.click(page.getByLabelText('Page 1'))

    expect(page.getByLabelText(`Page ${INITIAL_PAGE}`)).toHaveAttribute('data-selected', 'true')
  })
})

function PaginationShowEdges(props?: { root?: Partial<React.ComponentProps<typeof PaginationRoot>> }) {
  return (
    <PaginationRoot itemsPerPage={10} total={100} showEdges {...props?.root}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationFirst />
            <PaginationPrev />
            {items.map((page, index) => (
              page.type === 'page'
                ? (
                    <PaginationListItem key={index} value={page.value} />
                  )
                : (
                    <PaginationEllipsis key={page.type} />
                  )
            ))}
            <PaginationNext />
            <PaginationLast />
          </>
        )}
      </PaginationList>
    </PaginationRoot>
  )
}

describe('given show-edges Pagination', () => {
  it('should have first page selected by default', () => {
    render(<PaginationShowEdges />)

    const page1Buttons = document.querySelectorAll('[aria-label="Page 1"]')
    expect(page1Buttons[0]).toHaveAttribute('data-selected', 'true')
    expect(page.getByLabelText('Page 2')).not.toHaveAttribute('data-selected')
  })

  it('should always show Page 1 & Page 10', () => {
    render(<PaginationShowEdges />)

    const page1Buttons = document.querySelectorAll('[aria-label="Page 1"]')
    expect(page1Buttons.length).toBeGreaterThan(0)
    expect(page.getByLabelText('Page 2')).toBeInTheDocument()
  })

  describe('after clicking on Next Page trigger', () => {
    it('should have set to page 2', async () => {
      render(<PaginationShowEdges />)

      await userEvent.click(page.getByLabelText('Next Page'))

      const page1Buttons = document.querySelectorAll('[aria-label="Page 1"]')
      expect(page1Buttons[0]).not.toHaveAttribute('data-selected')
      expect(page.getByLabelText('Page 2')).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('after clicking on Last Page trigger', () => {
    it('should have set to page 10', async () => {
      render(<PaginationShowEdges />)

      await userEvent.click(page.getByLabelText('Last Page'))

      const page1Buttons = document.querySelectorAll('[aria-label="Page 1"]')
      expect(page1Buttons.length).toBeGreaterThan(0)
      expect(page.getByLabelText('Page 10')).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('after clicking on Page 5 trigger', () => {
    it('should have page 2', async () => {
      render(<PaginationShowEdges />)

      await userEvent.click(page.getByLabelText('Page 5'))

      expect(page.getByLabelText('Page 2')).toBeInTheDocument()
      expect(page.getByLabelText('Page 3')).toBeInTheDocument()
      expect(page.getByLabelText('Page 4')).toBeInTheDocument()
    })

    it('should not have page 8', async () => {
      render(<PaginationShowEdges />)

      await userEvent.click(page.getByLabelText('Page 5'))

      expect(page.getByLabelText('Page 6')).toBeInTheDocument()
      expect(page.getByLabelText('Page 7')).toBeInTheDocument()
      const page8Element = document.querySelector('[aria-label="Page 8"]')
      expect(page8Element).toBeNull()
    })

    it('should have right ellipsis', async () => {
      render(<PaginationShowEdges />)

      await userEvent.click(page.getByLabelText('Page 5'))

      const ellipsis = document.querySelectorAll('[data-type="ellipsis"]')
      expect(ellipsis.length).toBe(1)
    })
  })
})

function PaginationSmallTotal(props?: { root?: Partial<React.ComponentProps<typeof PaginationRoot>> }) {
  return (
    <PaginationRoot itemsPerPage={10} total={13} {...props?.root}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationFirst />
            <PaginationPrev />
            {items.map((page, index) => (
              page.type === 'page'
                ? (
                    <PaginationListItem key={index} value={page.value} />
                  )
                : (
                    <PaginationEllipsis key={page.type} />
                  )
            ))}
            <PaginationNext />
            <PaginationLast />
          </>
        )}
      </PaginationList>
    </PaginationRoot>
  )
}

describe('given small total value', () => {
  it('should have first page selected by default', () => {
    render(<PaginationSmallTotal />)

    expect(page.getByLabelText('Page 1')).toHaveAttribute('data-selected', 'true')
    expect(page.getByLabelText('Page 2')).not.toHaveAttribute('data-selected')
  })

  it('should have only 2 page button', () => {
    render(<PaginationSmallTotal />)

    const pageButtons = document.querySelectorAll('[data-type="page"]')
    expect(pageButtons.length).toBe(2)
  })

  describe('after clicking on Next Page trigger', () => {
    it('should have set to page 2', async () => {
      render(<PaginationSmallTotal />)

      await userEvent.click(page.getByLabelText('Next Page'))

      expect(page.getByLabelText('Page 1')).not.toHaveAttribute('data-selected')
      expect(page.getByLabelText('Page 2')).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('after clicking on Last Page trigger', () => {
    it('should have set to page 2', async () => {
      render(<PaginationSmallTotal />)

      await userEvent.click(page.getByLabelText('Last Page'))

      expect(page.getByLabelText('Page 1')).toBeInTheDocument()
      expect(page.getByLabelText('Page 2')).toHaveAttribute('data-selected', 'true')
    })
  })
})

function PaginationZeroTotal(props?: { root?: Partial<React.ComponentProps<typeof PaginationRoot>> }) {
  return (
    <PaginationRoot itemsPerPage={10} total={0} {...props?.root}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationFirst />
            <PaginationPrev />
            {items.map((page, index) => (
              page.type === 'page'
                ? (
                    <PaginationListItem key={index} value={page.value} />
                  )
                : (
                    <PaginationEllipsis key={page.type} />
                  )
            ))}
            <PaginationNext />
            <PaginationLast />
          </>
        )}
      </PaginationList>
    </PaginationRoot>
  )
}

describe('given 0 total value', () => {
  it('should have first page selected by default', () => {
    render(<PaginationZeroTotal />)

    expect(page.getByLabelText('Page 1')).toHaveAttribute('data-selected', 'true')
  })

  it('all button should disabled', () => {
    render(<PaginationZeroTotal />)

    expect(page.getByLabelText('First Page')).toBeDisabled()
    expect(page.getByLabelText('Previous Page')).toBeDisabled()
    expect(page.getByLabelText('Next Page')).toBeDisabled()
    expect(page.getByLabelText('Last Page')).toBeDisabled()
  })
})
