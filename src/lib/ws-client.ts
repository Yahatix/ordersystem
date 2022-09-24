import { browser } from "$app/environment"

export const wsc = browser ? new WebSocket("ws://localhost:3001") : null