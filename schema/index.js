'use strict';

const fs   = require('fs'),
      path = require('path');

const Schema = require('./Schema');

const schemas = fs.readdirSync(path.resolve(__dirname, 'schemas'))
    .filter(file => /\.json$/.test(file))
    .reduce((acc, file) => {
        let schema = fs.readFileSync(
            path.resolve(__dirname, 'schemas', file),
            'utf8'
        );

        try{
            schema = JSON.parse(schema);
        }
        catch(e){
            console.log(file);
            throw e
        }

        schema = new Schema(schema);

        file = file.replace('.json', '');

        acc[`$${ file }`] = schema;

        return acc;
    }, {});

Object.defineProperty(schemas, 'find', {
    value: function find(o){
        const {
            interchangeSenderId,
            senderInterchangeIdQualifier,
            interchangeReceiverId,
            receiverInterchangeIdQualifier,
            transactionIdentifier
        } = o;

        for(const key in this){
            const meta = this[key].meta;

            if(
                   meta.interchangeSenderId            === interchangeSenderId
                && meta.senderInterchangeIdQualifier   === senderInterchangeIdQualifier
                && meta.interchangeReceiverId          === interchangeReceiverId
                && meta.receiverInterchangeIdQualifier === receiverInterchangeIdQualifier
                && meta.transactionIdentifier          === transactionIdentifier
            ) return this[key];
        }
    },
    configurable: false,
    writable:     false,
    enumerable:   false
});


module.exports = schemas;