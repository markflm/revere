import * as dotenv from 'dotenv';
dotenv.config({path: "../.env"});
import { ApplicationCommandOptionType, REST, Routes } from "discord.js";
import { SlashCommandNames } from './constants';

const commands = [
    // {
    //   name: 'revere-test',
    //   description: 'testing slash commands in DM',
    //   options: [
    //     {
    //       name: 'Team Name',
    //       description: "Provide the name of the team you'd like to subscribe to. Revere will return all teams that are close matches.",
    //       type: ApplicationCommandOptionType.String,
    //       required: true
    //     },
    //   ]
    // }
    {
        name: SlashCommandNames.getStarted,
        description: "Returns a breakdown on how to use Revere."
    },
    {
        name: SlashCommandNames.getMyTeams,
        description: "Returns a list of all teams you're currently subscribed to"
    },
    {
        name: SlashCommandNames.subToTeam,
        description: "Provide a team name and Revere will return a few matching options to subscribe to.",
        options:[ {
            name: "subscribe-to-this-team",
            description: "Provide the name of the team you'd like to subscribe to.",
            type: ApplicationCommandOptionType.String,
            required: true

        }]
    },
    {
        name: SlashCommandNames.unsubFromTeam,
        description: "Provide a team name and Revere will return a few matching options you are currently subscribed to.",
        options: [{
            name: "unsubscribe-from-this-team",
            description: "Provide the name of the team you'd like to unsubscribe from.",
            type: ApplicationCommandOptionType.String,
            required: true

        }]
    }

  ];

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  // and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
			{ body: commands },
		);

	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();