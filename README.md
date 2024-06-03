# Absinthe API

## Overview

Absinthe API is a RESTful API built with the NestJS framework, designed to provide a robust and scalable backend solution for managing users, points, keys, and campaigns. This project includes Docker support for easier deployment and setup.

## Features

- User management
- Points management
- Key management
- Campaign management
- API documentation with Swagger
- Environment configuration with dotenv
- PostgreSQL database integration with TypeORM

## Prerequisites

- Node.js
- Docker
- PostgreSQL

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/absinthe-api.git
cd absinthe-api
```

2. Start the Docker containers:

```bash
docker-compose up --build
```

## Available Scripts

- `build`: Builds the NestJS application.
- `start`: Starts the application.
- `start:dev`: Starts the application in development mode with hot-reload.
- `start:debug`: Starts the application in debug mode.
- `start:prod`: Starts the application in production mode.
- `format`: Formats the code using Prettier.
- `lint`: Lints the code and fixes issues automatically.
- `test`: Runs all tests.
- `test:watch`: Runs all tests in watch mode.
- `test:cov`: Runs all tests and generates a coverage report.

## API Documentation

The API documentation is available via Swagger. When running the application in development mode, access the documentation at:

```
http://localhost:{PORT}/docs
```

## Environment Variables

The application relies on several environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```plaintext
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=absinthe
```
## Controllers and Services

The application is structured with several controllers and services to manage different resources.

### User Management

- **Controller**: `UserController`
- **Service**: `UserService`

### Points Management

- **Controller**: `PointsController`
- **Service**: `PointsService`

### Key Management

- **Controller**: `KeyController`
- **Service**: `KeyService`

### Campaign Management

- **Controller**: `CampaignController`
- **Service**: `CampaignService`

## Running Tests

To run tests, use the following command:

```bash
yarn test
```

For watching tests:

```bash
yarn test:watch
```

For generating a coverage report:

```bash
yarn test:cov
```

## Author

[Samuel VIDEAU](https://github.com/samuel-videau)