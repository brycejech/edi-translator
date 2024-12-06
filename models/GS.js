'use strict';

const createReverse = require('../lib/create-reverse-function');

function GS(text, delimiter='*', terminator='~'){

    if(GS.calls >= 1){
        throw new Error('GS line max-use exceeded');
    }

    if(!/^gs\*/i.test(text)){
        throw new Error('Text is not a GS line (Functional Group Header)');
    }

    const parts = text.replace(terminator, '').split(delimiter);

    this.text = text;

    this.data = {};

    GS.elements.forEach(el => {
        this.data[el.name] = parts[el.position] || null;
    });

    GS.calls++;

    return this;
}

GS.elements = [
    {
        position: 1,
        name: 'functionalIdentifierCode',
        description: 'Functional Identifier Code'
    },
    {
        position: 2,
        name: 'applicationSendersCode',
        description: 'Application Sender\'s Code'
    },
    {
        position: 3,
        name: 'applicationReceiversCode',
        description: 'Application Receiver\'s Code'
    },
    {
        position: 4,
        name: 'date',
        description: 'Date'
    },
    {
        position: 5,
        name: 'time',
        description: 'Time'
    },
    {
        position: 6,
        name: 'groupControlNumber',
        description: 'Group Control Number'
    },
    {
        position: 7,
        name: 'responsibleAgencyCode',
        description: 'Responsible Agency Code'
    },
    {
        position: 8,
        name: 'versionReleaseIndustryIdentifierCode',
        description: 'Version / Release / Industry Identifier Code'
    }
];

GS.calls = 0;

GS.resetCalls = () => GS.calls = 0;

GS.from = createReverse(GS, 'GS');

module.exports = GS;
