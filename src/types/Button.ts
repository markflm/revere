import { ButtonStyle } from "discord.js"

//buttons with links can't have customIds, buttons with customIds can't have links
export type Button = {
    id?: string;
    label: string;
    style: ButtonStyle;
    link?: string;
}