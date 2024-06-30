import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Button } from "../types/Button";


export default function generateButtonRow(buttons: Button[]){

const actionRow = new ActionRowBuilder<ButtonBuilder>()

for (let i = 0; i < buttons.length; i++){
    const btnBuilder = new ButtonBuilder().setLabel(buttons[i].label).setStyle(buttons[i].style)
    if (buttons[i].link){ //buttons with links can't have customIds, buttons with customIds can't have links
        btnBuilder.setURL(buttons[i].link)
    }
    else {
        btnBuilder.setCustomId(buttons[i].id)
    }

    actionRow.addComponents(btnBuilder)
}

return actionRow
}