'use strict';

const createReverse = require('../lib/create-reverse-function');

function IEA(text, delimiter='*', terminator='~'){

    if(IEA.calls >= 1){
        throw new Error('IEA line max-use exceeded');
    }

    if(!/^iea\*/i.test(text)){
        throw new Error('Text is not an IEA line (Interchange Control Trailer)');
    }

    const parts = text.replace(terminator, '').split(delimiter);

    this.text = text;

    this.data = {};

    IEA.elements.forEach(el => {
        this.data[el.name] = parts[el.position] || null;
    });

    IEA.calls++;

    return this;
}

IEA.elements = [
    {
        position: 1,
        name: 'numberOfIncludedFunctionalGroups',
        description: 'Number of Included Functional Groups'
    },
    {
        position: 2,
        name: 'interchangeControlNumber',
        description: 'Interchange Control Number'
    }
];

IEA.calls = 0;

IEA.resetCalls = () => IEA.calls = 0;

IEA.from = createReverse(IEA, 'IEA');

module.exports = IEA;
