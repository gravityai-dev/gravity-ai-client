// App configuration

export const workflowConfig = {
  workflowId: "wf-htmn4a",
  targetTriggerNode: "inputtrigger8",
};

export const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4100";
export const wsUrl = import.meta.env.VITE_WS_GRAVITY_DS || "ws://localhost:4100/ws/gravity-ds";
