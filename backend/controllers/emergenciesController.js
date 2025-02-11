import Emergency from "../models/emergency.js";
const pathApiEmergencies = "/api/emergencies/";

export const getEmergencies = async (req, res) => {
    try {
        let filter = {};
        const state = req.query.state;

        if (state && (state === "in_corso" || state === "terminato")) {
            // Riformatto prima il parametro dello stato
            filter.state = formatState(state);
        }

        let emergencies = await Emergency.find(filter);
        emergencies = emergencies.map((emergency) => {
            return {
                self: pathApiEmergencies + emergency._id,
                title: emergency.title,
                category: emergency.category,
                startDate: emergency.startDate,
                endDate: emergency.endDate,
                location: emergency.location,
                coordinates: emergency.coordinates,
                state: emergency.state,
                description: emergency.description,
            };
        });
        res.status(200).json(emergencies);
    } catch (error) {
        res.status(500).json({ message: "Error in emergencies recovery" });
        console.log(error.message);
    }
};

export const getEmergencyById = async (req, res) => {
    try {
        let emergency = await Emergency.findById(req.params.id);
        if (!emergency)
            return res.status(404).json({ message: "Emergency not found" });
        emergency = {
            self: pathApiEmergencies + emergency._id,
            title: emergency.title,
            category: emergency.category,
            startDate: emergency.startDate,
            endDate: emergency.endDate,
            location: emergency.location,
            coordinates: emergency.coordinates,
            state: emergency.state,
            description: emergency.description,
        };
        res.status(200).json(emergency);
    } catch (error) {
        res.status(500).json({ message: "Error in emergency recovery" });
    }
};

export const createEmergency = async (req, res) => {
    try {
        let emergency = new Emergency(req.body);
        emergency = await emergency.save();
        let emergencyId = emergency._id;
        res.location(pathApiEmergencies + emergencyId)
            .status(201)
            .send();
    } catch (error) {
        res.status(400).json({ message: "Error in emergency creation" });
    }
};

export const updateEmergency = async (req, res) => {
    try {
        let updateData = req.body;
        if (req.body.state === "Terminato") {
            updateData.endDate = new Date();
        }
        const emergency = await Emergency.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!emergency)
            return res.status(404).json({ message: "Emergency not found" });
        res.status(200).json(emergency);
    } catch (error) {
        res.status(400).json({ message: "Error in emergency update" });
    }
};

export const deleteEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.findByIdAndDelete(req.params.id);
        if (!emergency)
            return res.status(404).json({ message: "Emergency not found" });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: "Error in emergency deletion" });
    }
};

function formatState(state) {
    const words = state.split("_").join(" ");
    return words.charAt(0).toUpperCase() + words.slice(1);
}
