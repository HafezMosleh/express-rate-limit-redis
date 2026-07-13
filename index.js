const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { createClient } = require('redis');

const app = express();
const redisClient = createClient({ url: 'redis://localhost:6379' });
redisClient.connect().catch(console.error);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) }),
});

app.use(limiter);
app.get('/', (req, res) => res.send('Hello World! Rate limited by Redis.'));
app.listen(3000, () => console.log('Server running on port 3000'));
