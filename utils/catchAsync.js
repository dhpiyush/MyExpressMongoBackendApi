// only used to catch async functions errors
export default function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //so that the error is passed to the globalErrorFunction
  };
}
