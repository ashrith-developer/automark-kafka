# AutoMark

AutoMark is an AI-powered marketing content generation platform built with a React/Vite frontend, an Express API, MongoDB, and Kafka-based event processing.

The app lets users register, log in, generate marketing content, and view generated-content history. Kafka is used for asynchronous workflows such as analytics updates and user registration notifications.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, JWT authentication
- AI providers: Groq and Google Gemini
- Messaging: Apache Kafka with KafkaJS
- Local infrastructure: Docker Compose for Kafka

## Project Structure

```txt
.
|-- client/              # React/Vite frontend
|-- server/              # Express API, MongoDB models, Kafka producers/consumers
|-- docker-compose.yml   # Local Kafka broker
|-- package.json         # Root scripts for running client and server together
`-- .gitignore
```

## Prerequisites

- Node.js 18+
- npm
- Docker Desktop
- MongoDB connection string
- Groq API key
- Gemini API key

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

The frontend currently calls the API at:

```txt
http://localhost:5000/api
```

That value is defined in `client/src/services/api.js`.

## Installation

Install dependencies in each package:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Running Locally

Start Kafka:

```bash
docker-compose up
```

Start the API and frontend:

```bash
npm run dev
```

By default:

- API runs on `http://localhost:5000`
- Frontend runs on the Vite dev server, usually `http://localhost:5173`
- Kafka runs on `localhost:9092`

## Kafka Consumers

In separate terminals, run the consumers when you want background event processing:

```bash
npm run consumer --prefix server
npm run user-consumer --prefix server
```

Kafka topics used by the app:

- `content.generated`
- `content.generated.dlq`
- `user.registered`
- `user.registered.dlq`

## API Overview

Auth routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/change-password`
- `POST /api/auth/logout`

Content routes:

- `POST /api/content/generate`
- `GET /api/content/history`
- `GET /api/content/:id`
- `DELETE /api/content/:id`

Protected routes require a valid JWT token.

## Useful Scripts

Root:

```bash
npm run dev
npm run server
npm run client
```

Server:

```bash
npm run dev --prefix server
npm run start --prefix server
npm run consumer --prefix server
npm run user-consumer --prefix server
npm run verify-db --prefix server
npm run clear-analytics --prefix server
```

Client:

```bash
npm run dev --prefix client
npm run build --prefix client
npm run lint --prefix client
npm run preview --prefix client
```

## Production Readiness Checklist

Before deploying this as a real-world project, add or verify:

- Production `.env` values managed through a secrets manager or hosting provider
- Hosted MongoDB, such as MongoDB Atlas
- Hosted Kafka, such as Confluent Cloud, Redpanda, or another managed Kafka provider
- Configurable API base URL for the frontend using `VITE_API_URL`
- Configurable Kafka broker URL instead of hardcoded `localhost:9092`
- CI/CD workflow for linting, building, and deployment
- Request validation, rate limiting, and stricter CORS configuration
- Centralized logs and error monitoring
- Database backup policy
- Health check endpoint for the API
- Tests for auth, content generation, and Kafka event handling

## Deployment Notes

Cloudflare is optional. It can be used for DNS, SSL, CDN, caching, WAF, and DDoS protection, but the project can also be deployed without it.

A practical deployment setup could be:

- Frontend: Vercel, Netlify, or Cloudflare Pages
- Backend: Render, Railway, Fly.io, AWS, or DigitalOcean
- Database: MongoDB Atlas
- Kafka: Confluent Cloud, Redpanda, or another managed Kafka service
- DNS: Cloudflare, Route 53, Namecheap, or the domain provider's DNS

## Notes

Do not commit `.env`, `node_modules`, build output, logs, generated temp files, or local machine/editor files.
