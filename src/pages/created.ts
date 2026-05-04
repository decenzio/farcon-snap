import type { Event, SnapHandlerResult } from "../types.js";

export function createdPage(event: Event, base: string): SnapHandlerResult {
  const snapUrl = `${base}/?event=${event.id}`;
  const castText = `Who's in for ${event.title.slice(0, 60)}?`;

  return {
    version: "2.0",
    theme: { accent: "green" },
    effects: ["confetti"],
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {},
          children: ["title", "info", "share-btn", "view-btn"],
        },
        title: {
          type: "text",
          props: { content: "Your event is live!", weight: "bold", align: "center" },
        },
        info: {
          type: "text",
          props: {
            content: `Share "${event.title.slice(0, 60)}" with your followers`,
            size: "sm",
            align: "center",
          },
        },
        "share-btn": {
          type: "button",
          props: { label: "Share as Cast", variant: "primary", icon: "share" },
          on: {
            press: {
              action: "compose_cast",
              params: {
                text: castText,
                embeds: [snapUrl],
              },
            },
          },
        },
        "view-btn": {
          type: "button",
          props: { label: "View Event", icon: "arrow-right" },
          on: {
            press: {
              action: "open_snap",
              params: { target: snapUrl },
            },
          },
        },
      },
    },
  };
}
