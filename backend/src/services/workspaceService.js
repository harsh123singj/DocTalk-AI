import Workspace from "../models/workspace.models.js";

export const createWorkspace = async ({ name, description, userId }) => {

    if (!name || !description || !userId) {
        throw new Error("Please enter required fields");
    }

    const newWorkspace = new Workspace({
        name: name.trim(),
        description: description.trim(),
        owner: userId
    });

    const savedWorkspace = await newWorkspace.save();

    return savedWorkspace;
};


// Get workspace

export const getUserWorkspaces = async (userId) => {
    const workspace = await Workspace.find({ owner: userId });

    return workspace;
}



// get WorkSpace by workSpace id

export const getWorkspaceById = async (workspaceId, userId) => {
    const WorkspaceById = await Workspace.findOne({
        _id: workspaceId,
        owner: userId
    })


    if (!WorkspaceById) {
        throw new Error("Workspace not found");
    }

    return WorkspaceById;
}


// update existing workspace by id

export const updateWorkspace = async (
    workspaceId,
    userId,
    { name, description }
) => {

    const updatedWorkspace = await Workspace.findOneAndUpdate(
        {
            _id: workspaceId,
            owner: userId
        },
        {
            name,
            description
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedWorkspace) {
        throw new Error("Workspace not found");
    }

    return updatedWorkspace;
};


// Delete any Workspace

export const deleteWorkspace = async (workspaceId, userId) => {

    const deletedWorkspace = await Workspace.findOneAndDelete({
        _id: workspaceId,
        owner: userId
    });

    if (!deletedWorkspace) {
        throw new Error("Workspace not found");
    }

    return deletedWorkspace;
};