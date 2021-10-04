module.exports = (fn) => {
  // console.log(fn);
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    //shorthand for the one below
    // fn(req, res, next).catch(err => next(err));
  };
};
