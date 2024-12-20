import express from 'express';
import categoryService from '../service/category.service';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     description: Add a new category to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Travel"
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Invalid input or error during creation.
 */
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const category = await categoryService.createCategory({ name });
        res.status(201).json(category);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     description: Retrieve a list of all categories.
 *     security: []
 *     responses:
 *       200:
 *         description: A list of categories.
 *       500:
 *         description: Server error during retrieval.
 */
router.get('/', async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a specific category by ID
 *     tags: [Categories]
 *     description: Retrieve details of a single category using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category.
 *     responses:
 *       200:
 *         description: Category retrieved successfully.
 *       404:
 *         description: Category not found.
 *       400:
 *         description: Invalid request.
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(parseInt(req.params.id, 10));
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
        } else {
            res.status(200).json(category);
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     description: Update the name of an existing category.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Category Name"
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Invalid input or error during update.
 */
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;

    try {
        const updatedCategory = await categoryService.updateCategory(id, { name });
        res.status(200).json(updatedCategory);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     description: Remove a category from the database using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category.
 *     responses:
 *       204:
 *         description: Category deleted successfully.
 *       400:
 *         description: Error during deletion.
 */
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        await categoryService.deleteCategory(id);
        res.status(204).send();
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
