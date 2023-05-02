declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ABLY_PUBLISH_API_KEY: string;
      NEXT_PUBLIC_ABLY_SUBSCRIBE_API_KEY: string;
      DB_CONNECTION_STRING: string;
    }
  }
}

export {};