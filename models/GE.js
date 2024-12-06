'use strict';

const createReverse = require('../lib/create-reverse-function');

function GE(text, delimiter='*', terminator='~'){

    if(GE.calls >= 1){
        throw new Error('GE line max-use exceeded');
    }

    if(!/^ge\*/i.test(text)){
        throw new Error('Text is not a GE line (Functional Group Trailer)');
    }

    const parts = text.replace(terminator, '').split(delimiter);

    this.text = text;

    this.data = {};

    GE.elements.forEach(el => {
        this.data[el.name] = parts[el.position] || null;
    });

    GE.calls++;

    return this;
}

GE.elements = [
    {
        position: 1,
        name: 'numberOfTransactionSetsIncluded',
        description: 'Number of Transaction Sets Included'
    },
    {
        position: 2,
        name: 'groupControlNumber',
        description: 'Group Control Number'
    }
]

GE.calls = 0;

GE.resetCalls = () => GE.calls = 0;

GE.from = createReverse(GE, 'GE');

module.exports = GE;
