import { Response, Request } from "express";
import { ISubscriber } from "../types/subscriber";
import Subscriber from "../models/subscriber";
import Segment from "../models/segment";

const getSubscribers = async (req: Request, res: Response): Promise<any> => {
    try {
        const subscribers: ISubscriber[] = await Subscriber.find();

        if (subscribers.length <= 0) {
            res.status(404).json({ message: "there are no subscribers" });
        }

        res.status(200).json({ subscribers });

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
                    model: 'User',  // Assuming you have a User model
                    select: '_id name email',  // Fields from the User model
                },
            });

        if (!subscriber) {
            res.status(404).json({ message: "that subscriber doesnt exist" });
        }

        res.status(200).json({ subscriber });

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

        res.status(201).json({ newSubscriber });

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
            res.status(404).json({ message: "that subscriber doesnt exist" });
        }

        res.status(200).json({ updatedSubscriber });

    } catch (error) {
        console.log(error);

    }
};

const deleteSubscriber = async (req: Request, res: Response): Promise<any> => {
    try {

        const subscriberID = req.params.id;

        const deletedSubscriber: ISubscriber | null = await Subscriber.findOneAndDelete({ _id: subscriberID });

        if (!deletedSubscriber) {
            res.status(404).json({ message: "that subscriber doesnt exist" });
        }

        res.status(200).json({ deletedSubscriber });

    } catch (error) {
        console.log(error);

    }
};

export { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber };