import * as dotenv from 'dotenv';
dotenv.config();
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Button } from '../types/Button';
import { ButtonStyle } from 'discord.js';
const dbClient = createClient(process.env.SUPABASE_API_URL, process.env.SUPABASE_ANON_KEY);

export async function getUserIdByDiscordId(discordId) {
    const { data, error } = await dbClient.from("users").select("id").eq("discord_id", discordId.toString())
    //handle error, etc
    return data[0].id;
}

export async function unsubFromTeam(userId, teamId) {
    const { data, error } = await dbClient.rpc('unsub_user_from_team', { p_discord_id: userId, p_team_id: teamId })
    if (error) {
        console.error(error)
        throw new Error("failed to unsub from team")
    }
    return data;
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
    if (!data[0].subscriptions) {
        return [];
    }
    // @ts-ignore
    const stringifiedTeams = data[0].subscriptions.map((x) => `${x.teams.name} (${x.teams.games.name})`)
    return stringifiedTeams;
}


export async function fuzzyLookupTeam(teamString: string, isSub: boolean, userId: string): Promise<Button[]> {
    const subUnsubPrefix = isSub ? "sub" : "unsub"

    const splitString = teamString.trim().split(" ")
    let teamNames = splitString.map((x, index) => `%${x}%`)
    //todo - maybe filter out any 'teamNames' under 2 or 3 characters

    let rpcParams = {
        p_team_name: teamNames,
        is_sub_lookup: isSub,
        p_discord_id: userId
    }


    const { data, error } = await dbClient.rpc('return_teams_for_user_by_team_name', rpcParams)

    if (error) {
        console.error(error.message)
        throw new Error(error.message)
    }

    return data.map((result) => ({ id: `${subUnsubPrefix}_${userId}_${result.id}`, label: `${result.teamname} (${result.gamename})`, style: isSub ? ButtonStyle.Primary : ButtonStyle.Danger }))
}

export async function getPopularTeams(userId: string): Promise<Button[]> {

    const { data, error } = await dbClient.rpc('return_popular_teams', { p_discord_id: userId })
    if (error) {
        console.error(error.message)
        throw new Error(error.message)
    }
    return data.map((result) => ({ id: `$sub_${userId}_${result.id}`, label: `${result.teamname} (${result.gamename})`, style: ButtonStyle.Primary }))

}