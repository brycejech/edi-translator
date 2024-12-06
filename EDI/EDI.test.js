'use strict';

const fs   = require('fs'),
      path = require('path');

const models = require('../models');

const EDI = require('./EDI'),
      reverseTree = require('./reverse-tree');

const fileTypes = {
    '204': [
        '204.edi', '204_2.edi', '204_3.edi',
        '204_kraft.edi', '204_kraft2.edi', '204_kraft3.edi',
        '204_kraft4.edi'
    ],
    '990': [
        '990.edi', '990_2.edi', '990-test.edi',
        '990_kraft.edi'
    ],
    '214': [
        '214.edi', '214_2.edi',
        '214_kraft_pickup.edi'
    ],
    '210': [
        '210.edi', '210_2.edi', '210_3.edi',
        '210-RASY-030116040968.edi', '210-RASY-030416042980.edi',
        '210-RASY-030516031676.edi',
        // AWG
        '210-RASY-AWG.edi',
        '210-Acord-CFI.edi'
    ]
}

for(const type in fileTypes){
    describe(`EDI class should handle type "${ type }"`, () => {

        const files = fileTypes[type];

        files.forEach(file => {
            const filePath = path.resolve(__dirname, `../unit-test-files/${ file }`),
                  control  = fs.readFileSync(filePath, 'utf8'),
                  treePath = path.resolve(__dirname, `../unit-test-files/${ file.replace('edi', 'json') }`),
                  tree     = fs.readFileSync(treePath, 'utf8'),
                  json     = JSON.parse(tree);

            let edi;

            beforeEach(() => {
                models.resetModelCalls();

                edi = new EDI(control);
            });

            test(`Control text for file "${ file }" should be a string`, () => {
                expect(typeof control).toBe('string');
            });

            test(`EDI class should build an object for file "${ file }"`, () => {
                expect(typeof edi.data).toBe('object');
            });

            test(`EDI header should be valid for file "${ file }"`, () => {
                const data = edi.data,
                      head = data['interchangeControlHeader'];

                expect(typeof head).toBe('object');
                expect(head.hasOwnProperty('identifier')).toBe(true);
                expect(head.hasOwnProperty('elementDelimiter')).toBe(true);
                expect(head.hasOwnProperty('authorizationInformationQualifier')).toBe(true);
                expect(head.hasOwnProperty('authorizationInformation')).toBe(true);
                expect(head.hasOwnProperty('securityInformationQualifier')).toBe(true);
                expect(head.hasOwnProperty('securityInformation')).toBe(true);
                expect(head.hasOwnProperty('senderIDQualifier')).toBe(true);
                expect(head.hasOwnProperty('interchangeSenderID')).toBe(true);
                expect(head.hasOwnProperty('receiverIDQualifier')).toBe(true);
                expect(head.hasOwnProperty('interchangeReceiverID')).toBe(true);
                expect(head.hasOwnProperty('interchangeDate')).toBe(true);
                expect(head.hasOwnProperty('interchangeTime')).toBe(true);
                expect(head.hasOwnProperty('interchangeControlStandardsIdentifier')).toBe(true);
                expect(head.hasOwnProperty('interchangeControlVersionNumber')).toBe(true);
                expect(head.hasOwnProperty('interchangeControlNumber')).toBe(true);
                expect(head.hasOwnProperty('acknowledgementRequested')).toBe(true);
                expect(head.hasOwnProperty('testIndicator')).toBe(true);
                expect(head.hasOwnProperty('componentElementSeparator')).toBe(true);
                expect(head.hasOwnProperty('segmentDelimiter')).toBe(true);
            });

            test(`EDI.from json should yield control text for file "${ file }"`, () => {
                const reversed = EDI.from(json);

                expect(reversed).toBe(control);
            });
        });
    });

}

describe('EDI class should remove invalid segments', () => {
    const text = fs.readFileSync(
        path.resolve(__dirname, '..', 'unit-test-files', '204-extra.edi'),
        'utf8'
    );

    test('Text should indicate 289 segments before parsing', () => {
        const se = text.split('~').filter(line => /^SE\*/.test(line))[0];

        const expectedSegments = Number(se.split('*')[1]);

        expect(expectedSegments).toBe(289);
    });

    const edi = new EDI(text);

    test('It should parse the file', () => {
        expect(typeof edi.data).toBe('object');
    });

    test('It should remove the 4 invalid segments and adjust count', () => {
        expect(edi.data.transactions[0].numberOfIncludedSegments).toBe(285);
    });

    test('EDI instance should report 4 errors', () => {
        expect(edi.transactionErrors.length).toBe(4);
    });

});

