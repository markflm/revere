CREATE OR REPLACE FUNCTION return_teams_for_user_by_team_name(p_team_name TEXT[], is_sub_lookup BOOLEAN, p_discord_id BIGINT DEFAULT NULL)
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
   LEFT JOIN users u ON s.user_id = u.id AND u.discord_id = COALESCE(p_discord_id, u.discord_id)
   WHERE EXISTS (
       SELECT 1
       FROM unnest(p_team_name) AS pattern
       WHERE t.name ILIKE pattern
   )
   AND CASE WHEN p_discord_id IS NOT NULL THEN 
    CASE WHEN is_sub_lookup = TRUE 
      THEN CASE WHEN u.id is null 
        THEN TRUE ELSE u.discord_id <> p_discord_id END
        ELSE u.discord_id = p_discord_id END 
  ELSE TRUE END;

END;
$$;
