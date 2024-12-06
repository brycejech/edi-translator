'use strict';

const find = require('../lib/find-by-key');

function processFile(arr, start, schema, delimiter='*', reset=false){

    // data for this whole loop
    const data = [];

    // segments
    let segs = {};

    let i = start, len = arr.length;
    for( ; i < len; i++){
        const el = arr[i], id = el.split(delimiter)[0];

        const schemaItem = find(schema, 'id', id);

        if(!schemaItem){ // current item not in loop schema
            data.push(segs);
            return {lastIndex: i, data};
        }

        if(schemaItem.type === 'segment'){

            const Model = schemaItem.Model,
                  idx   = schema.indexOf(find(schema, 'id', id));

            if(reset) Model.resetCalls();

            if(idx === 0){// restart the loop
                if(i !== start){ // only push if we've moved
                    data.push(segs);
                }
                segs = {};
                segs[schemaItem.name] = (new Model(el)).data;
            }
            else{
                if(segs[schemaItem.name]){
                    // segment already exists, convert to array or push to existing
                    if(Array.isArray(segs[schemaItem.name])){
                        segs[schemaItem.name].push(
                            (new Model(el)).data
                        );
                    }
                    else{
                        segs[schemaItem.name] = [ segs[schemaItem.name] ];

                        segs[schemaItem.name].push(
                            (new Model(el)).data
                        );
                    }
                }
                else{
                    segs[schemaItem.name] = (new Model(el)).data;
                }
            }
        }
        else if(schemaItem.type === 'loop'){
            const innerLoop = processFile(arr, i, schemaItem.schema, delimiter, true);

            // Set i to wherever the loop left off
            // Subtract one since the loop will increment
            i = innerLoop.lastIndex - 1;
            segs[schemaItem.name] = innerLoop.data;
        }

    }
    data.push(segs);
    return {lastIndex: i, data};
}

module.exports = processFile;
