const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const asyncHandler = require('express-async-handler')
const taskController = require('../Controllers/taskController')


router.put('/:taskId',verifyJWT, asyncHandler(taskController.editTask));
router.put('/:taskId/status',verifyJWT, asyncHandler(taskController.editTaskStatus));
router.put('/assign',verifyJWT, asyncHandler(taskController.assignTaskToUser));
router.delete('/',verifyJWT, asyncHandler(taskController.deleteTask));


module.exports = router;


/**
 * @swagger
 * /tasks/assign:
 *   put:
 *     summary: Assign a task to a user
 *     description: Assign a specific task to a user
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to assign the task to
 *               taskId:
 *                 type: string
 *                 description: The ID of the task to be assigned
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User assigned to task successfully
 *       400:
 *         description: Error assigning user to task
 * /tasks/{taskId}:
 *   put:
 *     summary: Edit a task
 *     description: Edit the title and description of a specific task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: The ID of the task to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the task
 *               description:
 *                 type: string
 *                 description: The new description of the task
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Task edited successfully
 *       400:
 *         description: Error editing task
 *
 * /tasks/{taskId}/status:
 *   put:
 *     summary: Update task status
 *     description: Update the status of a specific task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: The ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the task
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       400:
 *         description: Error updating task status
 *
 * /tasks:
 *   delete:
 *     summary: Delete a task
 *     description: Delete a specific task and remove it from the associated project
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: The ID of the task to delete
 *               projectId:
 *                 type: string
 *                 description: The ID of the project the task belongs to
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       400:
 *         description: Error deleting task
 */