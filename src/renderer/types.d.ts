declare interface Window {
    api: {
      send: (channel: string, ...arg: any) => void;
      receive: (channel: string, func: (event: any, ...arg: any) => void) => void;
    },
    settings: any
}

declare type chatSettings = {
  emotes: {
    twitch: {
      global: {

      },
      channel: {

      }
    },
    bttv: {
      global: {

      },
      channel: {

      }
    },
    ffz: {
      channel: {

      }
    }

  },
  badges: {
    twitch: {
      global: {

      }
      channel: {
        
      }
    }
  },
  mutedUsers: string[]
}