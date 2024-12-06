'use strict';

const createReverse = require('../lib/create-reverse-function');

function createSchemaModels(schema, delimiter='*', terminator='~'){

    for(const item of schema){
        if(item.type === 'segment'){

            if(!(
                   item.id
                && item.name
                && item.max
                && item.elements
            )){
                console.log(item);
                throw new Error('id, name, max, and elements members required');
            }

            item.Model = createModel(item);
        }
        else if(item.type === 'loop'){
            createSchemaModels(item.schema, delimiter, terminator)
        }
        else{
            const err = new Error('SchemaItem.type not understood');
            error.item = item;

            throw err;
        }
    }

    return schema;
}

function createModel(item, delimiter='*', terminator='~'){

    function SegmentModel(text){
        this.id      = item.id;
        this.name    = item.name;
        this.maxUse  = item.max;
        this.purpose = item.purpose;

        // if(SegmentModel.calls > this.maxUse){
        //     throw new Error(`${ this.id } line max-use exceeded`);
        // }

        const IdExp = new RegExp(`^${ this.id }\\${ delimiter }`, 'i');

        if(!IdExp.test(text)){
            throw new Error(`Text is not a ${ this.id } line`);
        }

        const parts = text.replace(terminator, '').split(delimiter);

        this.text = text;
        this.data = {};

        SegmentModel.elements.forEach(el => {
            this.data[el.name] = parts[el.position] || null
        });

        SegmentModel.calls++;

        return this;
    }

    SegmentModel.elements = item.elements;

    SegmentModel.calls = 0;

    SegmentModel.resetCalls = () => SegmentModel.calls = 0;

    SegmentModel.from = createReverse(SegmentModel, item.id);

    return SegmentModel;
}

module.exports = createSchemaModels;