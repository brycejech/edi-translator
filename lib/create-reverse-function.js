'use strict';

/*
    I don't know if this is good, but it sure feels clever ;)

    - Bryce
*/

const highestPos     = require('./get-highest-position'),
      trimDelimiters = require('./trim-trailing-delimiters');

function createReverseFunction(Model, id){
    return function from(obj, delimiter, terminator){
        const highest = highestPos(Model.elements);

        const arr = Array(highest + 1).fill(undefined);

        arr[0] = id;

        // Pick values based on Model.elements, not each key provided
        // Effectively, ignore extra info that we're not interested in
        Model.elements.forEach(el => {
            arr[el.position] = obj[el.name];
        });

        const str = `${ arr.join(delimiter) }${ terminator }`;

        return trimDelimiters(str, delimiter, terminator);
    }
}



module.exports = createReverseFunction;
