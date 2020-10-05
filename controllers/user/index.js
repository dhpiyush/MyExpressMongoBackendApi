export {getMe, getUser} from './get-user';
export {updateMe, updateUser} from './update-user';
export {getAllUsers} from './get-all-users';

// exports.deleteMe = catchAsync(async (req, res, next) => {
//     //this active is set to false and not actually the user is deleted
//     const updateUser = await User.findByIdAndUpdate(req.user.id, {active: false});

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// });

// exports.deleteUser = factory.deleteOne(User);
// exports.getUser = catchAsync(async(req, res, next) => {

//     const data = await factory.getOne(User, req.params.id, null);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             user: {
//                 name: data.name,
//                 email: data.email
//             }
//         }
//     });
// });


