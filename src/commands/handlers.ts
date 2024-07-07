import { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandNames } from "./constants";

export async function handleSlashCommand(interaction: ChatInputCommandInteraction){
    console.log("interaction from slash command handler")
    console.log(interaction)
    switch (interaction.commandName){
        case(SlashCommandNames.getMyTeams):
            break;
        case(SlashCommandNames.subToTeam):
            break;
        case(SlashCommandNames.unsubToTeam):
            break;
    }
}

