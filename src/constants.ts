export const Games = {
    valorant: 1,
    csgo: 2
    } as const

export const ValorantDefaults = {
messageAuthor: { name: 'vlr.gg', iconURL: 'https://www.vlr.gg/img/vlr/logo_header.png', url: 'https://www.vlr.gg' },
messageThumbnail: {url:"https://www.vlr.gg/img/vlr/logo_header.png"}

} as const

export const UnsubOneTeamRegex = /^unsub_[^_]*_[^_]*$/;
export const SubOneTeamRegex = /^sub_[^_]*_[^_]*$/;