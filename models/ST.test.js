'use strict';

const ST = require('./ST');

describe('ST class should parse text', () => {

    let _st;
    let text = 'ST*204*085580001~';

    beforeEach(() => _st = new ST(text));

    test('It should build parts', () => {
        expect(typeof _st.data).toBe('object');

        expect(_st.data['transactionSetIdentifierCode']).toBe('204');
        expect(_st.data['transactionSetControlNumber']).toBe('085580001');
    });

});

describe('ST class should throw on invalid input', () => {

    let _st;
    let texts = [
        'STS*204*085580001~',
        'S*204*085580001~',
        'ST5*204*085580001~'
    ];

    // Reset # calls tracker so proper error is thrown
    beforeEach(() => ST.resetCalls());

    texts.forEach(text => {
        test(`This should throw "${ text }"`, () => {
            expect(() => new ST(text)).toThrow();
        });
    });

});

describe('ST constructor should handle multiple calls', () => {

    let text = 'ST*204*085580001~';

    test('It should have 0 calls after reset', () => {
        ST.resetCalls();

        expect(ST.calls).toBe(0);
    });

    test('It should have 1 call', () => {
        let _st = new ST(text);

        expect(ST.calls).toBe(1);
    });

    test('It should throw when called more than once', () => {
        expect(() => new ST(text)).toThrow();
    });

});

describe('ST class should run in reverse', () => {

    test('ST.from should build a string', () => {
        const obj = {
          'transactionSetIdentifierCode': '204',
          'transactionSetControlNumber': '085570001'
        }

        const text = ST.from(obj, '*', '~');

        expect(text).toBe('ST*204*085570001~');
    });

});
