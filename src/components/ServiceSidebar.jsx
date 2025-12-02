import { createElement as h, useState, useEffect, useCallback, memo } from "react";
import { X } from "lucide-react";
import { ServiceDetails, BookingForm } from "./ServiceDetails";

/**
 * ServiceSidebar - Slide-in sidebar with dual-width modes
 *
 * Modes:
 * - compact: 45vw - Service details only
 * - expanded: 95vw - Service details (left) + Booking form (right)
 */
export function ServiceSidebar({ isOpen, service, onClose, onBook }) {
  const [mode, setMode] = useState("compact");

  // Reset to compact when sidebar opens
  useEffect(() => {
    if (isOpen) setMode("compact");
  }, [isOpen, service?.id]);

  const handleBookClick = useCallback(() => {
    setMode("expanded");
    onBook?.(service);
  }, [service, onBook]);

  const handleClose = useCallback(() => {
    setMode("compact");
    onClose?.();
  }, [onClose]);

  // Escape key to close
  useEffect(() => {
    const onEscape = (e) => e.key === "Escape" && isOpen && handleClose();
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [isOpen, handleClose]);

  if (!isOpen || !service) return null;

  return h(
    "div",
    { className: "fixed inset-0 z-50 flex justify-end" },

    // Backdrop
    h("div", {
      className: "absolute inset-0 bg-black/30 transition-opacity duration-300",
      onClick: handleClose,
    }),

    // Panel
    h(
      "div",
      {
        className:
          "relative bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 ease-out h-full overflow-hidden",
        style: { width: mode === "expanded" ? "95vw" : "45vw" },
      },

      // Close button
      h(
        "button",
        {
          onClick: handleClose,
          className:
            "absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
        },
        h(X, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" })
      ),

      // Content
      mode === "expanded"
        ? h(ExpandedLayout, { service })
        : h(ServiceDetails, { service, onBookClick: handleBookClick })
    )
  );
}

/** Expanded: Service (left) + Booking (right) */
function ExpandedLayout({ service }) {
  return h(
    "div",
    { className: "flex h-full w-full overflow-hidden" },

    // Left - Service details
    h(
      "div",
      { className: "w-[500px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto" },
      h(ServiceDetails, { service, showButton: false, compact: true })
    ),

    // Right - Booking form
    h(
      "div",
      { className: "flex-1 flex flex-col items-center bg-gray-50 dark:bg-gray-900 overflow-y-auto p-8" },
      h("div", { className: "w-full max-w-2xl" }, h(BookingForm, { service }))
    )
  );
}

export default memo(ServiceSidebar);
