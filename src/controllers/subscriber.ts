import { Response, Request } from "express";
import { ISubscriber } from "../types/subscriber.js";
import Subscriber from "../models/subscriber.js";
import Segment from "../models/segment.js";
import csv from "csv-parser";
import fs from "fs";
import { Types } from "mongoose";

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

        const subscribers: ISubscriber[] = await Subscriber.find({ segmentId, createdBy: userId });

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
        const userId = req.userId;

        const subscribers: ISubscriber[] = await Subscriber.find({ createdBy: userId });

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

        const userId = req.userId;
        const subscriberID = req.params.id;

        const subscriber: ISubscriber | null = await Subscriber
            .findOne({ _id: subscriberID, createdBy: userId })
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

        const userId = req.userId;

        const subscriber: ISubscriber = new Subscriber({
            name,
            email,
            notes,
            segmentId,
            createdBy: userId,
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

        const userId = req.userId;
        const subscriberID = req.params.id;
        const updateFields = req.body;

        const updatedSubscriber: ISubscriber | null = await Subscriber.findOneAndUpdate(
            { _id: subscriberID, createdBy: userId },
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

        const userId = req.userId;
        const subscriberID = req.params.id;

        const deletedSubscriber: ISubscriber | null = await Subscriber.findOneAndDelete({ _id: subscriberID, createdBy: userId });

        if (!deletedSubscriber) {
            return res.status(404).json({ message: "that subscriber doesnt exist" });
        }

        return res.status(200).json({ deletedSubscriber });

    } catch (error) {
        console.log(error);

    }
};

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

const uploadSubscribersByCSV = async (req: MulterRequest, res: Response): Promise<void> => {
    try {

        const userId = new Types.ObjectId(req.userId);

        if (!req.userId) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        const results: ISubscriber[] = [];

        fs.createReadStream(req.file.path, { encoding: 'utf-8' })
            .pipe(csv({
                skipLines: 0,
                strict: true
            }))
            .on('data', (data) => {
                const subscriber: Partial<ISubscriber> = {
                    name: data.name,
                    email: data.email,
                    notes: data.notes,
                    isSubscribed: true,
                    segmentId: data.segmentId,
                    createdBy: userId,
                    customFields: {}
                };

                Object.keys(data).forEach(key => {
                    if (!['name', 'email', 'notes', 'isSubscribed', 'segmentId', 'createdBy'].includes(key)) {
                        subscriber.customFields![key] = data[key];
                    }
                });

                if (subscriber.name && subscriber.email) {
                    results.push(subscriber);
                }
            })
            .on('end', async () => {
                fs.unlinkSync(req.file!.path);

                if (results.length > 0) {
                    try {
                        await Subscriber.insertMany(results);

                        res.status(200).json({
                            message: `${results.length} subscribers have been successfully uploaded and saved to the database`,
                            subscribers: results
                        });
                    } catch (error) {
                        console.error('Error saving subscribers to the database:', error);
                        res.status(500).json({ message: "Error saving subscribers to the database" });
                    }
                } else {
                    res.status(400).json({ message: "No valid subscribers found in the file" });
                }
            })
            .on('error', (error) => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ message: "Error processing CSV file" });
            });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber, getSubscribersBySegment, getAllAppSubscribers, uploadSubscribersByCSV };
