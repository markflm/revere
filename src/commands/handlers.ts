import { ChatInputCommandInteraction, EmbedData, blockQuote } from "discord.js";
import { SlashCommandNames } from "./constants";
import { fuzzyLookupTeam, getPopularTeams, getTeamsForUser, getUserIdByDiscordId } from "../services/dbClient";
import generateButtonRow from "../utils/generateButtonRow";
import { ValorantDefaults } from "../constants";
import { createEmbedMessage } from "../utils/generateEmbedMessage";

export async function handleSlashCommand(interaction: ChatInputCommandInteraction) {
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
            const teamOptions = await fuzzyLookupTeam(team, true, interaction.user.id)
            if (!teamOptions.length) {
                interaction.reply({ content: `Revere could not find any teams you are not currently subscribed to with names similar to "**${team}**". Visit our website to view all available teams.`, ephemeral: true })
                return;
            }
            interaction.reply({ content: `Revere found at least ${teamOptions.length} teams you are not currently subscribed to when looking up "**${team}**". Click to subscribe`, components: [generateButtonRow(teamOptions)], ephemeral: true })
            break;
        }
        case (SlashCommandNames.unsubFromTeam): {
            if (!interaction.options.data[0]?.value || typeof interaction.options.data[0].value != "string") {
                throw new Error()
            }
            const team: string = interaction.options.data[0].value
            const teamOptions = await fuzzyLookupTeam(team, false, interaction.user.id)
            if (!teamOptions.length) {
                interaction.reply({ content: `Revere could not find any teams you are subscribed to with names similar to "**${team}**". Try the \`/revere-get-my-teams\` command to see all of your subscribed teams.`, ephemeral: true })
                return;
            }
            interaction.reply({ content: `Revere found at least ${teamOptions.length} team(s) you're currently subscribed to when looking up "${team}". Click to unsubscribe`, components: [generateButtonRow(teamOptions)], ephemeral: true })
            break;
        }
        case (SlashCommandNames.getStarted): {
            //todo - check if interaction.user.id is already a Revere user. adjust message/teams present if they already exist

            const teamOptions = await getPopularTeams(interaction.user.id)
            const embedData: EmbedData = {};
            embedData.title = `Welcome to Revere!`
            embedData.description = `With esports being played around the globe at all hours of the day, it can be hard to keep track of all of your favorite team's matches.
            **Revere** is here to help. Revere will send you an alert when your favorite team is about to start a match.
            You can interact with Revere through Discord commands, or you can use our website linked above.
            Use the \`/revere-add-team\` command to subscribe to your favorite teams! 
            To get you started, here are some of our most subscribed to teams from popular games.`
            embedData.url = "http://www.revere.gg"
            // embedData.thumbnail = ValorantDefaults.messageThumbnail
            embedData.author ={ name: 'Revere', iconURL: 'https://www.vlr.gg/img/vlr/logo_header.png', url: 'http://www.revere.gg' },
            //todo - replace the content here. a footer makes the message look better.
            embedData.footer = { text: 'Upgrade to Revere Pro for a better experience', iconURL: 'https://i.imgur.com/AfFp7pu.png' };
           
            interaction.reply({embeds:[createEmbedMessage(embedData)], components: [generateButtonRow(teamOptions)]})
        }
    }
}

