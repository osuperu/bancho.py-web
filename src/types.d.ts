declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test"
    readonly PUBLIC_URL: string
    readonly REACT_APP_APP_NAME: string
    readonly REACT_APP_BPY_API_BASE_URL: string
    readonly REACT_APP_BPY_AVATARS_BASE_URL: string
    readonly REACT_APP_BPY_MAPS_BASE_URL: string
    readonly REACT_APP_BEATMAP_MIRROR_URL: string
    readonly REACT_APP_DISCORD_INVITE_URL: string
    readonly REACT_APP_GITHUB_ORG_URL: string
    readonly REACT_APP_HCAPTCHA_SITE_KEY: string
  }
}
