import type { ComponentPropsWithoutRef } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface PaginationRootContext {
  page: number
  onPageChange: (value: number) => void
  pageCount: number
  siblingCount: number
  disabled: boolean
  showEdges: boolean
}

const PaginationRootContextValue = createContext<PaginationRootContext | null>(null)

export function usePaginationRootContext() {
  const context = useContext(PaginationRootContextValue)
  if (!context) {
    throw new Error('Pagination components must be used within PaginationRoot')
  }
  return context
}

export interface PaginationRootProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'dir'> {
  /** The controlled value of the current page. */
  page?: number
  /**
   * The value of the page that should be active when initially rendered.
   *
   * Use when you do not need to control the value state.
   */
  defaultPage?: number
  /** Number of items per page */
  itemsPerPage: number
  /** Number of items in your list */
  total?: number
  /** Number of sibling should be shown around the current page */
  siblingCount?: number
  /** When `true`, prevents the user from interacting with item */
  disabled?: boolean
  /** When `true`, always show first page, last page, and ellipsis */
  showEdges?: boolean
  /** Event handler called when the page value changes */
  onPageChange?: (value: number) => void
  children?: React.ReactNode | ((props: { page: number, pageCount: number }) => React.ReactNode)
}

export function PaginationRoot({
  page: controlledPage,
  defaultPage = 1,
  itemsPerPage,
  total = 0,
  siblingCount = 2,
  disabled = false,
  showEdges = false,
  onPageChange,
  children,
  ...props
}: PaginationRootProps) {
  const [internalPage, setInternalPage] = useState(defaultPage)
  const page = controlledPage ?? internalPage

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / (itemsPerPage || 1))), [total, itemsPerPage])

  const handlePageChange = useCallback((value: number) => {
    if (controlledPage === undefined) {
      setInternalPage(value)
    }
    onPageChange?.(value)
  }, [controlledPage, onPageChange])

  const contextValue = useMemo<PaginationRootContext>(() => ({
    page,
    onPageChange: handlePageChange,
    pageCount,
    siblingCount,
    disabled,
    showEdges,
  }), [page, handlePageChange, pageCount, siblingCount, disabled, showEdges])

  return (
    <PaginationRootContextValue.Provider value={contextValue}>
      <nav {...props}>
        {typeof children === 'function'
          ? children({ page, pageCount })
          : children}
      </nav>
    </PaginationRootContextValue.Provider>
  )
}
