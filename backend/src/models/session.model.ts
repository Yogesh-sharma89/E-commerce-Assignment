
import mongoose from "mongoose";
import type { ISESSION } from "../types/schema/user.js";

const sessionSchema = new mongoose.Schema<ISESSION>({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"],
        
    },

    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token hash is required"],
        trim: true
    },

    ip: {
        type: String,
        required: [true, "IP address is required"],
        trim: true
    },

    expiresAt: {
        type: Date,
        required: [true, "Session expiry date is required"],
        index: true
    },

    revokedAt: {
        type: Date,
    },

    userAgent: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
})

const SessionModel = mongoose.model<ISESSION>("session", sessionSchema);

export default SessionModel;