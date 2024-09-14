const express = require('express');
const router = express.Router();
const verifyJWT = require('../Middleware/verifyJWT');
const asyncHandler = require('express-async-handler');
const projectController = require('../Controllers/projectController');
const taskController = require('../Controllers/taskController');


router.get('/',verifyJWT, asyncHandler(projectController.getAllProjects));
router.get('/user',verifyJWT, asyncHandler(projectController.getAllUsersProjects));
router.get('/:id',verifyJWT, asyncHandler(projectController.getProjectById));
router.post('/',verifyJWT, asyncHandler(projectController.createProjects));
router.put('/user/add',verifyJWT, asyncHandler(projectController.addUserToProject));
//project and task routes
router.get('/:id/task',verifyJWT, asyncHandler(taskController.getAllTaskInProject));
router.post('/:id/task',verifyJWT, asyncHandler(taskController.createTaskWithProjectId));

module.exports = router;

/**
 * @swagger
 * /projects/user/add:
 *   put:
 *     summary: Add a user to a project
 *     description: Add a user to an existing project
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to be added to the project
 *               projectId:
 *                 type: string
 *                 description: The ID of the project to add the user to
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User added to project successfully
 *       400:
 *         description: Error adding user to project
 * /projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve all projects
 *     tags:
 *       - Projects
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       400:
 *         description: Error retrieving projects
 * 
 *   post:
 *     summary: Create a new project
 *     description: Create a new project for the authenticated user
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the project
 *               description:
 *                 type: string
 *                 description: The description of the project
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Project created successfully
 *       400:
 *         description: Error creating project
 *
 * /projects/user:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     description: Retrieve all projects associated with the authenticated user
 *     tags:
 *       - Projects
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User's projects retrieved successfully
 *       404:
 *         description: User ID missing in route parameter
 *
 * /projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     description: Retrieve a specific project by its ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       400:
 *         description: Error retrieving project
 *
 * /projects/{id}/task:
 *   get:
 *     summary: Get all tasks in a project
 *     description: Retrieve all tasks associated with a specific project
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project
 *         schema:
 *           type: string
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       400:
 *         description: Error retrieving tasks
 *
 *   post:
 *     summary: Create a new task in a project
 *     description: Create a new task and associate it with a specific project
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project
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
 *                 description: The title of the task
 *               description:
 *                 type: string
 *                 description: The description of the task
 *               assignedBy:
 *                 type: string
 *                 description: The ID of the user assigning the task (optional)
 *               assignedTo:
 *                 type: string
 *                 description: The ID of the user the task is assigned to (optional)
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Task created successfully
 *       400:
 *         description: Error creating task
 */