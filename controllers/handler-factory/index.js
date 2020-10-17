import { AppError, catchAsync } from "../../utils";

//https://mongoosejs.com/docs/queries.html

// exports.deleteOne = Model => catchAsync(async (req, res, next) => {
//     const doc = await Model.findyByIdAndDelete(req.params.id);

//     if (!doc) {
//         return next(new AppError('No doc found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// });

exports.updateOne = (Model, fieldsToReturn, keyName) =>
  catchAsync(async (req, res, next) => {
    const fields = fieldsToReturn && fieldsToReturn.join(" ");
    //update user document
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // returns new object
      runValidators: true, // if we put invalid email address then we need mongoose to validate
      select: fields,
    });

    if (!doc) {
      return next(new AppError("No doc found with that ID", 404));
    }

    const data = {};
    data[keyName] = doc;

    res.status(200).json({
      status: "success",
      data,
    });
  });

// exports.createOne = Model => catchAsync(async (req, res, next) => {
//     //update user document
//     const doc = await Model.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             data: doc
//         }
//     });
// });

// exports.getOne = async (Model, id, popOptions) => {
//     let doc = {}
//     //get user document
//     try {
//         let query = await Model.findById(id);

//         if (popOptions) {
//             query = query.populate(popOptions);
//         }
//         doc = await query;
//     } catch (error) {
//         console.error(error);
//     }
//     return doc;
// };

// We can also use this directly and use exports.getUser = factory.getOne(User); in the user/index.js file
exports.getOne = (Model, fieldsToReturn, popOptions) =>
  catchAsync(async (req, res, next) => {
    const fields = fieldsToReturn && fieldsToReturn.join(" ");
    //get user document
    let query = await Model.findById(req.params.id, fields);

    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    // const user = {};
    // (fieldsToReturn || []).forEach(field => user[field] = doc[field]);

    res.status(201).json({
      status: "success",
      data: {
        user: doc,
      },
    });
  });

exports.getAll = (Model, fieldsToReturn, keyName) =>
  catchAsync(async (req, res, next) => {
    // const features = new APIFeatures(Model.find(), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate()
    const fieldsToReturnFromDoc = {};
    (fieldsToReturn || []).map((field) => (fieldsToReturnFromDoc[field] = 1));
    const doc = await Model.find({}, fieldsToReturnFromDoc);

    const data = {};
    data[keyName] = doc;
    res.status(200).json({
      status: "success",
      results: doc.length,
      data,
    });
  });
