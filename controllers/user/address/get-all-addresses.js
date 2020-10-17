import { catchAsync } from "../../../utils";

// export const getAllAddresses = factory.getOne(User, [ 'allAddresses.name', 'allAddresses.geo', 'allAddresses.uuid']);
export const getAllAddresses = (req, res, next) => {
  const allAddresses = req.user.allAddresses;
  const removedIdfromallAddresses = allAddresses.map((address) => {
    address._id = null;
    return address;
  });

  res.status(200).json({
    status: "success",
    data: {
      user: { allAddresses: removedIdfromallAddresses },
    },
  });
};
