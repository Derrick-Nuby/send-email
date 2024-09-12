import { Response, Request } from "express";
import { ISubscriber } from "../types/subscriber.js";
import Subscriber from "../models/subscriber.js";
import Segment from "../models/segment.js";
import csv from "csv-parser";
import fs from "fs";
import { Types } from "mongoose";
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
                    results.push(subscriber as ISubscriber);
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

const csvTesting = async (req: MulterRequest, res: Response): Promise<void> => {
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
                    batch.forEach((subscriber, index) => {
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
                if (error.writeErrors) {
                    // Handle bulk write errors
                    const failedIndexes = new Set(error.writeErrors.map((e: any) => e.index));
                    batch.forEach((subscriber, index) => {
                        if (failedIndexes.has(index)) {
                            insertionErrors.push({
                                subscriber,
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
        res.status(500).json({ message: 'Failed to process CSV', error: error.message });
    }
};



export { getSubscribers, getSingleSubscriber, createSubscriber, updateSubscriber, deleteSubscriber, getSubscribersBySegment, getAllAppSubscribers, uploadSubscribersByCSV, csvTesting };
