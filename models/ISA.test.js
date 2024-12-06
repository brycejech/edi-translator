'use strict';

const ISA = require('./ISA');

describe('ISA class should parse text', () => {

    let _isa;
    let text = 'ISA*00*          *00*          *ZZ*MGSEABOARD     *02*RASY           *190131*1226*U*00401*000032837*0*P*:~';

    beforeEach(() => _isa = new ISA(text));

    test('It should build parts', () => {
        expect(_isa.identifier).toBe('ISA');
        expect(_isa.elementDelimiter).toBe('*');
        expect(_isa.authorizationInformationQualifier).toBe('00');
        expect(_isa.authorizationInformation).toBe('');
        expect(_isa.securityInformationQualifier).toBe('00');
        expect(_isa.securityInformation).toBe('');
        expect(_isa.senderIDQualifier).toBe('ZZ');
        expect(_isa.interchangeSenderID).toBe('MGSEABOARD');
        expect(_isa.receiverIDQualifier).toBe('02');
        expect(_isa.interchangeReceiverID).toBe('RASY');
        expect(_isa.interchangeDate).toBe('190131');
        expect(_isa.interchangeTime).toBe('1226');
        expect(_isa.interchangeControlStandardsIdentifier).toBe('U');
        expect(_isa.interchangeControlVersionNumber).toBe('00401');
        expect(_isa.interchangeControlNumber).toBe('000032837');
        expect(_isa.acknowledgementRequested).toBe('0');
        expect(_isa.testIndicator).toBe('P');
        expect(_isa.componentElementSeparator).toBe(':');
        expect(_isa.segmentDelimiter).toBe('~');
        expect(typeof _isa.data).toBe('object');
        expect(_isa.data.segmentDelimiter).toBe('~');
    });

});

describe('ISA class should throw on invalid input', () => {

    let _isa;
    let texts = [
        'IS*00*          *00*          *ZZ*MGSEABOARD     *02*RASY           *190131*1226*U*00401*000032837*0*P*:~',
        'ISX*00*          *00*          *ZZ*MGSEABOARD     *02*RASY           *190131*1226*U*00401*000032837*0*P*:~',
        'IX*00*          *00*          *ZZ*MGSEABOARD     *02*RASY           *190131*1226*U*00401*000032837*0*P*:~',
    ];

    beforeEach(() => ISA.resetCalls());

    texts.forEach(text => {
        test(`This should throw "${ text.slice(0, 10) }"`, () => {
            expect(() => new ISA(text)).toThrow();
        });
    });

});


describe('ISA constructor should handle multiple calls', () => {

    let text = 'ISA*00*          *00*          *ZZ*MGSEABOARD     *02*RASY           *190131*1226*U*00401*000032837*0*P*:~';

    test('It should have 0 calls after reset', () => {
        ISA.resetCalls();

        expect(ISA.calls).toBe(0);
    });

    test('It should have 1 call', () => {
        let _isa = new ISA(text);


        expect(ISA.calls).toBe(1);
    });

    test('It should throw when called more than once', () => {
        expect(() => new ISA(text)).toThrow();
    });

});

describe('ISA class should run in reverse', () => {

    test('ISA.from should build a string', () => {
        const obj = {
          'identifier': 'ISA',
          'elementDelimiter': '*',
          'authorizationInformationQualifier': '00',
          'authorizationInformation': '',
          'securityInformationQualifier': '00',
          'securityInformation': '',
          'senderIDQualifier': 'ZZ',
          'interchangeSenderID': 'MGSEABOARD',
          'receiverIDQualifier': '02',
          'interchangeReceiverID': 'RASY',
          'interchangeDate': '190131',
          'interchangeTime': '1226',
          'interchangeControlStandardsIdentifier': 'U',
          'interchangeControlVersionNumber': '00401',
          'interchangeControlNumber': '000032836',
          'acknowledgementRequested': '0',
          'testIndicator': 'P',
          'componentElementSeparator': ':',
          'segmentDelimiter': '~'
        }

        const text = ISA.from(obj);

        expect(text).toBe('ISA*00*          *00*          *ZZ*MGSEABOARD     *02*RASY           *190131*1226*U*00401*000032836*0*P*:~');
    });

});
