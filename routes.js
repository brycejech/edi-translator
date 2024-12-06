'use strict';

const router = require('express').Router();

const EDI         = require('./EDI/EDI'),
      reverseTree = require('./EDI/reverse-tree');

router.get('/', (req, res, next) => {
    res.json({ message: 'LTC EDI Translation Service' });
});

router.get('/healthcheck', (req, res, next) => {
    return res.json({ message: 'OK' });
});

router.post('/edi', (req, res, next) => {
    const file = req.body.file;

    const tree = (new EDI(file)).data;

    res.json({ parsed: tree });
});

router.post('/tree', (req, res, next) => {
    const tree = req.body.tree;

    const ediText = EDI.from(tree);

    res.json({ file: ediText });
});

module.exports = router;