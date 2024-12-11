import { Schema, model } from "mongoose";

const emergencySchema = new Schema(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        location: { type: String, required: true },
        state: {
            type: String,
            enum: ["in_progress", "ended"],
            default: "in_progress",
        },
        description: { type: String },
    },
    { timestamps: true }
);

const Emergency = model("Emergency", emergencySchema);

export default Emergency;
