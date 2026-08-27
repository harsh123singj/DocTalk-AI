import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workspace",
        required: true
    },
    status: {
        type: String,
        enum: ["uploaded", "processing", "completed", "failed"],
        default: "uploaded"
    }
}, {
    timestamps: true
})

const Document = mongoose.model("document", documentSchema);

export default Document;