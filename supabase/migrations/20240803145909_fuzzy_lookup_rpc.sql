create or replace function return_teams_for_user_by_team_name(p_team_name text, p_discord_id bigint default null)
   returns TABLE (id bigint, teamName text, gameName text)
   language plpgsql
  as
$$

begin
return query
select t.id teamId, t.name teamName, g.name gameName  from teams t join games g on t.game_id = g.id
left join subscriptions s on s.team_id = t.id
left join users u on s.user_id = u.id 
where t.name ilike p_team_name and CASE WHEN p_discord_id IS NOT NULL THEN u.discord_id = p_discord_id ELSE true END;

end;
$$;