import { v4 as uuidv4 } from "uuid";

import { AppError, catchAsync } from "../../../utils";
import User from "../../../models/user";

//Adding address in address and also checking if address is present in allAddresses
export const addCurrentAddress = catchAsync(async (req, res, next) => {
  // const user = await User.findOne({_id: req.user.id});
  const user = req.user;
  const address = req.body.address;

  if (!address) {
    throw new AppError("Please provide address field", 400);
  }

  if (!(address && address.name)) {
    throw new AppError("Please provide name", 400);
  }

  if (user.address && user.address.name === address.name) {
    throw new AppError("Please provide different name of address", 400);
  }
  // create uuid for the address
  address.uuid = "trn:address:uuid:" + uuidv4();
  user.address = address;

  const allAddresses = user.allAddresses;

  let isAddressPresent = false;
  allAddresses.forEach((addr) => {
    if (addr.name === address.name) isAddressPresent = true;
  });
  if (!isAddressPresent) {
    user.allAddresses.push(address);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      user: {
        address: user.address,
      },
    },
  });
});
