declare module 'use-lanyard' {
  export interface LanyardData {
    discord_user: {
      id: string;
      username: string;
      discriminator: string;
      avatar: string;
    };
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
    activities: any[];
  }

  export interface LanyardResponse {
    data?: LanyardData;
    error?: any;
    isValidating: boolean;
  }

  export function useLanyard(discordId: string): LanyardResponse;
}
