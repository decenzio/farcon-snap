export type { PaletteColor, SnapHandlerResult } from "@farcaster/snap";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  creatorFid: number;
  createdAt: number;
  attendees: number[];
  nominations: Nomination[];
}

export interface Nomination {
  nominatorFid: number;
  username: string;
}
