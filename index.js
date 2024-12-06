'use strict';

const express    = require('express'),
      bodyParser = require('body-parser');

const server = express();

// Case-sensitive URLs
server.set('case sensitive routing', true);
// If running behind Nginx proxy
server.enable('trust proxy');

// Accept form data
const jsonBody = bodyParser.json({ limit: '10mb' }),
      urlBody  = bodyParser.urlencoded({ extended: true });
server.use(jsonBody, urlBody);

// Remove "X-Powered-By" header
server.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
});

// Mount routes
const routes = require('./routes');

server.use(routes);

// Kick the tires and light the fires ;)
server.listen(8000, () => console.log('Express server listening on 8000'));