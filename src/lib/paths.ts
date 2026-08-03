const SLUG = "wayfarer-hub";

export const COLLECTIONS = {
  USERS: `${SLUG}_users`,
  TRIPS: `${SLUG}_trips`,
  PRESENCE: `${SLUG}_presence`,
  CHATS: `${SLUG}_chats`,
} as const;

export { SLUG };
