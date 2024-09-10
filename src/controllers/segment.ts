import { Response, Request } from "express";
import { ISegment } from "../types/segment";
import Segment from "../models/segment";

const getSegments = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.userId;

        const segments: ISegment[] = await Segment.find({ createdBy: userId });

        if (segments.length <= 0) {
            res.status(404).json({ message: "there are no segments" });
        }

        res.status(200).json({ segments });

    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve segments" });
    }
};

const getSingleSegment = async (req: Request, res: Response): Promise<any> => {
    try {

        const segmentID = req.params.id;
        const userId = req.userId;

        const segment: ISegment | null = await Segment.findById({ _id: segmentID, createdBy: userId });

        if (!segment) {
            res.status(404).json({ message: "that segment doesnt exist" });
        }

        res.status(200).json({ segment });

    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve segment" });
    }
};

const createSegment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, description } = req.body;

        const userId = req.userId;

        const segment: ISegment = new Segment({
            name,
            description,
            createdBy: userId,
        });

        const newSegment: ISegment = await segment.save();

        res
            .status(201)
            .json({ newSegment });

    } catch (error) {
        console.log(error);

    }
};

const updateSegment = async (req: Request, res: Response): Promise<any> => {
    try {

        const segmentID = req.params.id;
        const updateFields = req.body;
        const userId = req.userId;

        const updatedSegment: ISegment | null = await Segment.findByIdAndUpdate(
            { _id: segmentID, createdBy: userId },
            updateFields,
            { new: true }
        );

        if (!updatedSegment) {
            res.status(404).json({ message: "that segment doesnt exist" });
        }

        res.status(200).json({ updatedSegment });

    } catch (error) {
        console.log(error);

    }
};

const deleteSegement = async (req: Request, res: Response): Promise<any> => {
    try {

        const segmentID = req.params.id;
        const userId = req.userId;

        const deletedSegment: ISegment | null = await Segment.findOneAndDelete({ _id: segmentID, createdBy: userId });

        if (!deletedSegment) {
            res.status(404).json({ message: "that segment doesnt exist" });
        }

        res.status(200).json({ deletedSegment });

    } catch (error) {
        console.log(error);

    }
};

export { getSegments, getSingleSegment, createSegment, updateSegment, deleteSegement };