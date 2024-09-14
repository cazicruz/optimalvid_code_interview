const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController')
const asyncHandler = require('express-async-handler')

router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
router.post('/refresh-token', asyncHandler(authController.tokenRefresh))
router.post('/forgot-password', asyncHandler(authController.forgotPass))
router.put('/reset-password', asyncHandler(authController.resetPass))
router.get('/oauth/init/google', asyncHandler(authController.googleOauth_init))
router.get('/sessions/oauth/google', asyncHandler(authController.googleOauth_code))

module.exports = router;

/**
 * @swagger
 * /auth/oauth/init/google:
 *   get:
 *     summary: redirects users to the google concent page.
 *     description: this endpoint generates parameters and url to direct users to login or signup with google and then redirects them with their data back to the login path.
 *     tags:
 *       - OAuth
 *     responses:
 *       302:
 *         description: Redirected successfully to Google consent page.
 *       500:
 *         description: Internal server error.
 * 
 * /auth/sessions/oauth/google:
 *   get:
 *     summary: takes data from the oauth init route.
 *     description: takes data from the oauth init route which redirected to the google consent screen and start the user registration or login depending if user already exists.
 *     tags:
 *       - OAuth
 *     responses:
 *       200:
 *         description: Successfully processed OAuth code and authenticated user.
 *       500:
 *         description: Internal server error.
 * 
 * /auth/register:
 *   post:
 *     summary: Register a new user.
 *     description: Registers a new user with the provided username, password, email, and an optional referral code.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               country:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               DoB:
 *                 type: date
 *               sex:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *               - email
 *               - phoneNumber
 *               - country
 *               - DoB
 *               - sex
 *     responses:
 *       200:
 *         description: User registration successful.
 *       400:
 *         description: Invalid request or user already exists.
 *       500:
 *         description: Server error.
 *
 * /auth/login:
 *   post:
 *     summary: Log in an existing user.
 *     description: Logs in an existing user with the provided email and password, and returns access tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User login successful.
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Server error.
 * 
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh user's access token.
 *     description: Refreshes the user's access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *       401:
 *         description: Access denied, token missing or expired.
 *       500:
 *         description: Server error.
 * 
 * /auth/forgot-password:
 *   post:
 *     summary: Send OTP for password reset.
 *     description: Sends an OTP to the user's email address for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Invalid request or user not found.
 *       500:
 *         description: Error sending OTP.
 *
 * /auth/reset-password:
 *   put:
 *     summary: Reset user's password.
 *     description: Resets the user's password using a valid OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - otp
 *               - password
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid request, user not found, invalid OTP, or OTP expired.
 *       500:
 *         description: Server error.
 */
