export type TwitchToken = {
  expiresAt: number;
  token: string;
};

export enum SubscriptionMethod {
  WEBSOCKET = "websocket",
  WEBHOOK = "webhook",
}

export interface Stream {
  id: string;
  thumbnail_url: string;
  type: string;
  category_name: string;
  tags: string[];
  viewer_count: string;
  user_id: string;
  is_mature: boolean;
  title: string;
  user_name: string;
  content_classification_labels: string[];
  language: string;
  game_id: string;
  started_at: string;
  tag_ids: any[];
  user_login: string;
  game_name: string;
}
