import { catchAsync } from "../../../utils";

// export const getAllAddresses = factory.getOne(User, [ 'allAddresses.name', 'allAddresses.geo', 'allAddresses.uuid']);
export const getCurrentAddress = (req, res, next) => {
  const address = req.user.address;
  address._id = null;

  res.status(200).json({
    status: "success",
    data: {
      user: { address },
    },
  });
};
