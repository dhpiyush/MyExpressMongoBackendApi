import {AppError, catchAsync} from '../../../utils';
// import User from '../../../models/user';

// Updating both current address and address in the allAddresses
export const deleteAddress = catchAsync(async (req, res, next) => {
    const address = req.body.address;

    if (!address) {
         throw new AppError('Please provide address field', 400);
    }

    if (!(address && address.uuid)) {
         throw new AppError('Please provide uuid', 400);
    }
    
    // const user = await User.findOne({_id: req.user.id});
    const user = req.user;
    const uuid = address.uuid;

    const allAddresses = user.allAddresses;
    let isAddressPresent = false;
    user.allAddresses = allAddresses.reduce((addresses, addr) => {
        if(addr.uuid === uuid) {
            isAddressPresent = true
            return addresses;
        };
        addresses.push(addr);
        return addresses;
    }, []);

    if (!isAddressPresent) {
        throw new AppError('No address found', 404);
    }

    if (user.address.uuid === uuid) {
        user.address = user.allAddresses.length == 0 ? null : user.allAddresses[0];
    }

    await user.save({validateBeforeSave: false});
    
    res.status(200).json({
        status: 'success'
    });
});