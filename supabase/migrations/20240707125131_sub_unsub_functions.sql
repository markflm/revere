create or replace function unsub_user_from_team(p_discord_id bigint, p_team_id bigint)
   returns bit
   language plpgsql
  as
$$
declare
  del_count integer;
begin

WITH deleted AS (delete from subscriptions s using users u where s.user_id = u.id and u.discord_id = p_discord_id and s.team_id = p_team_id RETURNING *) SELECT into del_count count(*) FROM deleted;

if del_count = 1 then
  return 1;
else
  return 0;
end if;

end;
$$;


create or replace function sub_user_to_team(p_discord_id bigint, p_team_id bigint)
   returns bit
   language plpgsql
  as
$$
declare
-- need to come up with numbers for error states.
-- e.g. 0 = team doesn't exist, 1 = user doesn't exist, 2 = team exists but you're not subscribed
  is_real_team bit;
  already_subbed bit;
  userid bigint;
begin

--confirm this is a real team_id
select into is_real_team CASE WHEN EXISTS (SELECT 1 FROM teams WHERE id = p_team_id) THEN 1 ELSE 0 END;
if is_real_team <>  1 then
  RAISE '3';
end if;

select into already_subbed case when count(*) > 0 then 1 else 0 end from subscriptions s join users u on s.user_id = p.id where s.team_id = p_team_id and u.discord_id = p.discord_id;

if already_subbed = 1 then
  RAISE '2';
else
  select into userid from users where discord_id = p_discord_id;
  insert into subscriptions (user_id, team_id) values (userid, p_team_id);
  return 1;
end if;

end;
$$;