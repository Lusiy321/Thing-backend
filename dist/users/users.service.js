"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("./users.model");
const bcrypt_1 = require("bcrypt");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
let UsersService = exports.UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findAll(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById({ _id: findId.id });
            if (user.role === 'admin') {
                return this.userModel.find().exec();
            }
            else if (user.role === 'boss') {
                const subUsers = this.userModel
                    .find({ $or: [{ _id: user._id }, { boss: user._id }] })
                    .exec();
                return subUsers;
            }
            else {
                return await this.userModel.findById(user._id).exec();
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findById(id, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById({ _id: findId.id });
            if (user.role === 'admin' || user.role === 'boss') {
                const find = await this.userModel.findById(id).exec();
                return find;
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async create(user) {
        try {
            const { email } = user;
            const registrationUser = await this.userModel.findOne({ email });
            if (registrationUser) {
                throw new http_errors_1.Conflict(`User with ${email} in use`);
            }
            const createdUser = await this.userModel.create(user);
            createdUser.setName(user.email);
            createdUser.setPassword(user.password);
            createdUser.save();
            const setUser = await this.userModel.findById(createdUser._id);
            if (setUser.role === 'user') {
                const boss = await this.userModel.findOne({ role: 'boss' });
                setUser.boss = boss._id;
                setUser.save();
            }
            return await this.userModel.findById(createdUser._id);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async login(user) {
        try {
            const { email, password } = user;
            const authUser = await this.userModel.findOne({ email });
            if (!authUser || !authUser.comparePassword(password)) {
                throw new http_errors_1.Unauthorized(`Email or password is wrong`);
            }
            const payload = {
                id: authUser._id,
            };
            const SECRET_KEY = process.env.SECRET_KEY;
            const token = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '24h' });
            await this.userModel.findByIdAndUpdate(authUser._id, { token });
            const authentificationUser = await this.userModel.findById({
                _id: authUser._id,
            });
            return authentificationUser;
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async logout(req) {
        const { authorization = '' } = req.headers;
        const [bearer, token] = authorization.split(' ');
        if (bearer !== 'Bearer') {
            throw new http_errors_1.Unauthorized('Not authorized');
        }
        try {
            const SECRET_KEY = process.env.SECRET_KEY;
            const user = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            await this.userModel.findByIdAndUpdate({ _id: user.id }, { token: null });
            return await this.userModel.findById({ _id: user.id });
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async update(user, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            const params = __rest(user, []);
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            await this.userModel.findByIdAndUpdate({ _id: findId.id }, Object.assign({}, params));
            const userUpdate = this.userModel.findById({ _id: findId.id });
            return userUpdate;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async delete(id, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.userModel.findById({ _id: findId.id });
            if (user.role === 'admin') {
                const find = await this.userModel.findByIdAndRemove(id).exec();
                return find;
            }
            else {
                throw new http_errors_1.Conflict('Only admin can delete user');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async setBoss(id, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const userToUpdate = await this.userModel
                .findById({ _id: findId.id })
                .exec();
            const newSub = await this.userModel.findById(id).exec();
            if (!userToUpdate || !newSub) {
                throw new http_errors_1.Conflict('User or boss not found');
            }
            if (userToUpdate.role === 'user' && newSub.role === 'boss') {
                userToUpdate.boss = newSub._id;
                return userToUpdate.save();
            }
            else if (userToUpdate.role === 'boss' && newSub.role === 'user') {
                newSub.boss = userToUpdate._id;
                return newSub.save();
            }
            else {
                throw new http_errors_1.Conflict('Only boss and their subordinates can change user boss');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async setRole(id, role, req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const userAdmin = await this.userModel
                .findById({ _id: findId.id })
                .exec();
            const newRoleSub = await this.userModel.findById(id).exec();
            if (!userAdmin || !newRoleSub) {
                throw new http_errors_1.Conflict('User or admin not found');
            }
            if (userAdmin.role === 'admin') {
                newRoleSub.role = role.role;
                return await newRoleSub.save();
            }
            else {
                throw new http_errors_1.Conflict('Only admin  can change user role');
            }
        }
        catch (e) {
            throw new http_errors_1.Conflict(e.message);
        }
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [users_model_1.User])
], UsersService);
users_model_1.UserSchema.methods.setPassword = async function (password) {
    return (this.password = (0, bcrypt_1.hashSync)(password, 10));
};
users_model_1.UserSchema.methods.setName = function (email) {
    const parts = email.split('@');
    this.name = parts[0];
};
users_model_1.UserSchema.methods.comparePassword = function (password) {
    return (0, bcrypt_1.compareSync)(password, this.password);
};
//# sourceMappingURL=users.service.js.map