//build match links possibly
const exampleEmbed = new EmbedBuilder()
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