import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { publishUserRegistered } from '../kafka/producer.js';
import { createEventEnvelope } from '../kafka/envelope.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    authProvider: user.authProvider,
    token: generateToken(user._id),
  });
};

const verifyGoogleCredential = async (credential) => {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );

  if (!response.ok) {
    throw new Error('Invalid Google credential');
  }

  const profile = await response.json();

  if (profile.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error('Google credential audience mismatch');
  }

  if (profile.email_verified !== 'true' && profile.email_verified !== true) {
    throw new Error('Google email is not verified');
  }

  return profile;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email }).select('+password');
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local',
    });
    const eventEnvelope = createEventEnvelope('UserRegistered', {
      userId: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
    });
    await publishUserRegistered(eventEnvelope);

    if (user) {
      sendAuthResponse(res, user, 201);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if ((user.authProvider && user.authProvider !== 'local') || !user.password) {
      return res.status(400).json({ message: 'Use Google sign-in for this account' });
    }

    if (await bcrypt.compare(password, user.password)) {
      sendAuthResponse(res, user);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user.password) {
      return res.status(400).json({ message: 'Password changes are not available for Google accounts' });
    }

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google OAuth is not configured' });
    }

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const profile = await verifyGoogleCredential(credential);
    const email = profile.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Google account email is required' });
    }

    let user = await User.findOne({ email }).select('+password');
    let isNewUser = false;

    if (user) {
      user.googleId = user.googleId || profile.sub;
      user.avatar = profile.picture || user.avatar;
      if (!user.password) {
        user.authProvider = 'google';
      } else if (!user.authProvider) {
        user.authProvider = 'local';
      }
      await user.save();
    } else {
      user = await User.create({
        name: profile.name || email.split('@')[0],
        email,
        authProvider: 'google',
        googleId: profile.sub,
        avatar: profile.picture,
      });
      isNewUser = true;
    }

    if (isNewUser) {
      const eventEnvelope = createEventEnvelope('UserRegistered', {
        userId: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
      });
      await publishUserRegistered(eventEnvelope);
    }

    sendAuthResponse(res, user, isNewUser ? 201 : 200);
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(401).json({ message: error.message || 'Google sign-in failed' });
  }
};
