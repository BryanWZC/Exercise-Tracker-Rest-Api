# Exercise Tracker REST API

### Description

An exercise tracker that allows you to create a new user, submit exercise entries and collect data.

### Usage:

[![Run on Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-exercisetracker)](https://boilerplate-project-exercisetracker.bryanw1.repl.co/)

- Click on the link above. 
- **Create a new user:** Enter a `username` in the 'New User' section. Take note of the `_id` given in the JSON.
- **Add exercises:** Enter the same `_id` value obtained from creating a new user. Enter the mandatory fields for `description` and `duration`. `date` can be left empty which defaults to current date.
- **Get all user records:** Access [/api/exercise/users](https://boilerplate-project-exercisetracker.bryanw1.repl.co/api/exercise/users) to get all user records.
- **Get user's exercise log:** `GET /api/exercise/log?{userId}[&from][&to][&limit]`.

### Setup

1. `npm install` to install all the packages.
2. Create `.env` file and assign your Mongodb url to `MLAB_URI`.
3. `npm start` to start server and move onto `localhost:3000`.