# revere



# run instructions
create or update .env file with values from discord vault
npm install
run npm start:dev to start nodemon process

# local supabase setup
you'll need Docker. I use Docker Desktop.

install "supabase" as a dev depedency 'npm install -D supabase'

make sure Docker is running, then run `npx supabase init` and `npx supabase start`

after supabase is running, migrations/seeding data can be run with `npx supabase db reset`
more info: https://supabase.com/docs/guides/cli/local-development


# deploying
for now:
run npm run build
zip
scp to vps