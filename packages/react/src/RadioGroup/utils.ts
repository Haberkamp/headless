type AcceptableValue = string | number | bigint | Record<string, any> | null

export type SelectEvent = CustomEvent<{ originalEvent: MouseEvent, value?: AcceptableValue }>
export const RADIO_SELECT = 'radio.select'

export function handleSelect(event: MouseEvent, value: AcceptableValue | undefined, callback: (event: SelectEvent) => void) {
  const eventDetail = { originalEvent: event, value }
  const customEvent = new CustomEvent(RADIO_SELECT, { detail: eventDetail }) as SelectEvent
  callback(customEvent)
}
