'use strict';

function padRight(str, len, char){
    while(str.length < len) str += char;

    return str;
}

module.exports = padRight;
