import * as dotenv from 'dotenv';
dotenv.config();
import { SupabaseClient, createClient } from "@supabase/supabase-js";
const dbClient = createClient(process.env.SUPABASE_API_URL, process.env.SUPABASE_ANON_KEY);


export async function unsubFromTeam(userId, teamId) {
    const { data, error } = await dbClient.rpc('unsub_user_from_team', { p_discord_id: userId, p_team_id: teamId })
    if (error) {
        console.error(error)
    }
    return data > 0;
}

export async function subToTeam(userId, teamId) {
    console.log(`subbing to team ${teamId} for userId ${userId} `)
    const { data, error } = await dbClient.rpc('sub_user_to_team', { p_discord_id: userId, p_team_id: teamId })
    if (error) {
        console.error(error)
        throw new Error("failed to sub to team")
    }
    return data;
}

//todo - could replace with RPC. supabase sdk kind of sucks for anything other than very basic read/writes
export async function getTeamsForUser(userId): Promise<string[]> {
    const { data, error } = await dbClient.from("users").select("subscriptions(teams(name, games(name)))").eq("discord_id", userId);
    if (!data[0].subscriptions){
        return [];
    }
     // @ts-ignore
    const stringifiedTeams = data[0].subscriptions.map((x) => `${x.teams.name} (${x.teams.games.name})`)
    return stringifiedTeams;
}