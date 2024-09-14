const Users = require("../Models/userModel");
const projectService = require('../Services/projectService');
const taskServices = require('../Services/taskService');


const getAllTaskInProject = async (req,res)=>{
    const {id} = req.params;
    if (id){
        const tasks = await projectService.getAllTaskInProject(id)
        if(tasks){
            return res.status(200).json({msg:'tasks retrieved successfully',
                                            tasks
                                        })
        }
    }
    return res.status(400).json({msg:'error retrieving tasks'})
}

const createTaskWithProjectId = async (req,res)=>{
    const {id}= req.params;
    const userId = req.userId;
    const userEmail=req.body.email
    let user = await userService.findUserByEmail(userEmail);

    const {title,description,assignedBy,assignedTo} = req.body
    const taskObj={
        title,
        description,
        assignedBy:assignedBy || userId,
        assignedTo: assignedTo ? assignedTo : (user ? user.id : null)
    }
    if (taskObj && id){
        const { task,project} = await taskServices.createTask(id,taskObj)
        return res.status(200).json({msg:'task created successfully',
                                        task:task,
                                        project:project
                                    })
    }
    return res.status(400).json({ msg:'error creating task'})
}

const editTask = async (req,res)=>{
    const {taskId} = req.params;
    const {title,description}= req.body;
    const taskObj ={
        title,
        description,
    };
    if (taskId){
        const editedTask = await taskServices.editTask(taskId,taskObj) 
        if (editedTask){
            return res.status(200).json({msg:'task edited successfully',
                                            task:editedTask
                                        })
        }
    }
    return res.status(400).json({msg:'error editing task'});
}



const editTaskStatus = async (req,res)=>{
    const {taskId}=req.params;
    const {status} = req.body;
    if (taskId && status){
        const editedTask= await taskServices.editTaskStatus(taskId,status)
        if (editedTask){
            return res.status(200).json({msg:'task status updated successfully',
                                            Task:editedTask
                                        })
        }
    }
    return res.status(400).json({msg:'error updating task status'})
}

const assignTaskToUser = async (req,res)=>{
    const {userId,taskId} = req.body;
    if(userId && taskId){
        const task = await taskServices.assignTaskToUser(userId,taskId)
        if (task){
            return res.status(200).json({msg:'user assigned task',
                                            task
                                        })
        }
    }
}


const deleteTask = async (req,res)=>{
    const {taskId,projectId}= req.body;
    if(taskId && projectId){
        const deletedTask = await taskServices.deleteTask(taskId);
        if(deletedTask){
            const newProject = await projectService.deleteTaskInProject(projectId, taskId);
            return res.status(200).json({msg:'task deleted successfully',
                                            'deleted Task':deletedTask,
                                            project:newProject
                                        })
        }
    }
    return res.status(400).json({msg:'error deleting task'})
}

const taskController ={
    
    getAllTaskInProject,
    createTaskWithProjectId,
    editTask,
    editTaskStatus,
    deleteTask,
    assignTaskToUser,
}

module.exports = taskController