module.exports = (fn) => {             //That's a wrapAsync function
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};