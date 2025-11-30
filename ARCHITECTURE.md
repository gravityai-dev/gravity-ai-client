# GravityAI Client Architecture

## Component Data Streaming Architecture

### Overview
Design system components are **pure and stateless**. All dynamic data streams from AI workflows into a **Zustand store**, and components automatically re-render when their data updates.

---

## How It Works

### 1. Component Initialization (COMPONENT_INIT)
```
AI Workflow → WebSocket → Client
```

**Server sends:**
```json
{
  "type": "COMPONENT_INIT",
  "nodeId": "airesponse4",
  "component": {
    "type": "AIResponse",
    "componentUrl": "/components/AIResponse.js"
  }
}
```

**Client does:**
1. Loads component from URL
2. Wraps it with `withZustandData(Component)` HOC
3. Stores wrapped component in history with `nodeId`

### 2. Component Data Updates (COMPONENT_DATA)
```
AI Workflow → WebSocket → Zustand → Component Re-renders
```

**Server sends:**
```json
{
  "type": "COMPONENT_DATA",
  "nodeId": "airesponse4",
  "data": {
    "progressText": "Analyzing...",
    "questions": "[{...}]"
  }
}
```

**Client does:**
1. Updates Zustand: `data[nodeId] = { ...data }`
2. Wrapped component subscribes to `data[nodeId]`
3. Component automatically re-renders with new data

### 3. Template Renders Component
```typescript
// ChatHistory.tsx
{history.map(entry => (
  <entry.Component nodeId={entry.nodeId} {...entry.props} />
))}
```

**What happens:**
- `entry.Component` is already wrapped with `withZustandData`
- Wrapped component reads from Zustand using `nodeId`
- Component merges static props + Zustand data
- Component re-renders whenever Zustand updates

---

## Key Files

### Client App (`/apps/GravityAIClient`)

**`src/utils/withZustandData.js`**
- HOC that wraps components with Zustand subscription
- Merges static props + dynamic Zustand data
- Returns pure component with merged props

**`src/hooks/useHistoryManager.js`**
- Processes COMPONENT_INIT messages
- Loads components and wraps them with `withZustandData`
- Stores wrapped components in history

**`src/hooks/useGravityWebSocket.js`**
- Receives COMPONENT_DATA messages
- Updates Zustand store: `updateComponentData(nodeId, data)`

**`src/store/componentData.js`**
- Zustand store for all component data
- Keyed by `nodeId`
- Components subscribe to their slice

### Design System (`/packages/design-system`)

**`storybook/components/AIResponse/AIResponse.tsx`**
- Pure, stateless React component
- Receives props (static + Zustand merged)
- No knowledge of Zustand or streaming

**`storybook/templates/ChatLayout/ChatHistory.tsx`**
- Renders components from history
- Passes `nodeId` to each component
- No knowledge of Zustand (components handle it)

---

## Benefits

✅ **Decoupled** - Components don't know about Zustand  
✅ **Flexible** - Templates can use components anywhere  
✅ **Real-time** - Data streams in, components auto-update  
✅ **Single Source of Truth** - Zustand manages all state  
✅ **Composable** - Mix template data + AI workflow data  
✅ **Testable** - Components are pure functions  

---

## Example Flow

### User sends message: "I have a sore leg"

1. **Workflow executes** → Multiple nodes process in parallel

2. **openai26 completes** → Sends COMPONENT_INIT:
   ```
   COMPONENT_INIT { nodeId: "airesponse4", type: "AIResponse" }
   ```
   - Client loads AIResponse component
   - Wraps with `withZustandData`
   - Adds to history
   - Component renders with empty Zustand data (shows defaults)

3. **openai26 completes** → Sends COMPONENT_DATA:
   ```
   COMPONENT_DATA { nodeId: "airesponse4", data: { progressText: "Analyzing..." } }
   ```
   - Updates Zustand: `data.airesponse4.progressText = "Analyzing..."`
   - Component re-renders with new progressText

4. **bedrockclaude25 completes** → Sends COMPONENT_DATA:
   ```
   COMPONENT_DATA { nodeId: "airesponse4", data: { questions: "[...]" } }
   ```
   - Updates Zustand: `data.airesponse4.questions = "[...]"`
   - Component re-renders with questions (progressText still there!)

5. **OpenAIStream chunks** → Sends COMPONENT_DATA repeatedly:
   ```
   COMPONENT_DATA { nodeId: "airesponse4", data: { text: "Leg pain can..." } }
   COMPONENT_DATA { nodeId: "airesponse4", data: { text: "Leg pain can be caused..." } }
   ```
   - Zustand updates on each chunk
   - Component re-renders in real-time
   - User sees text streaming in!

---

## Template Flexibility

Templates can:
- Fetch their own data (API calls, database queries)
- Manage their own UI state (scroll position, filters)
- Use design system components anywhere in their layout
- Mix template data + AI workflow data seamlessly

### Example: Booking Engine Template

```typescript
export default function BookingLayout({ client }) {
  const { history } = client;
  const [rooms, setRooms] = useState([]);
  
  // Template fetches its own data
  useEffect(() => {
    fetch('/api/rooms').then(r => r.json()).then(setRooms);
  }, []);
  
  return (
    <div>
      {/* Template's own data */}
      <RoomGrid rooms={rooms} />
      
      {/* AI workflow components (data from Zustand) */}
      {history.map(entry => (
        <entry.Component nodeId={entry.nodeId} {...entry.props} />
      ))}
    </div>
  );
}
```

The `RoomGrid` component might:
- Receive initial room data from template's API
- Get AI recommendations streamed via Zustand
- Update in real-time as workflow processes preferences

---

## Future Enhancements

- **Component Actions**: Components can send actions back to workflow
- **Optimistic Updates**: Update Zustand before server confirms
- **Offline Support**: Queue updates when disconnected
- **Time Travel**: Replay Zustand state changes for debugging
- **Component Lifecycle**: Track mount/unmount for analytics
