'use strict';

function findByKey(arr, key, val){
    for(let i = 0, len = arr.length; i < len; i++){
        if(arr[i][key] === val) return arr[i];
    }
}

module.exports = findByKey;
