import { ChatInputCommandInteraction, blockQuote } from "discord.js";
import { SlashCommandNames } from "./constants";
import { fuzzyLookupTeam, getTeamsForUser, getUserIdByDiscordId } from "../services/dbClient";
import generateButtonRow from "../utils/generateButtonRow";

export async function handleSlashCommand(interaction: ChatInputCommandInteraction) {
    // console.log("interaction from slash command handler")
    // console.log(interaction)
    // console.log(interaction.options)
    switch (interaction.commandName) {
        case (SlashCommandNames.getMyTeams): {
            const teams = await getTeamsForUser(interaction.user.id)
            if (!teams.length) {
                interaction.reply({ content: "You're not currently subscribed to any teams." })
                return;
            }
            const teamList = teams.join("\n")
            //todo - will need to better handle messages over the 2000 character limit here. Direct them to site if their teams count is too high to list
            if (teamList.length > 1950) interaction.reply({ content: "You're subscribed to so many teams, we can't show you them all due to Discord's character limit! Please visit revere.gg to see your full list of subscribed teams" })
            interaction.reply({ content: `You are currently subscribed to:\n ${blockQuote(teamList)}`, ephemeral: true })
            break;
        }
        case (SlashCommandNames.subToTeam): {
            if (!interaction.options.data[0]?.value || typeof interaction.options.data[0].value != "string") {
                throw new Error()
            }
            const team: string = interaction.options.data[0].value
            const teamOptions = await fuzzyLookupTeam(team, true)
            if (!teamOptions.length) {
                interaction.reply({ content: `Revere could not find any team names similar to ${team}. Visit our website to view all available teams.`, ephemeral: true })
                return;
            }
            const userId = await getUserIdByDiscordId(interaction.user.id)
            teamOptions.map((x) => x.label.replace("REPLACE", userId))
            interaction.reply({ content: `Revere found at least ${teamOptions.length} teams when looking up "${team}". Click to subscribe`, components: [generateButtonRow(teamOptions)], ephemeral: true })
            break;
        }
        case (SlashCommandNames.unsubFromTeam): {
            if (!interaction.options.data[0]?.value || typeof interaction.options.data[0].value != "string") {
                throw new Error()
            }
            const team: string = interaction.options.data[0].value
            const teamOptions = await fuzzyLookupTeam(team, false, interaction.user.id)
            if (!teamOptions.length) {
                interaction.reply({ content: `Revere could not find any teams you are subscribed to with names similar to "${team}". Try the \`/revere-get-my-teams\` command to see all of your subscribed teams.`, ephemeral: true })
                return;
            }
            const userId = await getUserIdByDiscordId(interaction.user.id)
            teamOptions.map((x) => x.label.replace("REPLACE", userId))
            interaction.reply({ content: `Revere found at least ${teamOptions.length} teams you're currently subscribed to when looking up "${team}". Click to unsubscribe`, components: [generateButtonRow(teamOptions)], ephemeral: true })
            break;
        }
    }
}

