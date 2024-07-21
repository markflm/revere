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
    if (!data[0].subscriptions) {
        return [];
    }
    // @ts-ignore
    const stringifiedTeams = data[0].subscriptions.map((x) => `${x.teams.name} (${x.teams.games.name})`)
    return stringifiedTeams;
}


export async function fuzzyLookupTeam(teamName: string, isSub: boolean, userId?: string): Promise<Button[]> {
    //TODO - make this an RPC. can return only teams that a user is subbed to if userId is passed, otherwise returns all fuzzy matches
    const subUnsubPrefix = isSub ? "sub" : "unsub"

    const splitString = teamName.trim().split(" ")
let dbCommand;
if (isSub)  dbCommand = dbClient.from("teams").select("name, id, games(name)");
else dbCommand = dbClient.from("teams").select("name, id, games(name)").eq('subscriptions.users.discord_id', userId);

    const orString = splitString.map((x, index) => `name.ilike.%${x}%`).join(",")

    const { data, error } = await dbCommand.or(orString).limit(5);

    return data.map((x) => ({ id: `${subUnsubPrefix}_REPLACE_${x.id}`, label: `${x.name} (${x.games.name})`, style: isSub ? ButtonStyle.Primary : ButtonStyle.Danger }))
}