import mongoose from "mongoose";

const documentChunkSchema =  new mongoose.Schema({
    document :{
        type : mongoose.Schema.Types.ObjectId,
        ref :"document",
        required :true
    },
    workspace :{
        type : mongoose.Schema.Types.ObjectId,
        ref :"workspace",
        required :true
    },
    text:{
        type:String,
        required:true
    },
    embedding:{
        type :[Number],
        required : true
    }

},
{timestamps:true});

const DocumentChunk = mongoose.model("chunk" , documentChunkSchema);

export default DocumentChunk;