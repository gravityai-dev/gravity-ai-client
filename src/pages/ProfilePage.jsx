import { createElement as h } from "react";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser, useGravityAuth } from "@gravityai-dev/gravity-client";
import { Profile } from "./profile/Profile";
import { workflowConfig, apiUrl } from "../config";

export function ProfilePage() {
  const navigate = useNavigate();
  const { workflowId, userId: paramUserId } = useParams();
  const { userId: contextUserId } = useUser();
  const { getAccessToken } = useGravityAuth();

  const handleBack = useCallback(() => navigate("/"), [navigate]);

  return h(Profile, {
    userId: paramUserId || contextUserId,
    workflowId: workflowId || workflowConfig.workflowId,
    apiUrl,
    getAccessToken,
    onBack: handleBack,
  });
}
