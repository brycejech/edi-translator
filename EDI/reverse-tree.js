'use strict';

function reverseTree(tree, schema, delimiter, terminator){

    let segments = [];

    if(Array.isArray(tree)){
        tree.forEach(el => {
            segments = segments.concat(
                reverseTree(el, schema, delimiter, terminator)
            );
        })
    }
    else{
        for(const key in tree){
            const schemaItem = schemaItemFromKey(schema, key);

            // This is where unknown keys should be skipped and reported as parse
            // errors, rather than throwing
            if(!schemaItem){
                console.log(tree);
                console.log(tree[key]);
                console.log(key);
                console.log(schema);
                console.log('--------------------');
                throw new Error(`Schema item for key "${ key }" not found`);
            }

            if(schemaItem.type === 'segment'){
                const Model = schemaItem.Model;

                if(Array.isArray(tree[key])){
                    tree[key].forEach(el => {
                        segments.push(Model.from(el, delimiter, terminator));
                    });
                }
                else if(typeof tree[key] === 'object'){
                    segments.push(Model.from(tree[key], delimiter, terminator));
                }
            }
            else if(schemaItem.type === 'loop'){
                segments = segments.concat(
                    reverseTree(tree[key], schema, delimiter, terminator)
                );
            }
        }
    }

    return segments.join('');
}

function schemaItemFromKey(schema, key){
    for(let i = 0, len = schema.length; i < len; i++){
        const el = schema[i];

        if(el.name === key || el.id === key){
            return el;
        }
        if(el.type === 'loop'){
            const found = schemaItemFromKey(el.schema, key);

            if(found) return found;
        }
    }
}

module.exports = reverseTree;
