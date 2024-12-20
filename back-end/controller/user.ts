import express from 'express';
import userService from '../service/user.service';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { authorizeOwnerOrAdmin } from '../middleware/authorizeOwner';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Add a new user with a username, password, and role.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               role:
 *                 type: string
 *                 example: "USER"
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid input or error during creation.
 */
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const newUser = await userService.createUser({ username, password, role });
        res.status(201).json(newUser);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     description: Authenticate a user and return a JWT token.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Successful login with JWT token.
 *       400:
 *         description: Invalid username or password.
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await userService.loginUser(username, password);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users. Requires ADMIN role.
 *     security:
 *       - bearerAuth: [] # JWT authenticatie vereist
 *     responses:
 *       200:
 *         description: "A list of users."
 *       403:
 *         description: "Forbidden: Insufficient permissions."
 *       401:
 *         description: "Unauthorized: Missing or invalid token."
 *       500:
 *         description: "Server error during retrieval."
 */
router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     tags: [Users]
 *     description: Retrieve details of a single user using their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Invalid request.
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await userService.getUserById(parseInt(req.params.id, 10));
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update details of an existing user. Only ADMIN or the user themselves can perform this action.
 *     security:
 *       - bearerAuth: [] # Vereist JWT-authenticatie
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "updated_username"
 *               password:
 *                 type: string
 *                 example: "newSecurePassword"
 *               role:
 *                 type: string
 *                 example: "USER"
 *     responses:
 *       200:
 *         description: 'User updated successfully.'
 *       403:
 *         description: 'Forbidden: Only ADMIN or the user can update.'
 *       401:
 *         description: 'Unauthorized: Missing or invalid token.'
 *       400:
 *         description: 'Invalid input or error during update.'
 */
router.put(
    '/:id',
    authenticate,
    authorizeOwnerOrAdmin((req) => parseInt(req.params.id, 10)),
    async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = req.body;

        try {
            const updatedUser = await userService.updateUser(id, data);
            res.status(200).json(updatedUser);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Remove a user from the database using their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user.
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       400:
 *         description: Error during deletion.
 */
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        await userService.deleteUser(id);
        res.status(204).send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
