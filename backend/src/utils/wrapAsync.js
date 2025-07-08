const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default wrapAsync;

//passing next callback as argument meaning like err => next(err)