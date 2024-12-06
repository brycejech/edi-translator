'use strict';

const validate    = require('./validate'),
      applyModels = require('./apply-models');

function Schema(schema){
    this.schema = schema.schema;
    this.meta   = schema.meta;

    try{
        validate(this.schema);
    }
    catch(e){
        throw e;
    }

    // Side effect
    applyModels(this.schema);

    return this;
}

Schema.prototype.getIdSet = function getIdSet(){
    return getFlattenedIds(this.schema);
}

function getFlattenedIds(schema){
    let items = new Set();

    for(const item of schema){
        if(item.type === 'segment'){
            items.add(item.id);
            continue;
        }
        getFlattenedIds(item.schema).forEach(item => items.add(item));
    }

    return items;
}

module.exports = Schema;