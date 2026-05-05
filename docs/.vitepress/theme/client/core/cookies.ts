export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(';').shift()!
  return null
}

export function setCookie(name: string, value: string) {
  const expires = new Date('2999-12-31T23:59:59Z').toUTCString()
  document.cookie = `${name}=${value};expires=${expires};path=/`
}
