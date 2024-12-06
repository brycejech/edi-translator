'use strict';

const IEA = require('./IEA');

describe('IEA class should parse text', () => {

    let _iea;
    let text = 'IEA*1*000032837~';

    beforeEach(() => _iea = new IEA(text, '*', '~'));

    test('It should build parts', () => {
        expect(typeof _iea.data).toBe('object');

        expect(_iea.data['numberOfIncludedFunctionalGroups']).toBe('1');
        expect(_iea.data['interchangeControlNumber']).toBe('000032837');
    });

});

describe('IEA class should throw on invalid input', () => {

    let _iea;
    let texts = [
        'IE*1*000032837~',
        'IEAX*1*000032837~',
        'IEX*1*000032837~'
    ];

    beforeEach(() => IEA.resetCalls());

    texts.forEach(text => {
        expect(() => new IEA(text, '*', '~')).toThrow();
    });

});

describe('IEA constructor should throw when called more than once', () => {

    let text = 'IEA*1*000032837~';

    test('It should have 0 calls', () => {
        IEA.resetCalls();

        expect(IEA.calls).toBe(0);
    });

    test('It should have 1 call', () => {
        let _iea = new IEA(text, '*', '~');

        expect(IEA.calls).toBe(1);
    });

    test('It should throw when called more than once', () => {
        expect(() => new IEA(text, '*', '~')).toThrow();
    });

});

describe('IEA class should run in reverse', () => {

    test('IEA.from should build a string', () => {
        const obj = {
          'numberOfIncludedFunctionalGroups': '1',
          'interchangeControlNumber': '000032836'
        }

        const text = IEA.from(obj, '*', '~');

        expect(text).toBe('IEA*1*000032836~');
    });

});
