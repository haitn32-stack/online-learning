const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../jobs/email.job');
const { Op } = require('sequelize');

class AuthService {
    /**
     * Register a new user
     */
    async register(userData) {
        const { fullName, email, password, phone } = userData;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = uuidv4();

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            verificationToken
        });

        if (sendVerificationEmail) {
            await sendVerificationEmail(user.email, verificationToken);
        }

        const userObj = user.toJSON();
        delete userObj.password;
        return userObj;
    }

    /**
     * Login user and generate JWT
     */
    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid email or password');

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        
        const userObj = user.toJSON();
        delete userObj.password;
        return { user: userObj, token };
    }

    /**
     * Verify user email via token
     */
    async verifyEmail(token) {
        const user = await User.findOne({ where: { verificationToken: token } });
        if (!user) throw new Error('Invalid or expired verification token');

        user.verificationToken = null;
        user.status = true; // Assuming status boolean for active
        await user.save();
        
        const userObj = user.toJSON();
        delete userObj.password;
        return userObj;
    }

    /**
     * Request a password reset email
     */
    async requestPasswordReset(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('User not found');

        const resetToken = uuidv4();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        if (sendResetPasswordEmail) {
            await sendResetPasswordEmail(user.email, resetToken);
        }
        return true;
    }

    /**
     * Reset the password using the token
     */
    async resetPassword(token, newPassword) {
        const user = await User.findOne({ 
            where: { 
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: new Date() }
            } 
        });
        if (!user) throw new Error('Invalid or expired reset token');

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        
        return true;
    }
}

module.exports = new AuthService();
