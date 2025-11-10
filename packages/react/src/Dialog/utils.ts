export function getOpenState(open: boolean) {
  return open ? 'open' : 'closed'
}

export function getActiveElement() {
  return document.activeElement as HTMLElement | null
}
