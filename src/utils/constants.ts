import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

export type LinkWithIcon = {
  label: string;
  url: string;
  icon: string | object | string[] | IconDefinition;
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
    label: "Twitter",
    url: "https://www.twitter.com/davemedinatv",
    icon: ["fab", "twitter"],
  },
  {
    label: "Twitch",
    url: "https://www.twitch.tv/davemedinatv",
    icon: ["fab", "twitch"],
  },
];
