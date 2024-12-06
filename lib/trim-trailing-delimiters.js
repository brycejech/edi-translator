'use strict';

function trimTrailingDelimiters(str, delimiter, terminator){
    str = str.split('');

    let i = str.length - 1;
    while(true){
        if(str[i] === terminator){
            i--;
            continue;
        }
        if(str[i] === delimiter){
            str.splice(i, 1);
            i--;
            continue;
        }
        break;
    }

    return str.join('');
}

module.exports = trimTrailingDelimiters;