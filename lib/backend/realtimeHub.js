const state = globalThis.__relayflowRealtimeHub || { clients: new Map() };
globalThis.__relayflowRealtimeHub = state;

export function registerRealtimeClient(userId, role, socket) {
  const id = crypto.randomUUID();
  state.clients.set(id, { id, userId: String(userId), role, socket });
  return () => state.clients.delete(id);
}

export function broadcastRealtime(event) {
  const payload = JSON.stringify({ type: event.type, data: event.data, emittedAt: new Date().toISOString() });
  let delivered = 0;
  for (const client of state.clients.values()) {
    const directMatch = event.recipientId && String(event.recipientId) === client.userId;
    const roleMatch = event.audienceRole && event.audienceRole === client.role;
    if (!directMatch && !roleMatch) continue;
    try {
      if (client.socket.readyState === 1) {
        client.socket.send(payload);
        delivered += 1;
      }
    } catch {
      state.clients.delete(client.id);
    }
  }
  return delivered;
}

export function realtimeStats() {
  return { connectedClients: state.clients.size };
}
