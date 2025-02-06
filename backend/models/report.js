import { Schema, model } from "mongoose";

const reportSchema = new Schema(
    {
        startDate: { type: Date, default: Date.now, required: true },
        location: { type: String, required: true },
		coordinates: { type: {
			lat: { type: Number },
			lon: { type: Number }
		}},
        state: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true
        },
        description: { type: String, required: true }
    },
    { timestamps: true }
);

const Report = model("Report", reportSchema);

export default Report;
