# Kafka Learning Notes

## Project State

Project used for practice:

```text
C:\Users\woonn\OneDrive\Desktop\fullstack\PROkafka\auto-main
```

The app is an AutoMark marketing content generator with:

- React frontend
- Express backend
- MongoDB
- Groq content generation
- Kafka running locally with Docker

## Things Done

### 1. Cleaned The Project Flow

The project previously had broken worker/BullMQ-related leftovers.

We confirmed the clean content generation flow:

```text
Frontend request
    -> Express controller
    -> Groq API generates content
    -> MongoDB saves content
    -> response returned to frontend
```

This gave us a clean base before adding Kafka.

### 2. Started Kafka Locally

Docker and Docker Compose were checked:

```powershell
docker --version
docker compose version
```

A `docker-compose.yml` file was created to run Kafka locally.

Kafka container:

```text
automark-kafka
```

Kafka broker:

```text
localhost:9092
```

Kafka was started with:

```powershell
docker compose up -d
```

### 3. Created First Kafka Topic

Created topic:

```text
content.generated
```

Meaning:

```text
A piece of content was generated in the app.
```

### 4. Tested Kafka Manually

Used Kafka console producer and consumer to test:

```text
producer -> topic -> consumer
```

This proved Kafka was working before connecting the app.

### 5. Added Kafka Producer To Express Backend

Installed KafkaJS:

```powershell
npm install kafkajs --prefix server
```

Created:

```text
server/kafka/producer.js
```

The backend now connects to Kafka when the server starts.

### 6. Published `ContentGenerated` Event

After content is generated and saved in MongoDB, the backend publishes an event:

```json
{
  "event": "ContentGenerated",
  "contentId": "...",
  "userId": "...",
  "platforms": ["..."],
  "tone": "...",
  "createdAt": "..."
}
```

Flow:

```text
Generate content
    -> save to MongoDB
    -> publish ContentGenerated to Kafka
```

### 7. Created Node Kafka Consumer

Created:

```text
server/kafka/consumer.js
```

Added script:

```json
"consumer": "node kafka/consumer.js"
```

Run with:

```powershell
npm run consumer --prefix server
```

The consumer reads content generation events and logs analytics behavior.

### 8. Learned Consumer Groups

Same group ID:

```text
Consumers share work.
```

Different group IDs:

```text
Each group receives its own copy of the event.
```

Examples:

```powershell
npm run consumer --prefix server -- group-a
npm run consumer --prefix server -- group-b
```

### 9. Learned Partitions

We saw why only one terminal received output:

```text
1 topic partition + 2 consumers in same group = only 1 active consumer
```

Kafka rule:

```text
One partition can be assigned to only one consumer in the same group.
```

### 10. Added Event Handling

The consumer now reacts to events:

```text
ContentGenerated -> Analytics updated for content ...
```

This changed the consumer from just logging to doing business-style work.

### 11. Practiced Failure Behavior

Simulated consumer failure using a test tone:

```text
fail-test
```

Learned:

```text
If processing fails, messages may be retried depending on offset commits.
```

### 12. Added Event IDs

Added `eventId` to events so consumers can identify duplicates.

Example:

```json
{
  "eventId": "...",
  "event": "ContentGenerated"
}
```

### 13. Added Idempotency

First used an in-memory `Set`, then upgraded to MongoDB.

Created model:

```text
server/models/ProcessedEvent.js
```

Purpose:

```text
Remember which events were already processed.
```

Now duplicate events can be skipped even after consumer restart.

### 14. Added Dead Letter Topic

Created topic:

```text
content.generated.dlq
```

DLQ means:

```text
Dead Letter Queue
```

Failed events are sent there for debugging instead of crashing the consumer forever.

### 15. Learned Lag And Offsets

Checked consumer group lag with:

```powershell
docker exec automark-kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group analytics-service
```

Important terms:

```text
CURRENT-OFFSET = how far the group has read
LOG-END-OFFSET = latest message position
LAG = unread messages for that group
```

