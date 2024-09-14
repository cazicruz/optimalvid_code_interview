const mongoose = require('mongoose');
const schema = mongoose.Schema;

const taskSchema = new schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type: String,
        enum: ['done', 'inprogress', 'undone'],
        default:'undone'
    },
    assignedBy:{
        type: schema.Types.ObjectId,
        ref: 'Users'
    },
    assignedTo:[{
        type: schema.Types.ObjectId,
        ref: 'Users'
    }],
    createdAt:{
        type:Date,
        default:Date.now,
    }

})

const Task = mongoose.model('Task',taskSchema);

module.exports= Task;