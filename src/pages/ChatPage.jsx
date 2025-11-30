import { createElement as h } from "react";
import { useCallback, useMemo } from "react";
import { GravityClient, useUser, useGravityAuth } from "@gravityai-dev/gravity-client";
import TopMenu from "../components/TopMenu";
import { LoginPage } from "./LoginPage";
import { workflowConfig, apiUrl, wsUrl } from "../config";

export function ChatPage() {
  const { userId, loading } = useUser();
  const { isAuthenticated, isLoading: authLoading, getAccessToken } = useGravityAuth();

  const session = useMemo(
    () => ({
      conversationId: `conv_${userId}`,
      userId,
      workflowId: workflowConfig.workflowId,
      targetTriggerNode: workflowConfig.targetTriggerNode,
    }),
    [userId]
  );

  const config = useMemo(() => ({ apiUrl, wsUrl, getAccessToken }), [getAccessToken]);

  const handleReady = useCallback(() => {
    console.log("[App] Gravity client ready!");
  }, []);

  if (loading || authLoading) {
    return h("div", { className: "h-screen flex items-center justify-center" }, "Loading...");
  }

  if (!isAuthenticated) {
    return h(LoginPage);
  }

  return h(
    "div",
    { className: "h-screen flex flex-col overflow-hidden relative" },
    h(TopMenu),
    h(GravityClient, { config, session, onReady: handleReady })
  );
}
