import { createElement as h } from "react";

/**
 * Service Details - Premium service display
 */
export function ServiceDetails({ service, onBookClick, showButton = true, compact = false }) {
  if (!service) return null;

  // Extract data
  const title = service.title;
  const keyNeed = service.key_need;
  const image = service.metadata?.images?.[0];
  const bodyCopy = service.metadata?.bodyCopy;
  const callToAction = service.metadata?.callToAction || "Book Now";
  const needs = service.needs || [];

  return h(
    "div",
    { className: "h-full flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950" },

    // Hero Image with gradient overlay
    image &&
      h(
        "div",
        { className: "relative w-full h-72 flex-shrink-0" },
        h("img", {
          src: image,
          alt: title || "Service",
          className: "w-full h-full object-cover",
        }),
        // Gradient overlay
        h("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" }),
        // Title overlay on image
        h(
          "div",
          { className: "absolute bottom-0 left-0 right-0 p-8" },
          h("h2", { className: "text-3xl font-bold text-white drop-shadow-lg leading-tight" }, title)
        )
      ),

    // Content
    h(
      "div",
      { className: "flex-1 overflow-y-auto px-8 py-8 space-y-6" },

      // Key Need badge
      keyNeed &&
        h(
          "div",
          { className: "inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full" },
          h("div", { className: "w-2 h-2 bg-emerald-500 rounded-full" }),
          h("span", { className: "text-sm font-medium text-emerald-700 dark:text-emerald-300" }, keyNeed)
        ),

      // Needs as elegant pills
      needs.length > 0 &&
        h(
          "div",
          { className: "flex flex-wrap gap-2" },
          needs.slice(0, 5).map((need, idx) =>
            h(
              "span",
              {
                key: idx,
                className:
                  "px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full shadow-sm border border-gray-100 dark:border-gray-700",
              },
              need
            )
          )
        ),

      // Body Copy with premium typography
      bodyCopy &&
        h("div", {
          className:
            "prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-semibold prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-600 dark:prose-li:text-gray-400",
          dangerouslySetInnerHTML: { __html: bodyCopy },
        })
    ),

    // CTA Button - Premium style
    showButton &&
      h(
        "div",
        { className: "flex-shrink-0 p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800" },
        h(
          "button",
          {
            onClick: onBookClick,
            className:
              "w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5",
          },
          callToAction
        )
      )
  );
}

/**
 * Booking Form Placeholder - Replace with actual booking component
 */
export function BookingForm({ service }) {
  return h(
    "div",
    { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8" },

    h(
      "h2",
      { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6" },
      `Book ${service?.title || "Service"}`
    ),

    h("p", { className: "text-gray-600 dark:text-gray-400 mb-8" }, "Booking form will be loaded here..."),

    h(
      "div",
      { className: "space-y-4" },

      // Name field
      h(
        "div",
        null,
        h("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Name"),
        h("input", {
          type: "text",
          className:
            "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
          placeholder: "Your name",
        })
      ),

      // Email field
      h(
        "div",
        null,
        h("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Email"),
        h("input", {
          type: "email",
          className:
            "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
          placeholder: "your@email.com",
        })
      ),

      // Date field
      h(
        "div",
        null,
        h("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" }, "Preferred Date"),
        h("input", {
          type: "date",
          className:
            "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
        })
      ),

      // Submit button
      h(
        "button",
        {
          className:
            "w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200",
        },
        "Confirm Booking"
      )
    )
  );
}