### 16. Added Second Event Flow: UserRegistered

Created topic:

```text
user.registered
```

Added producer function:

```text
publishUserRegistered
```

Published event from register controller after user creation.

Event shape:

```json
{
  "eventId": "...",
  "event": "UserRegistered",
  "userId": "...",
  "email": "...",
  "createdAt": "..."
}
```

### 17. Created Welcome Email Consumer

Created:

```text
server/kafka/userConsumer.js
```

Added script:

```json
"user-consumer": "node kafka/userConsumer.js"
```

Run with:

```powershell
npm run user-consumer --prefix server
```

Result after registering a user:

```text
Welcome email sent to nashrith@gmail.com
```

## Current Architecture

```text
React frontend
    -> Express API
    -> MongoDB
    -> Kafka producer
    -> Kafka topics
    -> Node consumers
```

Content flow:

```text
Generate content
    -> ContentGenerated event
    -> content.generated topic
    -> analytics-service consumer
    -> ProcessedEvent duplicate check
    -> optional DLQ on failure
```

User flow:

```text
Register user
    -> UserRegistered event
    -> user.registered topic
    -> welcome-email-service consumer
    -> logs welcome email behavior
```

## Concepts Learned

- Kafka broker
- Topic
- Producer
- Consumer
- Consumer group
- Partition
- Offset
- Lag
- Event ID
- Idempotency
- Duplicate detection
- Dead-letter topic
- Event-driven architecture

## Commands To Start Next Time

Start Kafka:

```powershell
docker compose up -d
```

Start app:

```powershell
npm run dev
```

Start analytics consumer:

```powershell
npm run consumer --prefix server -- analytics-service
```

Start welcome email consumer:

```powershell
npm run user-consumer --prefix server
```

Check Kafka topics:

```powershell
docker exec -it automark-kafka /opt/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

Check consumer lag:

```powershell
docker exec automark-kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group analytics-service
```

## Things To Do Next

### 1. Create A Real Notification Record

Instead of only logging:

```text
Welcome email sent to ...
```

Create a MongoDB notification record.

Possible model:

```text
Notification
- userId
- type
- email
- status
- createdAt
```

Flow:

```text
UserRegistered
    -> welcome-email-service
    -> create Notification record
```

### 2. Create A Real Analytics Record

Instead of only logging:

```text
Analytics updated for content ...
```

Create or update an analytics document in MongoDB.

Possible fields:

```text
userId
contentGeneratedCount
lastGeneratedAt
platformCounts
```

### 3. Add DLQ For UserRegistered Consumer

Currently DLQ was practiced mainly for content events.

Add a DLQ topic for user registration failures:

```text
user.registered.dlq
```

### 4. Improve Event Structure

Use a consistent event envelope:

```json
{
  "eventId": "...",
  "eventType": "UserRegistered",
  "version": 1,
  "occurredAt": "...",
  "payload": {}
}
```

This makes future event changes easier.

### 5. Move Topic Names To Config

Instead of hardcoding topic names in multiple files, create constants:

```text
server/kafka/topics.js
```

Example:

```js
export const TOPICS = {
  CONTENT_GENERATED: 'content.generated',
  USER_REGISTERED: 'user.registered',
};
```

### 6. Add Graceful Shutdown

Disconnect Kafka producers/consumers cleanly when stopping the app.

Learn:

```text
producer.disconnect()
consumer.disconnect()
```

### 7. Add More Events

Possible next topics:

```text
content.scheduled
content.published
user.login
notification.created
```

### 8. Practice Replay

Use `fromBeginning: true` with a new group ID to replay old events.

Example:

```powershell
npm run consumer --prefix server -- replay-test-group
```

This teaches how Kafka can rebuild projections or analytics from past events.

## Important Mental Model

Kafka is not just a queue.

A queue usually means:

```text
Do this job once.
```

Kafka usually means:

```text
This thing happened. Store it so many consumers can react.
```

Your project now uses Kafka as an event backbone:

```text
Main app publishes facts.
Consumers react independently.
```
