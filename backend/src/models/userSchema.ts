import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        portfolios: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Portfolio",
            },
        ],
    },
    {timestamps: true}
);

export default UserSchema;