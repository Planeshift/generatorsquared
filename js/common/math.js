// MATH 

/**
 * Returns a random integer in the given interval.
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns {*} 
 */

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Returns a random floating number in the given interval, with the given maximum number of decimals.
 * 
 * @param {*} min 
 * @param {*} max 
 * @param {*} decimals 
 * @returns {*} 
 */
function randomNumberFromInterval(min, max, decimals){
    d = Math.floor(Math.pow(10,decimals));
    return (Math.floor(d*(Math.random()*(max - min + 1)+min)))/d;
}

