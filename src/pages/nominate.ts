import type { SnapHandlerResult } from "../types.js";

export function nominatePage(
  eventId: string,
  base: string,
  error?: string
): SnapHandlerResult {
  return {
    version: "2.0",
    theme: { accent: "teal" },
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {},
          children: ["header", "hint", "username-input", "actions"],
        },
        header: {
          type: "text",
          props: {
            content: error ?? "Who should come?",
            weight: "bold",
          },
        },
        hint: {
          type: "text",
          props: {
            content: "Tag a friend — enter their @username.",
            size: "sm",
          },
        },
        "username-input": {
          type: "input",
          props: {
            name: "username",
            label: "Friend's username",
            placeholder: "@alice",
            maxLength: 50,
          },
        },
        actions: {
          type: "stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["nominate-btn", "cancel-btn"],
        },
        "nominate-btn": {
          type: "button",
          props: { label: "Nominate", variant: "primary", icon: "users" },
          on: {
            press: {
              action: "submit",
              params: { target: `${base}/?action=nominate&event=${eventId}` },
            },
          },
        },
        "cancel-btn": {
          type: "button",
          props: { label: "Cancel" },
          on: {
            press: {
              action: "submit",
              params: { target: `${base}/?action=cancel&event=${eventId}` },
            },
          },
        },
      },
    },
  };
}
