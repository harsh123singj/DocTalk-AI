import cloudinary from "../config/cloudinary.js";

const uploadTOCloudinary = (buffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        stream.end(buffer);
    });
};



export const deleteFromCloudinary = async(publicId)=>{
    return new Promise((resolve , reject)=>{
        cloudinary.uploader.destroy(
            publicId,
            (error , result)=>{
                if(error){
                    reject(error);
                }
                else{
                    resolve(result);
                }
            }
        )
    })
}

export default uploadTOCloudinary;