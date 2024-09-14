const Users = require("../Models/userModel");
const Project = require("../Models/projectModel");
const Task = require("../Models/taskModel");
const mongoose = require('mongoose');
const {addTaskIdToProject } = require('./projectService')




const getAllTasks = async ()=>{
    const tasks = await Task.find().exec();
    return tasks;
}

const getTaskById =async (id)=>{
    const task = await Task.findOne({_id:id}).exec();
    return task;
}

const createTask = async (project_id,taskObj)=>{
    const task = await Task.create(taskObj)
    const project= await addTaskIdToProject(project_id,task._id)
    return{ task,project};

}
const editTask = async (id, taskObj) => {
    const task = await Task.findByIdAndUpdate(id, taskObj, { new: true }).exec(); // { new: true } returns the updated task
    return task;
}

const editTaskStatus = async (id, status) => {
    const task = await Task.findById(id);
    if (!task) {
        throw new Error("Task not found");
    }
    task.status = status;
    await task.save();
    return task;
}

const assignTaskToUser = async (user_id,task_id)=>{
    const user = await Users.findById(user_id).exec();
    const task = await Task.findById(task_id).exec()
    if(!user || !task){
        throw new Error("incorrect user or task. can't assign user to task");
    }
    if(!task.assignedTo.includes(user._id)){
        task.assignedTo.push(user_id)
    }
    await task.save()
    return task;
}

const deleteTask = async (id)=>{
    const task = await Task.findByIdAndDelete(id)
    return task;
}


const taskServices ={
    getAllTasks,
    getTaskById,
    createTask,
    editTask,
    editTaskStatus,
    deleteTask,
    assignTaskToUser,
}

module.exports = taskServices;