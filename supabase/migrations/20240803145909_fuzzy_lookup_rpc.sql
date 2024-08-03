CREATE OR REPLACE FUNCTION return_teams_for_user_by_team_name(p_team_name TEXT[], p_discord_id BIGINT DEFAULT NULL)
   RETURNS TABLE (id BIGINT, teamName TEXT, gameName TEXT)
   LANGUAGE PLPGSQL
AS
$$
BEGIN
   RETURN QUERY
   SELECT t.id AS teamId, t.name AS teamName, g.name AS gameName
   FROM teams t
   JOIN games g ON t.game_id = g.id
   LEFT JOIN subscriptions s ON s.team_id = t.id
   LEFT JOIN users u ON s.user_id = u.id
   WHERE EXISTS (
       SELECT 1
       FROM unnest(p_team_name) AS pattern
       WHERE t.name ILIKE pattern
   )
   AND CASE WHEN p_discord_id IS NOT NULL THEN u.discord_id = p_discord_id ELSE TRUE END;

END;
$$;
