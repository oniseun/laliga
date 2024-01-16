# La Liga Football Club API

## Overview

The La Liga Football Club API provides information about teams, standings, and the latest news for La Liga football clubs. It utilizes two Rapid API subscriptions:

1. Livescore API: [Subscribe here](https://rapidapi.com/apidojo/api/livescore6) to get a list of teams and standings.
2. Football News Aggregator: [Subscribe here](https://rapidapi.com/arkasarkar2000/api/football-news-aggregator-live) to retrieve the latest La Liga news.

## Technical Details

The API is built using NestJS and incorporates the following technologies:

- **axios**: Used to fetch news and standings from Rapid API.
- **cron jobs**:
  - Runs every 2 hours to fetch news and saves it in the database.
  - Runs every 30 minutes between 9 AM and 5 PM to fetch standings and team lists.
- **mongodb**: Stores news, standings, and team names.
- **redis**: Caches news on demand.

## Installation

### Development Environment

1. Use `nvm use` to set the appropriate environment.
2. Run `npm run setup:dev` to set up environment variables.
3. Run `npm install`.
4. Run `npm run start:docker:db` to start the database in the Docker environment background.
5. Edit the `.env` file, replacing `RAPID_API_KEY` with your Rapid API key.
6. Run `npm run start:dev` to start the application.

- To view redis commander head to [http://localhost:8081](http://localhost:8081)
- To stop the database in Docker, run `npm run stop:docker:db`. 
- To view the database logs, run `npm run logs:docker:db`.

### Docker Environment (Recommended)

1. Run `export RAPID_API_KEY=your-rapid-api-key`.
2. Run `npm run start:docker:app` to start the application and all dependencies in Docker.

Head to the following:

- [API: http://localhost:3001](http://localhost:3001)
- [Swagger UI: http://localhost:3001/swagger](http://localhost:3001/swagger)

To stop the app, run `npm run stop:docker:app`.

## Testing

Run unit tests with `npm run test`.

## Live Deployment

The application is live on AWS. Access the following:

- [API (aws): https://48i6nvanmt.eu-west-2.awsapprunner.com](https://48i6nvanmt.eu-west-2.awsapprunner.com)
- [Swagger Docs (aws): https://48i6nvanmt.eu-west-2.awsapprunner.com/swagger ](https://48i6nvanmt.eu-west-2.awsapprunner.com/swagger)

## Postman

You can easily test through the Swagger UI. Alternatively, import the Postman configurations from the `/docs` folder, which contains the Postman collections and environments for both development and live (AWS).
