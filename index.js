const express = require('express');
const morgan = require('morgan');
const API = require('mongodb')
// Define queues
const fifoQueue = [];
const priorityQueue = [];
let roundRobinIndex = 0;

// Functions to manipulate queues (e.g., addToFifoQueue, getFromPriorityQueue)

const PORT_LOAD_BALANCER = process.env.PORT || 4004;
const PORT_REST_API = process.env.PORT_REST || 4001;
const PORT_GRAPHQL_API = process.env.PORT_GRAPHQL || 4002;
const PORT_GRPC_API = process.env.PORT_GRPC || 4003;

const app = express();
const PORT = process.env.PORT || 4000;

// Logging middleware
app.use(morgan('dev'));
// Logging metrics example
function logMetrics() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] FIFO Queue Length: ${fifoQueue.length}`);
    console.log(`[${timestamp}] Priority Queue Length: ${priorityQueue.length}`);
    console.log(`[${timestamp}] Round Robin Index: ${roundRobinIndex}`);
    // Add more detailed logging as needed
}

setInterval(logMetrics, 5000); // Log metrics every 5 seconds

// Route for REST API
app.get('/rest-api', (req, res) => {
    res.json({ message: 'REST API endpoint' });
});

// Route for GraphQL API
app.get('/graphql-api', (req, res) => {
    res.json({ message: 'GraphQL API endpoint' });
});

// Route for gRPC API
app.get('/grpc-api', (req, res) => {
    res.json({ message: 'gRPC API endpoint' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Slow response
app.get('/slow-api', (req, res) => {
    setTimeout(() => {
        res.json({ message: 'Slow API endpoint' });
    }, 2000); // 2 seconds delay
});

// Fast response
app.get('/fast-api', (req, res) => {
    res.json({ message: 'Fast API endpoint' });
});

// Error response
app.get('/error-api', (req, res) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

// Route for REST API
app.get('/rest-api', (req, res) => {
    res.json({ message: 'REST API endpoint' });
});

// Route for GraphQL API
app.get('/graphql-api', (req, res) => {
    res.json({ message: 'GraphQL API endpoint' });
});

// Route for gRPC API
app.get('/grpc-api', (req, res) => {
    res.json({ message: 'gRPC API endpoint' });
});

// Custom logging middleware
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const responseTime = Date.now() - start;
        const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`;
        console.log(logMessage);
        // You can log to file, database, or external services here
    });

    next();
});

// Start the servers
app.listen(PORT_LOAD_BALANCER, () => {
    console.log(`Load balancer is running on http://localhost:${PORT_LOAD_BALANCER}`);
});

app.listen(PORT_REST_API, () => {
    console.log(`REST API is running on http://localhost:${PORT_REST_API}`);
});

app.listen(PORT_GRAPHQL_API, () => {
    console.log(`GraphQL API is running on http://localhost:${PORT_GRAPHQL_API}`);
});

app.listen(PORT_GRPC_API, () => {
    console.log(`gRPC API is running on http://localhost:${PORT_GRPC_API}`);
});

// FIFO queue
function getFromFifoQueue() {
    return fifoQueue.shift();
}

// Priority queue (assuming requests have a priority field)
function getFromPriorityQueue() {
    return priorityQueue.shift();
}

// Round-robin queue
function getFromRoundRobinQueue() {
    const req = fifoQueue[roundRobinIndex];
    roundRobinIndex = (roundRobinIndex + 1) % fifoQueue.length;
    return req;
}
// Request handler example
function handleRequests() {
    const req = getFromPriorityQueue() || getFromFifoQueue() || getFromRoundRobinQueue();
    if (req) {
        // Process the request and forward to appropriate API
        switch (req.url) {
            case '/rest-api':
                // Forward to REST API server
                console.log(`Handling request for REST API: ${req}`);
                break;
            case '/graphql-api':
                // Forward to GraphQL API server
                console.log(`Handling request for GraphQL API: ${req}`);
                break;
            case '/grpc-api':
                // Forward to gRPC API server
                console.log(`Handling request for gRPC API: ${req}`);
                break;
            default:
                console.log(`Unknown request: ${req}`);
                break;
        }
    }
}

// Example: Run handleRequests every second
setInterval(handleRequests, 1000);
