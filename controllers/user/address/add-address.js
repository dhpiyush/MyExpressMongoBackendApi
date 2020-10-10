import { v4 as uuidv4 } from 'uuid';

import {AppError, catchAsync} from '../../../utils';
import User from '../../../models/user';

//Add address in allAddresses array
export const addAddress = catchAsync(async (req, res, next) => {
    // const user = await User.findOne({_id: req.user.id});
    const user = req.user;
    const address = req.body.address;

    const allAddresses = user.allAddresses;
    let isAddressPresent = false;
    allAddresses.forEach(addr => {
        if(addr.name === address.name) isAddressPresent = true;
    });
    
    if (isAddressPresent) {
        throw new AppError('Already present address! Please change the name of the address', 400);
    }

    // create uuid for the address
    address.uuid = 'trn:address:uuid:' + uuidv4();
    user.allAddresses.push(address);

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