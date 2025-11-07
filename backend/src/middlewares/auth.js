import asyncHandler from '../utils/asyncHandler.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { User, BusOperator } from '../models/index.js';

/**
 * Protect routes - require authentication
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AuthenticationError('No authentication token provided');
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to request based on user type
    if (decoded.type === 'user') {
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      if (!user.isActive) {
        throw new AuthenticationError('Account is inactive');
      }

      if (user.isBlocked) {
        throw new AuthenticationError('Account is blocked');
      }

      req.user = user;
      req.userType = 'user';
    } else if (decoded.type === 'operator') {
      const operator = await BusOperator.findById(decoded.id).select('-password');

      if (!operator) {
        throw new AuthenticationError('Bus operator not found');
      }

      if (!operator.isActive) {
        throw new AuthenticationError('Account is inactive');
      }

      if (operator.isSuspended) {
        throw new AuthenticationError('Account is suspended');
      }

      req.user = operator;
      req.userType = 'operator';
    } else {
      throw new AuthenticationError('Invalid user type');
    }

    next();
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      throw new AuthenticationError('Invalid or expired token');
    }
    throw error;
  }
});

/**
 * Restrict to specific roles
 * Usage: restrictTo('admin', 'customer')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    // For User model
    if (req.userType === 'user' && !roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Role '${req.user.role}' is not allowed to perform this action`
      );
    }

    // For BusOperator, they have 'operator' as implicit role
    if (req.userType === 'operator' && !roles.includes('operator')) {
      throw new AuthorizationError('Bus operators are not allowed to perform this action');
    }

    next();
  };
};

/**
 * Check if user is verified (email/phone)
 */
export const requireVerification = (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Not authenticated');
  }

  if (req.userType === 'user') {
    if (!req.user.isEmailVerified && !req.user.isPhoneVerified) {
      throw new AuthorizationError('Please verify your email or phone number first');
    }
  }

  next();
};

/**
 * Check if bus operator is approved
 */
export const requireApproval = (req, res, next) => {
  if (req.userType !== 'operator') {
    return next();
  }

  if (req.user.verificationStatus !== 'approved') {
    throw new AuthorizationError(
      'Your account is pending approval. Please wait for admin verification.'
    );
  }

  next();
};

/**
 * Optional authentication - attach user if token exists, but don't fail if not
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);

    if (decoded.type === 'user') {
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive && !user.isBlocked) {
        req.user = user;
        req.userType = 'user';
      }
    } else if (decoded.type === 'operator') {
      const operator = await BusOperator.findById(decoded.id).select('-password');
      if (operator && operator.isActive && !operator.isSuspended) {
        req.user = operator;
        req.userType = 'operator';
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
});
