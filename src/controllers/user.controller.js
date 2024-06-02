import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(
    async (req, res) => {
        const { username, fullName, email, password } = req.body

        if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required")
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists")
        }

        const avatarLocalPath = req.files?.avatar[0]?.path
        const coverImgLocalPath = req.files?.coverImg[0]?.path

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required")
        }

        const avatar = await uploadToCloudinary(avatarLocalPath)
        let coverImg = await uploadToCloudinary(coverImgLocalPath)

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImg: coverImg?.url || "",
            email,
            password,
            username: username.toLowerCase(),
        })

        const isUserCreated = await User.findById(user._id).select("-password -refreshToken")

        if (!isUserCreated) {
            throw new ApiError(500, "User registration failed")
        }

        res.status(201).json(
            new ApiResponse(200, isUserCreated, "User registered successfully")
        )
    }
)

export { registerUser }