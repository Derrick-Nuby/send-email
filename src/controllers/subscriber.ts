import { Response, Request } from "express";
import { ISubscriber } from "../types/subscriber.js";
import Subscriber from "../models/subscriber.js";
import Segment from "../models/segment.js";

const getAllAppSubscribers = async (req: Request, res: Response): Promise<any> => {
    try {
        const subscribers: ISubscriber[] = await Subscriber
            .find()
            .populate({
                path: 'segmentId',
                model: Segment,
                select: '_id name description createdBy',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    select: '_id name email',
                },
            });

        if (subscribers.length <= 0) {
            return res.status(404).json({ message: "there are no subscribers" });
        }

        return res.status(200).json({ subscribers });

    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve subscribers" });
    }
};


const getSubscribersBySegment = async (req: Request, res: Response): Promise<any> => {
    try {
        const segmentId = req.params.segmentId;
        const userId = req.userId;

        const subscribers: ISubscriber[] = await Subscriber.find({ segmentId });

        if (subscribers.length <= 0) {
            return res.status(404).json({ message: "there are no subscribers" });
        }

        return res.status(200).json({ subscribers });

    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve subscribers" });
    }
};

const getSubscribers = async (req: Request, res: Response): Promise<any> => {
    try {
        const subscribers: ISubscriber[] = await Subscriber.find();
        const userId = req.userId;

        if (subscribers.length <= 0) {
            return res.status(404).json({ message: "there are no subscribers" });
        }

        return res.status(200).json({ subscribers });

    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve subscribers" });
    }
};

const getSingleSubscriber = async (req: Request, res: Response): Promise<any> => {
    try {

        const subscriberID = req.params.id;

        const subscriber: ISubscriber | null = await Subscriber
            .findById(subscriberID)
            .populate({
                path: 'segmentId',
                model: Segment,
                select: '_id name description createdBy',
                populate: {
                    path: 'createdBy',
                    model: 'User',
                    select: '_id name email',
                },
            });

        if (!subscriber) {
            return res.status(404).json({ message: "that subscriber doesnt exist" });
        }

        return res.status(200).json({ subscriber });

    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve subscriber" });
    }
};

const createSubscriber = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, notes, segmentId, customFields } = req.body;

        const subscriber: ISubscriber = new Subscriber({
            name,
            email,
            notes,
            segmentId,
            isSubscribed: true,
            customFields,
        });

        const newSubscriber: ISubscriber = await subscriber.save();

        return res.status(201).json({ newSubscriber });

    } catch (error) {
        console.error('Error creating subscriber:', error);
        res.status(500).json({ error: 'Failed to create subscriber' });
    }
};

const updateSubscriber = async (req: Request, res: Response): Promise<any> => {
    try {

        const subscriberID = req.params.id;
        const updateFields = req.body;

        const updatedSubscriber: ISubscriber | null = await Subscriber.findByIdAndUpdate(
            { _id: subscriberID },
            updateFields,
            { new: true }
        );

        if (!updatedSubscriber) {
            return res.status(404).json({ message: "that subscriber doesnt exist" });
        }

        return res.status(200).json({ updatedSubscriber });

    } catch (error) {
        console.log(error);

    }
};

const deleteSubscriber = async (req: Request, res: Response): Promise<any> => {
    try {

        const subscriberID = req.params.id;

        const deletedSubscriber: ISubscriber | null = await Subscriber.findOneAndDelete({ _id: subscriberID });

        if (!deletedSubscriber) {
            return res.status(404).json({ message: "that subscriber doesnt exist" });
        }

        return res.status(200).json({ deletedSubscriber });

    } catch (error) {
        console.log(error);

    }
};

export { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber, getSubscribersBySegment, getAllAppSubscribers };