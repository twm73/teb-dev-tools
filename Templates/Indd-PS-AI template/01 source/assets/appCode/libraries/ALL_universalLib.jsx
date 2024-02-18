

/**
 * Removes duplicates from the given array and returns a new array.
 *
 * @param {Array} array - The source array.
 * @returns {Array} - The array without duplicates.
 */
function removeDuplicatesFromArray (array) {
    var temp1 = [].concat(array);
    var temp2 = [];
    temp1.sort();
    for (i = 0; i < temp1.length; i++) {
        if (temp1[i] === temp1[i + 1]) {
            continue
        }
        temp2[temp2.length] = temp1[i];
    }
    return temp2;
}

/**
 * Returns an array containing the difference between two arrays.
 *
 * @param {Array} array1 - The first array.
 * @param {Array} array2 - The second array.
 * @returns {Array} - An array that contains elements that are present in one array but not in the other.
 */
function arraysDifference (array1, array2) {
    var a = [], diff = [];
    for (var j = 0; j < array1.length; j++) {
        a[array1[j]] = true;
    }
    for (var i = 0; i < array2.length; i++) {
        if (a[array2[i]]) {
            delete a[array2[i]];
        } else {
            a[array2[i]] = true;
        }
    }
    for (var k in a) {
        diff.push(k);
    }
    return diff;
}

/**
 * Returns an array that is the difference between array1 and array2.
 *
 * @param {Array} array1 - The minuend array.
 * @param {Array} array2 - The subtrahend array.
 *
 * @returns {Array} - The difference array.
 */
function arrayMinusArray(array1, array2){
    var result = [];
    array1.sort();
    array2.sort();
    for (var i = 0; i < array1.length; i++) {
        if(! elementIsInArray(array1[i], array2)) result.push(array1[i]);
    }
    return result;
}

/**
 * Checks if the specified element is present in the given array.
 *
 * @param {*} element - The element to be searched for, of any type.
 * @param {Array} array - The array to be searched.
 * @returns {boolean} - True if the element is found in the array, false otherwise.
 */
function elementIsInArray(element, array){
    for (var i = 0; i < array.length; i++) {
        if(array[i]===element) return true;
    }
    return false;
}

/**
 * Returns the current date in the specified format. Available formats:
 * 'YYYY-MM-DD'
 * 'YYYY:MM:DD'
 * 'logFile'
 * Default format:
 * 'DD-MM-YYYY'
 * @param {string} format - The desired format.
 * @returns {string} - The date as a string.
 */
function getFormattedDate(format) {
    var year, day, month, hours, minutes, seconds;
    year = String(new Date().getFullYear());
    month = zeroCheck(new Date().getMonth()+1);
    day = zeroCheck(new Date().getDate());
    hours = zeroCheck(new Date().getHours());
    minutes = zeroCheck(new Date().getMinutes()+1);
    seconds = zeroCheck(new Date().getSeconds()+1);
    switch (format) {
        case 'YYYY-MM-DD':
            return year + '-' + month  + '-' + day;
        case 'YYYY:MM:DD':
            return year + ':' + month  + ':' + day;
        case 'YYYY-MM-DDTHH:MM:SSZ':
            return year + '-' + month  + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + 'Z';
        case 'HH:MM:SS':
            return hours + ':' + minutes + ':' + seconds;
        case 'logFile':
            return year + '-' + month  + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        case 'forFolderName':
            return year + '-' + month  + '-' + day + ' h' + hours + 'm' + minutes + 's' + seconds;
    }
    return day + '-' + month  + '-' + year;
    function zeroCheck(value) {
        if(String(value).length === 1) return '0' + String(value);
        return String(value);
    }
}