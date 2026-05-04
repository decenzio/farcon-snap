import type { SnapHandlerResult } from "../types.js";

export function createPage(base: string, error?: string): SnapHandlerResult {
  return {
    version: "2.0",
    theme: { accent: "purple" },
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {},
          children: ["title", "title-input", "desc-input", "category", "submit-btn"],
        },
        title: {
          type: "text",
          props: {
            content: error ?? "What's the plan?",
            weight: error ? "normal" : "bold",
          },
        },
        "title-input": {
          type: "input",
          props: {
            name: "title",
            label: "Event or outing",
            placeholder: "Boiler Room · beach day · Radiohead show...",
            maxLength: 100,
          },
        },
        "desc-input": {
          type: "input",
          props: {
            name: "description",
            label: "Details (optional)",
            placeholder: "When, where, vibe...",
            maxLength: 160,
          },
        },
        category: {
          type: "toggle_group",
          props: {
            name: "category",
            label: "Type",
            options: ["Concert", "Party", "Sports", "Food", "Other"],
            defaultValue: "Other",
          },
        },
        "submit-btn": {
          type: "button",
          props: { label: "Create & Share", variant: "primary", icon: "zap" },
          on: {
            press: {
              action: "submit",
              params: { target: `${base}/?action=create` },
            },
          },
        },
      },
    },
  };
}
