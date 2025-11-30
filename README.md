# Gravity AI Client

**Proof of concept** for AI Component Streaming via WebSocket.

## What It Does

- Connects to Gravity Design System WebSocket (`/ws/gravity-ds`)
- Receives component definitions in real-time
- Dynamically loads and renders Storybook components
- Handles user interactions and sends them back to server

## Architecture

```
WebSocket → Component Event → Load Bundle → Render → User Action → WebSocket
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3006
   ```

## How It Works

### 1. WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:4100/ws/gravity-ds');
ws.send(JSON.stringify({
  type: "INIT_SESSION",
  chatId: "test-chat-123",
  conversationId: "test-conv-456",
  userId: "test-user-789"
}));
```

### 2. Receive Component Event
```javascript
{
  __typename: "GravityEvent",
  eventType: "component",
  data: {
    component: {
      type: "ChatInput",
      componentUrl: "/components/ChatInput.js",
      props: { placeholder: "Ask me anything..." }
    }
  }
}
```

### 3. Load Component
```javascript
const response = await fetch('http://localhost:4100/components/ChatInput.js');
const code = await response.text();
const module = await import(blobUrl);
const Component = module.default;
```

### 4. Render Component
```jsx
<Component {...props} onSend={(msg) => sendUserAction('send_message', { msg })} />
```

## Project Structure

```
src/
├── App.jsx                      # Main app component
├── main.jsx                     # Entry point
├── index.css                    # Global styles
├── hooks/
│   ├── useGravityWebSocket.js   # WebSocket connection
│   └── useComponentLoader.js    # Dynamic component loading
└── components/
    └── ComponentRenderer.jsx    # Renders loaded components
```

## Features

✅ WebSocket connection with auto-reconnect
✅ Dynamic component loading and caching
✅ Component lifecycle tracking
✅ User action forwarding
✅ Debug info panel
✅ Tailwind CSS styling

## Next Steps

- [ ] Add error boundaries
- [ ] Add component version management
- [ ] Add state management (Zustand)
- [ ] Add reconnection logic
- [ ] Add loading states
- [ ] Add component transitions
- [ ] Add metrics/monitoring

## Testing

1. Start the server: `cd ../../server && npm run dev`
2. Start the client: `npm run dev`
3. Open browser and watch components stream in!

## Notes

- This is a **proof of concept** - not production ready
- Components must be built with `npm run generate-nodes` in design-system package
- Server must be running on `localhost:4100`
