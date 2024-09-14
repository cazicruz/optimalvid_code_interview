const mongoose = require('mongoose');
const schema = mongoose.Schema;

const projectSchema= new schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    users:[{
        type: schema.Types.ObjectId,
        ref: 'Users'
    }],
    tasks: [{
        type: schema.Types.ObjectId,
        ref: 'Task'
    }],
    createdBy:{
        type: schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }















    
})


const Project = mongoose.model('Project',projectSchema);

module.exports= Project;