create or replace function unsub_user_from_team(p_discord_id bigint, p_team_id bigint)
   returns text
   language plpgsql
  as
$$
declare
  del_count integer;
  unsubbed_from_team text;
begin

WITH deleted AS (delete from subscriptions s using users u where s.user_id = u.id and u.discord_id = p_discord_id and s.team_id = p_team_id RETURNING *) SELECT into del_count count(*) FROM deleted;

if del_count = 1 then
   select CONCAT(t.name, ' (', g.name, ')') into unsubbed_from_team from teams t join games g on t.game_id = g.id where t.id = p_team_id;
   return unsubbed_from_team;
else
  RAISE 'Delete Failed';
end if;

end;
$$;


create or replace function sub_user_to_team(p_discord_id bigint, p_team_id bigint)
   returns text
   language plpgsql
  as
$$
declare
-- need to come up with numbers for error states.
-- e.g. 0 = team doesn't exist, 1 = user doesn't exist, 2 = team exists but you're not subscribed
  is_real_team boolean;
  already_subbed boolean;
  userid bigint;
  subbed_to_team text;
begin

--confirm this is a real team_id
select into is_real_team CASE WHEN EXISTS (SELECT true FROM teams WHERE id = p_team_id) THEN true ELSE false END;
if is_real_team <> true then
  RAISE '3';
end if;

select into already_subbed case when count(*) > 0 then true else false end from subscriptions s join users u on s.user_id = u.id where s.team_id = p_team_id and u.discord_id = p_discord_id;

if already_subbed = true then
  RAISE '2';
else
  select id into userid from users where discord_id = p_discord_id;
  insert into subscriptions (user_id, team_id) values (userid, p_team_id);

  select CONCAT(t.name, ' (', g.name, ')') into subbed_to_team from teams t join games g on t.game_id = g.id where t.id = p_team_id;
  return subbed_to_team;
end if;

end;
$$;
