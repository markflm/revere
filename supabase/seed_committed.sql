--rename to "seed.sql", replace comments with actual discord IDs.
insert into users (discord_id, name) values (/*id from env*/,'Mark''s Account'), (/*id from env*/, 'Keith''s Account');
insert into games (name) values ('Valorant');
insert into teams (name, game_id, intragame_team_id) values ('Team Liquid', 1, 474), ('Karmine Corp', 1, 8877), ('MOUZ', 1, 8044);
insert into subscriptions (team_id, user_id) values (1, 1), (2, 2);