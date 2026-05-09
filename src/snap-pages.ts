import type { SnapElementInput, SnapHandlerResult } from "@farcaster/snap";
import type { Poll } from "./supabase.js";

// "green" is intentionally absent — it's reserved as the selected-bar highlight.
const PALETTE = [
  "blue",
  "amber",
  "pink",
  "teal",
  "purple",
  "red",
] as const;

export function homePageSnap(origin: string): SnapHandlerResult {
  return {
    version: "2.0",
    theme: { accent: "purple" },
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {},
          children: ["title", "body", "create-btn"],
        },
        title: {
          type: "text",
          props: { content: "Farcaster Polls", weight: "bold" },
        },
        body: {
          type: "text",
          props: {
            content:
              "Create a poll with a question, image, and up to 6 options. Share the URL on Farcaster and watch votes roll in.",
            size: "sm",
          },
        },
        "create-btn": {
          type: "button",
          props: {
            label: "Create a poll",
            variant: "primary",
            icon: "plus",
          },
          on: {
            press: {
              action: "open_url",
              params: { target: `${origin}/create` },
            },
          },
        },
      },
    },
  };
}

export function pollSnap(poll: Poll, origin: string): SnapHandlerResult {
  const target = `${origin}/?id=${encodeURIComponent(poll.id)}`;

  const elements: Record<string, SnapElementInput> = {
    page: {
      type: "stack",
      props: {},
      children: poll.image_url
        ? ["image", "question", "choice", "vote-btn"]
        : ["question", "choice", "vote-btn"],
    },
    question: {
      type: "text",
      props: { content: poll.question.slice(0, 320), weight: "bold" },
    },
    choice: {
      type: "toggle_group",
      props: {
        name: "choice",
        orientation: "vertical",
        options: poll.options,
      },
    },
    "vote-btn": {
      type: "button",
      props: { label: "Vote", variant: "primary" },
      on: {
        press: {
          action: "submit",
          params: { target },
        },
      },
    },
  };

  if (poll.image_url) {
    elements.image = {
      type: "image",
      props: {
        url: poll.image_url,
        aspect: "16:9",
        alt: poll.question.slice(0, 120),
      },
    };
  }

  return {
    version: "2.0",
    theme: { accent: "purple" },
    ui: { root: "page", elements },
  };
}

export function resultsSnap(
  poll: Poll,
  counts: Record<string, number>,
  origin: string,
  selected: string,
): SnapHandlerResult {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const max = Math.max(1, ...poll.options.map((o) => counts[o] ?? 0));
  const bars = poll.options.map((label, i) => ({
    label: label.slice(0, 40),
    value: counts[label] ?? 0,
    color: label === selected ? "green" : PALETTE[i % PALETTE.length],
  }));

  return {
    version: "2.0",
    theme: { accent: "purple" },
    effects: ["confetti"],
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {},
          children: ["title", "subtitle", "chart", "back-btn"],
        },
        title: {
          type: "text",
          props: { content: poll.question.slice(0, 320), weight: "bold" },
        },
        subtitle: {
          type: "text",
          props: {
            content: `You voted "${selected}" · ${total} vote${total === 1 ? "" : "s"} total`,
            size: "sm",
          },
        },
        chart: {
          type: "bar_chart",
          props: { bars, max },
        },
        "back-btn": {
          type: "button",
          props: { label: "Change my vote", icon: "refresh-cw" },
          on: {
            press: {
              action: "submit",
              params: {
                target: `${origin}/?id=${encodeURIComponent(poll.id)}&view=poll`,
              },
            },
          },
        },
      },
    },
  };
}

export function errorSnap(message: string): SnapHandlerResult {
  return {
    version: "2.0",
    theme: { accent: "red" },
    ui: {
      root: "page",
      elements: {
        page: { type: "stack", props: {}, children: ["title", "body"] },
        title: {
          type: "text",
          props: { content: "Something went wrong", weight: "bold" },
        },
        body: {
          type: "text",
          props: { content: message.slice(0, 320) },
        },
      },
    },
  };
}
