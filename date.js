// generate the current date in our module.exports.getDate function
// using const here because we are not reasigning values so it doesn't change
exports.getDate = function() {

    const today = new Date();

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    return today.toLocaleDateString("en-US", options);
};

// generate the current day in our module.exports.getDay function
exports.getDay = function() {

    const today = new Date();

    const options = {
        weekday: 'long',
    };

    return today.toLocaleDateString("en-US", options);
}