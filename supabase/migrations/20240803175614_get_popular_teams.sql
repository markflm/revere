CREATE OR REPLACE FUNCTION return_popular_teams(p_discord_id BIGINT)
   RETURNS TABLE (id BIGINT, teamName TEXT, gameName TEXT)
   LANGUAGE PLPGSQL
AS
$$
BEGIN
RETURN QUERY select t.id, t.name teamname, g.name gamename from teams t join games g on t.game_id = g.id
join (select t.id, count(s.id) from teams t join subscriptions s on t.id = s.team_id join users u on u.id = s.user_id where u.discord_id <> p_discord_id group by t.id order by count(s.id) desc limit 5) pt on t.id = pt.id;

end;
$$;