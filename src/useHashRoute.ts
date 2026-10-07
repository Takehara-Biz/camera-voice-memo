import { useSyncExternalStore } from 'react'

export type Route =
  | { name: 'top' }
  | { name: 'new' }
  | { name: 'detail'; id: string }

function subscribe(callback: () => void): () => void {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getHash(): string {
  return window.location.hash
}

function parse(hash: string): Route {
  const path = hash.replace(/^#/, '')
  if (path === '/new') return { name: 'new' }
  const m = /^\/memo\/(.+)$/.exec(path)
  if (m) return { name: 'detail', id: decodeURIComponent(m[1]) }
  return { name: 'top' }
}

export function navigate(path: string): void {
  window.location.hash = path
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash)
  return parse(hash)
}
