export type TwitchToken = {
  expiresAt: number;
  token: string;
};

export enum SubscriptionMethod {
  WEBSOCKET = "websocket",
  WEBHOOK = "webhook",
}
