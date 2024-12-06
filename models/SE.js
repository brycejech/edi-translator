'use strict';

const createReverse = require('../lib/create-reverse-function');

function SE(text, delimiter='*', terminator='~'){

    if(SE.calls >= 1){
        throw new Error('SE line max-use exceeded');
    }

    if(!/^se\*/i.test(text)){
        throw new Error('Text is not an SE line (Transation)');
    }

    const parts = text.replace(terminator, '').split(delimiter);

    this.text = text;

    this.data = {};

    SE.elements.forEach(el => {
        this.data[el.name] = parts[el.position] || null;
    });

    SE.calls++;

    return this;
}

SE.elements = [
    {
        position: 1,
        name: 'numberOfIncludedSegments',
        description: 'Number of Included Segments'
    },
    {
        position: 2,
        name: 'transactionSetControlNumber',
        description: 'Transation Set Control Number'
    }
];

SE.calls = 0;

SE.resetCalls = () => SE.calls = 0;

SE.from = function from(obj, delimiter='*', terminator='~'){
    const numSegs = obj['numberOfIncludedSegments'],
          ctrlNum = obj['transactionSetControlNumber'];

    return `SE${ delimiter }${ numSegs }${ delimiter }${ ctrlNum }${ terminator }`;
}

module.exports = SE;
