const Users = require("../Models/userModel");
const projectService = require('../Services/projectService');
const taskServices = require('../Services/taskService');





const getAllProjects= async (req,res)=>{
    const projects = await projectService.getAllProjects();
    return res.status(200).json({msg:'project retrieved successfully',
                                 "projects":projects
                            })
}
const getAllUsersProjects= async (req,res)=>{
    const id= req.userId;
    if(!id){
        return res.status(404).json({msg:'user Id missing in route Parameter'
        })
    }
    const projects = await projectService.getAllUsersProjects(id);
    return res.status(200).json({msg:' users project retrieved successfully',
                                projects
                            })
}

const getProjectById = async (req,res)=>{
    const {id} = req.params;
    if(id){
        const projects = await projectService.getProjectById(id);
        if(projects){
            return res.status(200).json({msg:'project retrieved successfully',
                                            projects
                                        });
        }
    }
    return res.status(400).json({msg:'error retrieving project'});
    
}


const createProjects =async(req,res)=>{
    const userId = req.userId;
    const projectObj={
        title:req.body.title,
        description:req.body.description,
        createdBy:userId
    }
    const { newProject, user } = await projectService.createProjects(projectObj,userId);
    if(!newProject){
        return res.status(400).json({msg:'error cterating new project for user'})
    }
    return res.status(200).json({msg:'project Created Successfully',
                                    project:newProject,
                                    user:user
                                })

}

const addUserToProject= async (req,res)=>{
    const {userId, projectId} = req.body
    const {user,project} = await addUserToProject(userId,projectId);
    if(user,project){
        return res.status(200).json({msg:'user added to project',
                                        user,
                                        project
                                    })
    }
    return res.status(400).json({msg:'error updating user to project'});
}




const projectController ={
    getAllProjects,
    getAllUsersProjects,
    createProjects,
    getProjectById,
    addUserToProject,
}

module.exports = projectController