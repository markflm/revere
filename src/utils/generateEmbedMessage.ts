import { EmbedBuilder, EmbedData } from "discord.js";
import { Games, ValorantDefaults } from "../constants";




export function createEmbedMessage(data: EmbedData, game?: number) {
	if (game) setEmbedDefaultsByGame(data, game);
	const embed = new EmbedBuilder()
		.setColor(data.color || 0x0099FF)
	if (data.title) embed.setTitle(data.title)
	if (data.url) embed.setURL(data.url)
	if (data.author) embed.setAuthor(data.author)
	if (data.description) embed.setDescription(data.description);
	if (data.thumbnail) embed.setThumbnail(data.thumbnail.url)
	// if (data.fields) embed.addFields(data.fields)
	if (data.image) embed.setImage(data.image.url)
	if (data.footer) embed.setFooter(data.footer)

	return embed;
}

function setEmbedDefaultsByGame(data: EmbedData, game: number) {
	if (game == Games.valorant) {
		data.author = ValorantDefaults.messageAuthor;
		data.thumbnail = ValorantDefaults.messageThumbnail
	}
}
//build match links possibly
export const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('A Stupid Fucking Jett Is Going Awp Some Guy')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'vlr.gg', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail('https://image.cnbcfm.com/api/v1/image/107434795-17195770642024-06-28t033644z_1463013331_rc21k8aa9r6x_rtrmadp_0_usa-election-debate.jpeg?v=1719577082&w=929&h=523&vtcrop=y')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://www.kron4.com/wp-content/uploads/sites/11/2024/06/democrat-biden_lillis-schnell_GettyImages.jpg?w=900')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });