'use strict';

const padRight = require('../lib/pad-right');

/*

    Data elements of the ISA header in an X12 EDI file (4010) are positional.

    This allows us to deduce the element delimiters and segment terminators for
    the rest of the file, as well as meta information about the sender/receiver,
    transaction date, etc...
*/

const elements = [
    {
        name: 'identifier',
        start: 0,
        end: 3
    },
    {
        name: 'elementDelimiter',
        start: 3,
        end: 4
    },
    {
        name: 'authorizationInformationQualifier',
        start: 4,
        end: 6
    },
    {
        name: 'authorizationInformation',
        start: 7,
        end: 17
    },
    {
        name: 'securityInformationQualifier',
        start: 18,
        end: 20
    },
    {
        name: 'securityInformation',
        start: 21,
        end: 31
    },
    {
        name: 'senderIDQualifier',
        start: 32,
        end: 34
    },
    {
        name: 'interchangeSenderID',
        start: 35,
        end: 50
    },
    {
        name: 'receiverIDQualifier',
        start: 51,
        end: 53
    },
    {
        name: 'interchangeReceiverID',
        start: 54,
        end: 69
    },
    {
        name: 'interchangeDate',
        start: 70,
        end: 76
    },
    {
        name: 'interchangeTime',
        start: 77,
        end: 81
    },
    {
        name: 'interchangeControlStandardsIdentifier',
        start: 82,
        end: 83
    },
    {
        name: 'interchangeControlVersionNumber',
        start: 84,
        end: 89
    },
    {
        name: 'interchangeControlNumber',
        start: 90,
        end: 99
    },
    {
        name: 'acknowledgementRequested',
        start: 100,
        end: 101
    },
    {
        name: 'testIndicator',
        start: 102,
        end: 103
    },
    {
        name: 'componentElementSeparator',
        start: 104,
        end: 105
    },
    {
        name: 'segmentDelimiter',
        start: 105,
        end: 106
    }
];

function ISA(text){

    if(ISA.calls >= 1){
        throw new Error('ISA line max-use exceeded');
    }

    if(!/^isa/i.test(text)){
        throw new Error('Text must begin with ISA');
    }

    this.data = {};

    for(let i = 0, len = elements.length; i < len; i++){
        const el = elements[i];

        this[el.name] = this.data[el.name] = text.slice(el.start, el.end).trim();
    }

    ISA.calls++;

    return this;
}

ISA.calls = 0;

ISA.resetCalls = () => ISA.calls = 0;

ISA.from = function ISAFromObj(obj){

    if(!(obj.elementDelimiter && obj.segmentDelimiter)){
        throw new Error('ISA object must include element and segment delimiter members');
    }
    const delimiter  = obj.elementDelimiter,
          terminator = obj.segmentDelimiter

    let isa = '';

    elements.forEach(el => {
        const len = el.end - el.start;

        const exclusions = [
            'identifier', 'elementDelimiter', 'componentElementSeparator', 'segmentDelimiter'
        ];

        if(~exclusions.indexOf(el.name)){
            return isa += obj[el.name];
        }
        else{
            isa += padRight(obj[el.name], len, ' ') + delimiter;
        }
    });

    return isa;
}

module.exports = ISA;
