import * as dotenv from 'dotenv';
dotenv.config();
import { SupabaseClient, createClient } from "@supabase/supabase-js";
const dbClient = createClient(process.env.SUPABASE_API_URL, process.env.SUPABASE_ANON_KEY);


export async function unsubFromTeam(userId, teamId) {
    console.log(`unsubbing from team ${teamId} for userId ${userId} `)
    const { data, error } = await dbClient.rpc('unsub_user_from_team', { p_discord_id: userId, p_team_id: teamId })
    if (error) {
        console.error(error)
    }
    console.log(data)
    return data > 0;
}

export async function subToTeam(userId, teamId) {
    console.log(`subbing to team ${teamId} for userId ${userId} `)
    const { data, error } = await dbClient.rpc('sub_user_to_team', { p_discord_id: userId, p_team_id: teamId })
    if (error) {
        console.error(error)
    }
    console.log(data)
    return data > 0;
}