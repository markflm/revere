insert into users (discord_id, name) values (/* from env */,'Mark''s Account'), (/* from env */, 'Keith''s Account');
insert into games (name) values ('Valorant');
insert into teams (name, game_id, intragame_team_id) values ('Team Liquid', 1, 474), ('Karmine Corp', 1, 8877), ('G2 Esports', 1, 11058);
insert into subscriptions (team_id, user_id) values (1, 1), (2, 2), (1, 3);