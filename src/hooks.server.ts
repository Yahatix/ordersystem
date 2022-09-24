import WebSocketServer from "$lib/ws";
import type { Handle } from "@sveltejs/kit";
import {WebSocket} from "ws"

const wss = new WebSocketServer({
  port: 3001
})

wss.on("connection", ws => {
  ws.on("message", data => {
    wss.clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(data.toString())
      }
    })
  })
})

export const handle: Handle = async ({event, resolve}) => {
  event.locals = {
    wss,
  }
  return await resolve(event)
}
