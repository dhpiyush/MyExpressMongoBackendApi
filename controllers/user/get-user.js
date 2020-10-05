import factory from '../handler-factory'; 
import User from '../../models/user';

export const getMe = (req, res, next) =>{
    req.params.id = req.user.id;
    next();
};

export const getUser = factory.getOne(User,['name', 'email', 'role']);