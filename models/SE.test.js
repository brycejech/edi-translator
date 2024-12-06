'use strict';

const SE = require('./SE');

describe('SE class should parse text', () => {

    let _se;
    let text = 'SE*285*085570001~';

    beforeEach(() => _se = new SE(text));

    test('It should build parts', () => {
        expect(typeof _se.data).toBe('object');

        expect(_se.data['numberOfIncludedSegments']).toBe('285');
        expect(_se.data['transactionSetControlNumber']).toBe('085570001');
    });

});

describe('SE class should throw on invalid input', () => {

    let _se;
    let texts = [
        'S*285*085570001~',
        'SEX*285*085570001~',
        'SX*285*085570001~'
    ];

    texts.forEach(text => {
        test(`This should throw "${ text }"`, () => {
            expect(() => new SE(text)).toThrow();
        });
    });

});

describe('SE constructor should handle multiple calls', () => {

    let text = 'SE*285*085570001~';

    test('It should have 0 calls after reset', () => {
        SE.resetCalls();

        expect(SE.calls).toBe(0);
    });

    test('It should have 1 call', () => {
        let _se = new SE(text);

        expect(SE.calls).toBe(1);
    });

    test('It should throw when called more than once', () => {
        expect(() => new SE(text)).toThrow();
    });

});

describe('SE class should run in reverse', () => {

    test('SE.from should build a string', () => {
        const obj = {
          'numberOfIncludedSegments': '285',
          'transactionSetControlNumber': '085570001'
        }

        const text = SE.from(obj, '*', '~');

        expect(text).toBe('SE*285*085570001~');
    });

});
