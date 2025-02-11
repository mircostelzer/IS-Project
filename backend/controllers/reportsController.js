import Report from "../models/report.js";
const pathApiReports = "/api/reports/";

export const getReports = async (req, res) => {
    try {
        let reports = await Report.find();
        reports = reports.map((report) => {
            return {
                self: pathApiReports + report._id,
                startDate: report.startDate,
                location: report.location,
				coordinates: report.coordinates,
                state: report.state,
                description: report.description,
                createdBy: report.createdBy
            };
        });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error in reports recovery" });
    }
};

export const getReportById = async (req, res) => {
    try {
        let report = await Report.findById(req.params.id);
        if (!report)
            return res.status(404).json({ message: "Report not found" });
        report = {
            self: pathApiReports + report._id,
            startDate: report.startDate,
            location: report.location,
			coordinates: report.coordinates,
            state: report.state,
            description: report.description,
            createdBy: report.createdBy
        };
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error in report recovery" });
    }
};

export const getReportsByUser = async (req, res) => {
    try {
        let reports = await Report.find({ createdBy: req.user.id });
        reports = reports.map((report) => {
            return {
                self: pathApiReports + report._id,
                startDate: report.startDate,
                location: report.location,
                coordinates: report.coordinates,
                state: report.state,
                description: report.description,
                createdBy: report.createdBy
            };
        });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error in reports recovery" });
    }
};

export const createReport = async (req, res) => {
    try {
        const userId = req.user.id;
        let report = new Report({
            ...req.body,
            createdBy: userId
        });
        report = await report.save();
        let reportId = report._id;
        res.location(pathApiReports + reportId)
            .status(201)
            .send();
    } catch (error) {
        res.status(400).json({ message: "Error in report creation" });
    }
};

export const updateReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!report)
            return res.status(404).json({ message: "Report not found" });
        res.json(report);
    } catch (error) {
        res.status(400).json({ message: "Error in report update" });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report)
            return res.status(404).json({ message: "Report not found" });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: "Error in report deletion" });
    }
};
