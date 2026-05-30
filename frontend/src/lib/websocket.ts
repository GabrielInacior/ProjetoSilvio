import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient: Client | null = null

export function connectWS(token: string, onMessage: (body: unknown) => void) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    connectHeaders: { Authorization: `Bearer ${token}` },
    onConnect: () => {
      stompClient!.subscribe('/user/queue/notificacoes', (msg) => {
        onMessage(JSON.parse(msg.body))
      })
      stompClient!.subscribe('/topic/avisos-gerais', (msg) => {
        onMessage(JSON.parse(msg.body))
      })
    },
    reconnectDelay: 5000,
  })
  stompClient.activate()
}

export function disconnectWS() {
  stompClient?.deactivate()
  stompClient = null
}
