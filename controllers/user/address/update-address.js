import {AppError, catchAsync} from '../../../utils';
// import User from '../../../models/user';

// Updating both current address and address in the allAddresses
export const updateAddress = catchAsync(async (req, res, next) => {
    if (req.body.address && !req.body.address.uuid) {
         throw new AppError('Please provide uuid', 400);
    }
    
    // const user = await User.findOne({_id: req.user.id});
    const user = req.user;
    const address = req.body.address;
    const uuid = address.uuid;

    const allAddresses = user.allAddresses;
    let isAddressPresent = false;
    user.allAddresses = allAddresses.map(addr => {
        if(addr.uuid === uuid) {
            isAddressPresent = true
            return address;
        };
        return addr;
    });

    if (!isAddressPresent) {
        throw new AppError('No address found', 404);
    }

    if (user.address.uuid === uuid) {
        user.address = address;
    }

    await user.save({validateBeforeSave: false});
    
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                address
            }
        }
    });
});