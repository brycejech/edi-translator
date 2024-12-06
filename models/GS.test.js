'use strict';

const GS = require('./GS');

describe('GS class should parse text', () => {

    let _gs;
    let text = 'GS*SM*MGSEABOARD*RASY*20190131*122641*8558*X*004010~';

    beforeEach(() => _gs = new GS(text, '*', '~'));

    test('It should build parts', () => {

        expect(typeof _gs.data).toBe('object');

        expect(_gs.data['functionalIdentifierCode']).toBe('SM');
        expect(_gs.data['applicationSendersCode']).toBe('MGSEABOARD');
        expect(_gs.data['applicationReceiversCode']).toBe('RASY');
        expect(_gs.data['date']).toBe('20190131');
        expect(_gs.data['time']).toBe('122641');
        expect(_gs.data['groupControlNumber']).toBe('8558');
        expect(_gs.data['responsibleAgencyCode']).toBe('X');
        expect(_gs.data['versionReleaseIndustryIdentifierCode']).toBe('004010');
    });
});

describe('GS class should throw on invalid input', () => {

    let _gs;
    let texts = [
        'G*SM*MGSEABOARD*RASY*20190131*122641*8558*X*004010~',
        'GSX*SM*MGSEABOARD*RASY*20190131*122641*8558*X*004010~',
        'GX*SM*MGSEABOARD*RASY*20190131*122641*8558*X*004010~'
    ];

    beforeEach(() => GS.resetCalls());

    texts.forEach(text => {
        test(`This should throw "${ text }"`, () => {
            expect(() => new GS(text, '*', '~')).toThrow();
        });
    });
});

describe('GS constructor should handle multiple calls', () => {

    let text = 'GS*SM*MGSEABOARD*RASY*20190131*122641*8558*X*004010~';

    test('It should have 0 calls after reset', () => {
        GS.resetCalls();

        expect(GS.calls).toBe(0);
    });

    test('It should have 1 call', () => {
        let _gs = new GS(text, '*', '~');

        expect(GS.calls).toBe(1);
    });

    test('It shoudl throw when called more than once', () => {
        expect(() => new GS(text, '*', '~')).toThrow();
    });

});

describe('GS class should run in reverse', () => {

    test('GS.from should build a string', () => {
        const obj = {
          'functionalIdentifierCode': 'SM',
          'applicationSendersCode': 'MGSEABOARD',
          'applicationReceiversCode': 'RASY',
          'date': '20190131',
          'time': '122631',
          'groupControlNumber': '8557',
          'responsibleAgencyCode': 'X',
          'versionReleaseIndustryIdentifierCode': '004010'
        }

        const text = GS.from(obj, '*', '~');
        const expected = 'GS*SM*MGSEABOARD*RASY*20190131*122631*8557*X*004010~';

        expect(text).toBe(expected);
    });

});
