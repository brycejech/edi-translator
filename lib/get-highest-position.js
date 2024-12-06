'use strict';

function getHighestPosition(arr){
    let highest = 0;

    arr.forEach(el => {
        if(el.position > highest) highest = el.position
    });

    return highest;
}

module.exports = getHighestPosition;
