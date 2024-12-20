import express from 'express';
import boardService from '../service/board.service';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: API endpoints for managing boards
 */

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     description: Create a new board for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My New Board
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Board created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
    const { name, userId } = req.body;
    try {
        const board = await boardService.createBoard(name, userId);
        res.status(201).json(board);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Retrieve all boards
 *     tags: [Boards]
 *     description: Get a list of all boards
 *     security: []
 *     responses:
 *       200:
 *         description: A list of boards
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const boards = await boardService.getAllBoards();
        res.status(200).json(boards);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /boards/user/{userId}:
 *   get:
 *     summary: Get all boards for a user
 *     tags: [Boards]
 *     description: Retrieve all boards for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Boards found
 *       404:
 *         description: Boards not found
 *       400:
 *         description: Invalid request
 */
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const boards = await boardService.getAllBoardsForUser(parseInt(userId, 10));

        if (boards.length === 0) {
            return res.status(404).json({ error: 'No boards found for this user.' });
        }

        res.status(200).json(boards);
    } catch (err: any) {
        console.error('Error fetching boards:', err);
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Get a specific board by ID
 *     tags: [Boards]
 *     description: Retrieve a single board by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board
 *     security: []
 *     responses:
 *       200:
 *         description: Board found
 *       404:
 *         description: Board not found
 *       400:
 *         description: Invalid request
 */
router.get('/:id', async (req, res) => {
    try {
        const board = await boardService.getBoardById(parseInt(req.params.id, 10));
        if (!board) {
            res.status(404).json({ error: 'Board not found' });
        } else {
            res.status(200).json(board);
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /boards/{id}:
 *   put:
 *     summary: Update a board
 *     tags: [Boards]
 *     description: Update a board's name by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Board Name
 *     responses:
 *       200:
 *         description: Board updated successfully
 *       400:
 *         description: Invalid input or request
 */
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    try {
        const updatedBoard = await boardService.updateBoard(id, { name });
        res.status(200).json(updatedBoard);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     description: Remove a board by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the board
 *     responses:
 *       204:
 *         description: Board deleted successfully
 *       400:
 *         description: Invalid request
 */
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        await boardService.deleteBoard(id);
        res.status(204).send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
