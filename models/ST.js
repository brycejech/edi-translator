'use strict';

const createReverse = require('../lib/create-reverse-function');

function ST(text, delimiter='*', terminator='~'){

    if(ST.calls >= 1){
        throw new Error('ST line max-use exceeded');
    }

    if(!/^st\*/i.test(text)){
        throw new Error('Text is not an ST line (Transation Set Header)');
    }

    const parts = text.replace(terminator, '').split(delimiter);

    this.text = text;

    this.data = {};

    ST.elements.forEach(el => {
        this.data[el.name] = parts[el.position] || null;
    });

    ST.calls++;

    return this;
}

ST.elements = [
    {
        position: 1,
        name: 'transactionSetIdentifierCode',
        description: 'Transaction Set Identifier Code'
    },
    {
        position: 2,
        name: 'transactionSetControlNumber',
        description: 'Transaction Set Control Number'
    }
];

ST.calls = 0;

ST.resetCalls = () => ST.calls = 0;

ST.from = function from(obj, delimiter='*', terminator='~'){
    const idCode  = obj['transactionSetIdentifierCode'],
          ctrlNum = obj['transactionSetControlNumber'];

    return `ST${ delimiter }${ idCode }${ delimiter }${ ctrlNum }${ terminator }`;
}

module.exports = ST;
