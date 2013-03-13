// These are typically small helper functions that should not depend on any other functions

// Returns string of properties within an object
function printObject(object) {
    var output = '';
    for (var property in object) {
        output += ' < p > ' + property + ': ' + object[property] + '; < /p>';
    }
    return output;
}