'use strict';

const models = require('../models'),
     { ISA, GS, ST, SE, GE, IEA } = models;

const schemas   = require('../schema'),
      processFile = require('./process-file');

const reverseTree = require('./reverse-tree');

function X12EDI(text){

    models.resetModelCalls();

    this.text = text;

    this.isa = (new ISA(this.text)).data;

    this.delimiter  = this.isa.elementDelimiter;
    this.terminator = this.isa.segmentDelimiter;

    this.lines = this.text
        .split(this.terminator)
        .map(line => line.trim())
        .filter(line => line);

    this.gs  = (new GS(this.lines[1], this.delimiter, this.terminator)).data;
    this.ge  = (new GE( this.lines[this.lines.length - 2], this.delimiter, this.terminator)).data;
    this.iea = (new IEA(this.lines[this.lines.length - 1], this.delimiter, this.terminator)).data;

    this.transactions = [];
    this.transactionErrors = [];

    const transactions = groupTransactions(this.lines.slice(2, -2));

    for(const transaction of transactions){
        if(!validateTransaction(transaction, this.delimiter)){
            throw new Error('Invalid Transaction');
        }

        const st = (new ST(transaction[0])).data;

        ST.resetCalls();

        const schemaIdentifier = {
            senderInterchangeIdQualifier:   this.isa.senderIDQualifier,
            interchangeSenderId:            this.isa.interchangeSenderID,
            receiverInterchangeIdQualifier: this.isa.receiverIDQualifier,
            interchangeReceiverId:          this.isa.interchangeReceiverID,
            transactionIdentifier:          st.transactionSetIdentifierCode
        }

        const schema = schemas.find(schemaIdentifier);

        if(!schema){
            throw new Error('Schema not found');
        }

        const processed = processTransaction(schema, transaction, this.delimiter, this.terminator);

        this.transactions.push(processed.transaction);
        this.transactionErrors = [...this.transactionErrors, ...processed.errors];

        ST.resetCalls();
        SE.resetCalls();
    }

    this.data = {
        'interchangeControlHeader':  this.isa,
        'functionalGroupHeader':     this.gs,
        'transactions':              this.transactions,
        'functionalGroupTrailer':    this.ge,
        'interchangeControlTrailer': this.iea
    }

    return this;
}

X12EDI.from = function EDIFromTree(tree){
    const isa = ISA.from(tree['interchangeControlHeader']);

    const delimiter  = tree['interchangeControlHeader'].elementDelimiter,
          terminator = tree['interchangeControlHeader'].segmentDelimiter;

    const gs  =  GS.from(tree['functionalGroupHeader'], delimiter, terminator),
          ge  =  GE.from(tree['functionalGroupTrailer'], delimiter, terminator),
          iea = IEA.from(tree['interchangeControlTrailer'], delimiter, terminator);

    const transactions = tree['transactions'];

    const segments = [ isa, gs ]

    for(const transaction of transactions){

        const isaHeader = tree['interchangeControlHeader'];

        const schemaIdentifier = {
            senderInterchangeIdQualifier:   isaHeader.senderIDQualifier,
            interchangeSenderId:            isaHeader.interchangeSenderID,
            receiverInterchangeIdQualifier: isaHeader.receiverIDQualifier,
            interchangeReceiverId:          isaHeader.interchangeReceiverID,
            transactionIdentifier:          transaction['transactionSetIdentifierCode']
        }

        const schema = schemas.find(schemaIdentifier).schema;

        if(!schema){
            throw new Error('Schema not found');
        }

        const data = transaction.transaction;

        let reverse =  ST.from(transaction, delimiter, terminator);
            reverse += reverseTree(data, schema, delimiter, terminator);
            reverse += SE.from(transaction, delimiter, terminator);
        segments.push(reverse);
    }

    segments.push(ge);
    segments.push(iea);

    return segments.join('');
}

function processTransaction(schema, transaction, delimiter, terminator){
    const st = (new ST(transaction[0])).data,
          se = (new SE(transaction[transaction.length - 1])).data;

    // Strip the ST/SE segments
    const toProcess = transaction.slice(1, -1);

    const idSet = schema.getIdSet();

    const validSegments   = [],
          invalidSegments = [];

    toProcess.forEach((line, transactionIndex) => {
        const id = line.split(delimiter)[0];

        if(idSet.has(id)) return validSegments.push(line);

        invalidSegments.push({
            id,
            text: line,
            transactionIndex
        });
    });

    const processed = processFile(validSegments, 0, schema.schema, delimiter);

    return {
        transaction: {
            'transactionSetIdentifierCode': st['transactionSetIdentifierCode'],
            'transactionSetControlNumber':  st['transactionSetControlNumber'],
            'numberOfIncludedSegments':     Number(se['numberOfIncludedSegments']) - invalidSegments.length,
            'transaction': processed.data[0]
        },
        errors: invalidSegments,
        lastIndex: processed.lastIndex
    }
}

function groupTransactions(arr, delimiter='*'){
    const transactions = [],
          startExp = new RegExp(`^st\\${ delimiter }`, 'i');

    let cur = [];
    for(let i = 0, len = arr.length; i < len; i++){
        const el = arr[i];

        if(startExp.test(el)){
            if(cur.length){
                transactions.push(cur);
            }
            cur = [ el ];
        }
        else{ cur.push(el) }
    }
    transactions.push(cur);

    return transactions;
}

function validateTransaction(arr, elementDelimiter){

    const numSegmentsExp = new RegExp(`^se\\${ elementDelimiter }(\\d+?)\\${ elementDelimiter }`, 'i'),
          transactionEnd = arr.filter(seg => numSegmentsExp.test(seg))[0];

    const expectedSegments = Number(transactionEnd.match(numSegmentsExp)[1]);

    // Expressions to find ST and SE rows
    const startExp = new RegExp(`^st\\${ elementDelimiter }`, 'i'),
          endExp   = numSegmentsExp;

    let start = 0, end = 0;

    for(let i = 0, len = arr.length; i < len; i++){
        const item = arr[i];

        if(startExp.test(item)) start = i;
        if(endExp.test(item))   end   = i;
    }

    const transactionSegCount = end - start + 1;

    return expectedSegments === transactionSegCount;
}

module.exports = X12EDI;
