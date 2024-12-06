'use strict';

const GE = require('./GE');

describe('GE class should parse text', () => {

    let _ge;
    let text = 'GE*1*8558~';

    beforeEach(() => _ge = new GE(text, '*', '~'));

    test('It should build parts', () => {
        expect(typeof _ge.data).toBe('object');

        expect(_ge.data['numberOfTransactionSetsIncluded']).toBe('1');
        expect(_ge.data['groupControlNumber']).toBe('8558');
    });

});

describe('GE class should throw on invalid input', () => {

    let _get;
    let texts = [
        'G*1*8558~',
        'GEX*1*8558~',
        'GX*1*8558~'
    ];

    beforeEach(() => GE.resetCalls());

    texts.forEach(text => {
        test(`This should throw "${ text }"`, () => {
            expect(() => new GE(text, '*', '~')).toThrow();
        });
    });

});

describe('GE constructor should handle multiple calls', () => {

    let text = 'GE*1*8558~';

    test('It should have 0 calls after reset', () => {
        GE.resetCalls();

        expect(GE.calls).toBe(0);
    });

    test('It should have 1 call', () => {
        let _ge = new GE(text, '*', '~');

        expect(GE.calls).toBe(1);
    });

    test('It should throw when called more than once', () => {
        expect(() => new GE(text, '*', '~')).toThrow();
    });

});

describe('GE class should run in reverse', () => {

    test('GE.from should build a string', () => {
        let obj = {
          'numberOfTransactionSetsIncluded': '1',
          'groupControlNumber': '8557'
        }

        let text = GE.from(obj, '*', '~');

        expect(text).toBe('GE*1*8557~');
    });

})
