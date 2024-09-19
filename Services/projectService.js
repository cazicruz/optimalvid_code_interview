const Users = require("../Models/userModel");
const Project = require("../Models/projectModel");
const Task = require("../Models/taskModel");
const mongoose = require('mongoose');


const getAllProjects= async ()=>{
    const projects = await Project.find().exec();
    return projects; 
}

// remember to test
const getProjectById = async (id)=>{
    const project = await Project.findOne({_id:id}).exec();
    return project;
}

const getAllUsersProjects = async (user_id)=>{
    const user = await Users.findById(user_id).populate('projects').exec();
    return user.projects;
}

const createProjects = async (projectObj, user_id) => {
    try {
        // Check if the project with the same title already exists
        // const projectExists = await Project.findOne({ title: projectObj.title }).exec();
        // if (projectExists) {
        //     throw new Error("Project with this title already exists");
        // }

        // Find the user by ID
        const user = await Users.findById(user_id).populate('projects').exec();
        if (!user) {
            throw new Error("User not found");
        }
        const userHasProjectWithSameTitle = user.projects.some(
            project => project.title === projectObj.title
        );
        if(userHasProjectWithSameTitle ){
            throw new Error('Project with this title already exists for user')
        }

        // Create and save the new project
        const newProject = new Project(projectObj);
        await newProject.save();

        // Add the new project's ID to the user's projects array
        user.projects.push(newProject._id);
        await user.save();

        // Return both the new project and the updated user
        return { newProject, user };
    } catch (err) {
        throw new Error(`Error creating project: ${err.message}`);
    }
}

const getAllTaskInProject = async (project_id)=>{
    const project= await Project.findById(project_id).populate('tasks').exec();
    return project.tasks;
}

const getAllUsersInProject = async (project_id)=>{
    const project= await Project.findById(project_id).populate('users').exec();
    return project.users;
}

const addTaskIdToProject = async (project_id, task_id) => {
    const project = await Project.findById(project_id).exec();
    if (!project) {
        throw new Error('Project not found');
    }
    project.tasks.push(task_id);
    await project.save();
    return project;
}

const addUserToProject = async (email,projectId)=>{
    const user = await Users.findOne({email:email}).exec()
    const project =await Project.findById(projectId).exec()
    if (!user || !project) {
        throw new Error('User or project not found');
    }
    if (!project.users.includes(user._id) && !user.projects.includes(project._id)) {
        project.users.push(user._id);
        user.projects.push(project._id);
        await user.save();
        await project.save();
        return {user,project}
    }else{
        throw new Error('user already assiged to project')
    }
}

const deleteTaskInProject = async (project_id,task_id)=>{
    const project = await Project.findById(project_id).populate('tasks').exec();
        
    if (!project) {
        throw new Error("Project not found");
    }

    // Filter out the task you want to delete
    const newTasklist = project.tasks.filter(task => task._id.toString() !== task_id);

    // Update the project's tasks
    project.tasks = newTasklist;

    // Save the updated project
    await project.save();
    return project;
}


const projectServices = {
    createProjects,
    getAllUsersProjects,
    getProjectById,
    getAllProjects,
    getAllTaskInProject,
    getAllUsersInProject,
    addTaskIdToProject,
    deleteTaskInProject,
    addUserToProject,
    
}
module.exports = projectServices;