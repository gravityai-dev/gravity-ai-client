import { createElement as h } from "react";
import { useMemo } from "react";
import { GravityClient, useUser, useGravityAuth } from "@gravityai-dev/gravity-client";
import TopMenu from "../components/TopMenu";
import { LoginPage } from "./LoginPage";
import { ServiceSidebar } from "../components/ServiceSidebar";
import { useServiceSidebar } from "../hooks/useServiceSidebar";
import { workflowConfig, apiUrl, wsUrl } from "../config";

export function ChatPage() {
  const { userId, loading } = useUser();
  const { isAuthenticated, isLoading: authLoading, getAccessToken } = useGravityAuth();
  const { sidebarOpen, activeService, closeSidebar, handleBook } = useServiceSidebar();

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
    h(GravityClient, { config, session }),
    h(ServiceSidebar, {
      isOpen: sidebarOpen,
      service: activeService,
      onClose: closeSidebar,
      onBook: handleBook,
    })
  );
}
