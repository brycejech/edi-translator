'use strict';

const GE  = require('./GE'),
      GS  = require('./GS'),
      IEA = require('./IEA'),
      ISA = require('./ISA'),
      SE  = require('./SE'),
      ST  = require('./ST');


const models = {
    GE,
    GS,
    IEA,
    ISA,
    SE,
    ST
}

function resetModelCalls(){
    for(const key in models){
        models[key].resetCalls();
    }
}

module.exports = {
    ...models,
    resetModelCalls
}
