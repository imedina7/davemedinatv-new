import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

export type LinkWithIcon = {
  label: string;
  url: string;
  icon: string | object | string[] | IconDefinition;
  class?: string;
};

export const socialMediaLinks: LinkWithIcon[] = [
  {
    label: "Youtube",
    url: "https://www.youtube.com/DaveMedinaTV",
    icon: ["fab", "youtube"],
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/davemedina.tv",
    icon: ["fab", "instagram"],
  },
  {
    label: "Twitch",
    url: "https://www.twitch.tv/davemedinatv",
    icon: ["fab", "twitch"],
  },
];

export const SWIPE_MIN_THRESHOLD = 12;
export const SWIPE_ACTION_THRESHOLD = 23;
