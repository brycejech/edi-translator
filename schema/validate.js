'use strict';

function validateSchema(schema){
    const validTypes = [ 'segment', 'loop' ];

    schema = schema || this.schema;

    for(const item of schema){
        // Schema items must have a type
        if(!item.hasOwnProperty('type')){
            const err = new Error('SchemaItem missing "type" member');
            err.item = item;

            throw err;
        }

        // Schema item types must be valid
        if(!~validTypes.indexOf(item.type)){
            const err = new Error('SchemaItem.type invalid');
            err.item = item;

            throw err;
        }

        // Schema items must have "id" member
        if(!item.hasOwnProperty('id')){
            const err = new Error('SchemaItem missing "id" member');
            err.item = item;

            throw err;
        }

        // Schema items must have "name" member
        if(!item.hasOwnProperty('name')){
            const err = new Error('SchemItem missing "name" member');
            err.item = item;

            throw err;
        }

        // Validate "loop" types
        if(item.type === 'loop'){

            // Loop type items must have a schema
            if(!item.hasOwnProperty('schema')){
                const err = new Error('Loop type missing "schema" member');
                err.item = item;

                throw err;
            }

            // Loop.schema must be an array
            if(!Array.isArray(item.schema)){
                const err = new Error('Loop.schema must be an array');
                err.item = item;

                throw err;
            }

            // Loop schemas must be valid
            try{
                validateSchema(item.schema);
            }
            catch(e){ throw e }
        }
        // Validate "segment" types
        else if(item.type === 'segment'){

            // Segment type items must have elements
            if(!item.hasOwnProperty('elements')){

                // ISA seg is special
                if(item.id === 'ISA') continue;

                const err = new Error('Segment type missing "elements" member');
                err.item = item;

                throw err;
            }

            // Segment.elements must be an array
            if(!Array.isArray(item.elements)){
                const err = new Error('Segment.elements must be an array');
                err.item = item;

                throw err;
            }
        }
    }

    return true;
}

module.exports = validateSchema;
