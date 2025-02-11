import { Schema, model } from "mongoose";

const emergencySchema = new Schema(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        startDate: { type: Date, default: Date.now, required: true },
        endDate: { type: Date },
        location: { type: String, required: true },
        coordinates: { 
            type: {
                lat: { type: Number },
                lon: { type: Number }
	    	},
            _id: false
        },
        state: {
            type: String,
            enum: ["In corso", "Terminato"],
            default: "In corso",
        },
        description: { type: String },
    },
    { timestamps: true }
);

const Emergency = model("Emergency", emergencySchema);

export default Emergency;
