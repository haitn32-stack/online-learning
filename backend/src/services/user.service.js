const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { getPagingData, getPagination } = require('../utils/pagination.util');

class UserService {
    async getUserById(id) {
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        if (!user) throw new Error('User not found');
        const userObj = user.toJSON();
        userObj.status = userObj.status ? 'Active' : 'Inactive';
        return userObj;
    }

    async updateProfile(id, data) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        
        const allowedFields = ['fullName', 'phone', 'gender'];
        for (const field of allowedFields) {
            if (data[field] !== undefined) user[field] = data[field];
        }
        await user.save();
        
        const userObj = user.toJSON();
        delete userObj.password;
        userObj.status = userObj.status ? 'Active' : 'Inactive';
        return userObj;
    }

    async changePassword(id, currentPassword, newPassword) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new Error('Incorrect current password');

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return true;
    }

    async getAllUsers(query) {
        const { page = 1, size = 10, search, role, status, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const { limit, offset } = getPagination(page, size);

        const whereCondition = {};
        if (search) {
            whereCondition[Op.or] = [
                { fullName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        if (role) whereCondition.role = role;
        if (status !== undefined && status !== '') {
            whereCondition.status = status === 'Active' || status === 'true' || status === true;
        }

        const users = await User.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [[sortBy, sortOrder]],
            attributes: { exclude: ['password'] }
        });

        const result = getPagingData(users, page, limit);
        if (result.items) {
            result.items = result.items.map(u => {
                const uObj = u.toJSON();
                uObj.status = uObj.status ? 'Active' : 'Inactive';
                return uObj;
            });
        }
        return result;
    }

    async createUser(data) {
        const existing = await User.findOne({ where: { email: data.email } });
        if (existing) throw new Error('Email already in use');

        const userData = { ...data };
        if (userData.status !== undefined) {
            userData.status = userData.status === 'Active' || userData.status === true || userData.status === 'true';
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await User.create({
            ...userData,
            password: hashedPassword
        });

        const userObj = user.toJSON();
        delete userObj.password;
        userObj.status = userObj.status ? 'Active' : 'Inactive';
        return userObj;
    }

    async updateUser(id, data) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        const allowedFields = ['fullName', 'phone', 'role', 'status', 'gender'];
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                if (field === 'status') {
                    user.status = data.status === 'Active' || data.status === true || data.status === 'true';
                } else {
                    user[field] = data[field];
                }
            }
        }
        await user.save();
        
        const userObj = user.toJSON();
        delete userObj.password;
        userObj.status = userObj.status ? 'Active' : 'Inactive';
        return userObj;
    }

    async updateAvatar(id, avatarPath) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        user.avatar = avatarPath;
        await user.save();

        const userObj = user.toJSON();
        delete userObj.password;
        userObj.status = userObj.status ? 'Active' : 'Inactive';
        return userObj;
    }
}

module.exports = new UserService();
