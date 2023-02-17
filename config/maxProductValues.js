import fs from 'fs';

let values = {
    maxPrice: 0,
    maxWeight: 0,
    maxHeight: 0
};

fs.readFile('./config.json', 'utf-8', function(err, jsonString) {
    if (err) {
        return console.log(err);
    }
    values = JSON.parse(jsonString).maxProductValues;
});

export function setMaxProductPrice(maxPrice) {
    if (maxPrice > values.maxPrice) {
        values.maxPrice = maxPrice;

        fs.writeFile('./config.json', JSON.stringify({maxValues: {...values, maxPrice}}), err => {
            if (err) {
                console.log(err)
            }
        });
    }
}

export function setMaxProductWeight(maxWeight) {
    if (maxWeight > values.maxWeight) {
        values.maxWeight = maxWeight;

        fs.writeFile('./config.json', JSON.stringify({maxValues: {...values, maxWeight}}), err => {
            if (err) {
                console.log(err)
            }
        });
    }
}

export function setMaxProductHeight(maxHeight) {
    if (maxHeight > values.maxHeight) {
        values.maxHeight = maxHeight;

        fs.writeFile('./config.json', JSON.stringify({maxValues: {...values, maxHeight}}), err => {
            if (err) {
                console.log(err)
            }
        });
    }
}

export function setMaxValues({price, weight, height}) {
    const newValues = {
        maxPrice: price > values.maxPrice ? price : values.maxPrice,
        maxWeight: weight > values.maxWeight ? weight : values.maxWeight,
        maxHeight: height > values.maxHeight ? height : values.maxHeight
    };
    
    values = newValues;

    fs.writeFile('./config.json', JSON.stringify({maxProductValues: newValues}), err => {
        if (err) {
            console.log(err)
        }
    });
}

export const getMaxProductPrice = () => values.maxPrice;
export const getMaxProductWeight = () => values.maxWeight;
export const getMaxProductHeight = () => values.maxHeight;
export const getMaxValues = () => values;


export default {
    setMaxProductPrice,
    setMaxProductWeight, 
    setMaxProductHeight,
    setMaxValues, 
    getMaxProductPrice,
    getMaxProductWeight,
    getMaxProductHeight,
    getMaxValues
}