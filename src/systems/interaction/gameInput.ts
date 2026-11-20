export function isGameplayKey(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return false
  return !(event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"], [aria-modal="true"]'))
}
