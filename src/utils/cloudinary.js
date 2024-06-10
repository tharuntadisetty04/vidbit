import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { ApiError } from "./ApiError";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);

        fs.unlinkSync(localFilePath);
        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);

        if (response.result !== "ok") {
            throw new ApiError(
                400,
                `Failed to delete image with public ID: ${publicId}`
            );
        }

        return response;
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new ApiError(500, "Error deleting image from Cloudinary");
    }
};

export { uploadToCloudinary, deleteFromCloudinary };
