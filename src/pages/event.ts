import type { Event, SnapHandlerResult } from "../types.js";
import { categoryAccent, formatCategory } from "../helpers.js";

export function eventPage(
  event: Event,
  state: "joined" | "nominated" | null,
  base: string
): SnapHandlerResult {
  const going = event.attendees.length;
  const noms = event.nominations.length;

  const statsText =
    state === "joined"
      ? `You're in! ${going} ${going === 1 ? "person" : "people"} going`
      : state === "nominated"
        ? `Nominated! ${going} going · ${noms} nominated`
        : `${going} ${going === 1 ? "person" : "people"} going · ${noms} nominated`;

  const nomText =
    noms === 0
      ? "Tag a friend who should come"
      : `Nominated: ${event.nominations
          .slice(0, 3)
          .map((n) => n.username)
          .join(", ")}${noms > 3 ? ` +${noms - 3} more` : ""}`;

  const itemProps: Record<string, unknown> = { title: event.title };
  if (event.description) itemProps.description = event.description;

  return {
    version: "2.0",
    theme: { accent: categoryAccent(event.category) },
    ...(state === "joined" ? { effects: ["confetti"] } : {}),
    ui: {
      root: "page",
      elements: {
        page: {
          type: "stack",
          props: {},
          children: ["header", "stats", "nom-text", "sep", "actions"],
        },
        header: {
          type: "item",
          props: itemProps,
          children: ["cat-badge"],
        },
        "cat-badge": {
          type: "badge",
          props: {
            label: formatCategory(event.category),
            color: categoryAccent(event.category),
          },
        },
        stats: {
          type: "text",
          props: { content: statsText, size: "sm" },
        },
        "nom-text": {
          type: "text",
          props: { content: nomText, size: "sm" },
        },
        sep: { type: "separator", props: {} },
        actions: {
          type: "stack",
          props: { direction: "horizontal", gap: "sm" },
          children: ["join-btn", "nominate-btn"],
        },
        "join-btn": {
          type: "button",
          props: { label: "I'm In", variant: "primary", icon: "check" },
          on: {
            press: {
              action: "submit",
              params: { target: `${base}/?action=join&event=${event.id}` },
            },
          },
        },
        "nominate-btn": {
          type: "button",
          props: { label: "Nominate", icon: "users" },
          on: {
            press: {
              action: "submit",
              params: {
                target: `${base}/?action=nominate-form&event=${event.id}`,
              },
            },
          },
        },
      },
    },
  };
}
