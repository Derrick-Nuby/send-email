import { Response, Request } from "express";
import { ISubscriber } from "../types/subscriber.js";
import Subscriber from "../models/subscriber.js";
import Segment from "../models/segment.js";
import csv from "csv-parser";
import fs from "fs";
import mongoose, { Types } from "mongoose";
import { csvToJson } from "../utils/csvToJsonCustom.js";

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

        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;

        const { validSubscribers, invalidEntries } = await csvToJson(filePath, userId);

        fs.unlinkSync(filePath);

        // Batch insertion of valid subscribers
        const batchSize = 100;
        const insertedSubscribers: ISubscriber[] = [];
        const insertionErrors: { subscriber: ISubscriber; error: string; }[] = [];

        for (let i = 0; i < validSubscribers.length; i += batchSize) {
            const batch = validSubscribers.slice(i, i + batchSize);
            try {
                const result = await Subscriber.insertMany(batch, { ordered: false, rawResult: true });

                // Check if all documents were inserted successfully
                if (result.insertedCount === batch.length) {
                    insertedSubscribers.push(...batch);
                } else {
                    // Some documents failed to insert
                    const insertedIds = new Set(Object.values(result.insertedIds));
                    batch.forEach((subscriber: ISubscriber, index: number) => {
                        // @ts-expect-error
                        if (insertedIds.has(subscriber._id)) {
                            insertedSubscribers.push(subscriber);
                        } else {
                            insertionErrors.push({
                                subscriber,
                                error: 'Failed to insert for unknown reason'
                            });
                        }
                    });
                }
            } catch (error) {
                // @ts-expect-error
                if (error.writeErrors) {
                    // @ts-expect-error
                    const failedIndexes = new Set(error.writeErrors.map((e: any) => e.index));
                    batch.forEach((subscriber, index) => {
                        if (failedIndexes.has(index)) {
                            insertionErrors.push({
                                subscriber,
                                // @ts-expect-error
                                error: error.writeErrors.find((e: any) => e.index === index).errmsg || 'Unknown error during insertion'
                            });
                        } else {
                            insertedSubscribers.push(subscriber);
                        }
                    });
                } else {
                    // If it's not a BulkWriteError, treat the entire batch as failed
                    insertionErrors.push(...batch.map(subscriber => ({
                        subscriber,
                        // @ts-expect-error
                        error: error.message || 'Unknown error during insertion'
                    })));
                }
            }
        }

        res.status(200).json({
            message: `CSV processing completed`,
            totalProcessed: validSubscribers.length + invalidEntries.length,
            validSubscribers: validSubscribers.length,
            invalidEntries: invalidEntries.length,
            insertedSubscribers: insertedSubscribers.length,
            insertionErrors: insertionErrors.length,
            details: {
                invalidEntries,
                validSubscribers,
                insertedSubscribers,
                insertionErrors
            }
        });
    } catch (error) {
        console.error('Error in csvTesting controller:', error);
        // @ts-expect-error
        res.status(500).json({ message: 'Failed to process CSV', error: error.message });
    }
};

const searchSubscriber = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new Types.ObjectId(req.userId);
        const searchQuery = req.query.query as string;
        const subscribed = req.query.subscribed as string;
        const segmentId = req.query.segmentid as string;


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: "Invalid user ID" });
            return;
        }

        const filter: any = {
            createdBy: new mongoose.Types.ObjectId(userId)
        };

        if (searchQuery && searchQuery.length >= 2) {
            const regex = new RegExp(searchQuery, 'i');

            filter.$or = [
                { name: { $regex: regex } },
                { email: { $regex: regex } },
                { notes: { $regex: regex } },
                {
                    $expr: {
                        $gt: [
                            {
                                $size: {
                                    $filter: {
                                        input: { $objectToArray: "$customFields" },
                                        as: "field",
                                        cond: { $regexMatch: { input: "$$field.v", regex: regex } }
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            ];
        }
        const isSubscribed = subscribed === 'true' ? true : subscribed === 'false' ? false : undefined;

        if (isSubscribed !== undefined) {
            filter.isSubscribed = isSubscribed;
        }

        if (segmentId) {
            filter.segmentId = segmentId;
        }

        const subscribers = await Subscriber.find(filter)
            .populate({
                path: 'segmentId',
                model: Segment,
                select: '_id name description',
            });

        if (subscribers.length <= 0) {
            res.status(404).json({ error: "No subscribers found for your search; please search again." });
            return;
        }

        res.status(200).json({ subscribers });

    } catch (error) {
        console.error('Error searching subscribers:', error);
        res.status(500).json({ error: "An error occurred while searching for subscribers." });
    }
};


export { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber, getSubscribersBySegment, getAllAppSubscribers, uploadSubscribersByCSV, searchSubscriber };
