import { ChatInputCommandInteraction, blockQuote } from "discord.js";
import { SlashCommandNames } from "./constants";
import { getTeamsForUser } from "../services/dbClient";

export async function handleSlashCommand(interaction: ChatInputCommandInteraction){
    console.log("interaction from slash command handler")
    console.log(interaction)
    switch (interaction.commandName){
        case(SlashCommandNames.getMyTeams):
            const teams = await getTeamsForUser(interaction.user.id)
            if (!teams.length) interaction.reply({content: "You're not currently subscribed to any teams."})
            const teamList = teams.join("\n")
            //todo - will need to better handle messages over the 2000 character limit here. Direct them to site if their teams count is too high to list
            if (teamList.length > 1950) interaction.reply({content: "You're subscribed to so many teams, we can't show you them all due to Discord's character limit! Please visit revere.gg to see your full list of subscribed teams"})
            interaction.reply({content: `You are currently subscribed to:\n ${blockQuote(teamList)}`, ephemeral: true})
            break;
        case(SlashCommandNames.subToTeam):
            break;
        case(SlashCommandNames.unsubFromTeam):
            break;
    }
}

