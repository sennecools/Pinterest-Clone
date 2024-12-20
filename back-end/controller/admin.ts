import express from 'express';
import { getAdminStats, getAllUsers, deleteUser } from '../service/admin.service';
import { authorize } from '../middleware/authorize';

const router = express.Router();

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     tags: [Admin]
 *     description: Retrieve total statistics like users, boards, and pins.
 *     responses:
 *       200:
 *         description: Admin statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalBoards:
 *                   type: integer
 *                 totalPins:
 *                   type: integer
 */
router.get('/stats', authorize(['ADMIN']), async (req, res) => {
    try {
        const stats = await getAdminStats();
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 */
router.get('/users', authorize(['ADMIN']), async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     description: Delete a user by their ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Error deleting user
 */
router.delete('/users/:userId', authorize(['ADMIN']), async (req, res) => {
    const { userId } = req.params;
    try {
        const deletedUser = await deleteUser(Number(userId));
        res.status(200).json(deletedUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
