import Joi from 'joi';
import fs from "fs";
import csv from "csv-parser";
import mongoose, { Types } from 'mongoose';
import { ISubscriber } from "../types/subscriber.js";
import { subscriberSchema } from '../middlewares/subscriberValidation.js';
import Segment from './../models/segment.js';


export const csvToJson = async (filePath: string, userId: Types.ObjectId): Promise<{ validSubscribers: ISubscriber[], invalidEntries: { row: number, errors: string[], data: any; }[]; }> => {
    const validSubscribers: ISubscriber[] = [];
    const invalidEntries: { row: number, errors: string[], data: any; }[] = [];

    try {
        return new Promise((resolve, reject) => {
            let rowCount = 0;

            fs.createReadStream(filePath, { encoding: 'utf-8' })
                .pipe(csv({ skipLines: 0, strict: true }))
                .on('data', async (data) => {
                    rowCount++;

                    const subscriber: Partial<ISubscriber> = {
                        customFields: {},
                    };

                    // Separate known fields from custom fields
                    Object.keys(data).forEach((key) => {
                        if (['name', 'email', 'notes', 'isSubscribed', 'segmentId', 'createdBy'].includes(key)) {
                            (subscriber as any)[key] = data[key];
                        } else {
                            subscriber.customFields![key] = data[key];
                        }
                    });

                    // Validate the subscriber using the validateSubscriber function
                    const validation = await validateSubscriber(subscriber);

                    if (!validation.isValid) {
                        // Collect errors for this row
                        invalidEntries.push({
                            row: rowCount,
                            errors: validation.errors,
                            data: data // Original data for this row
                        });
                    } else {
                        // Add isSubscribed and createdBy fields before pushing valid subscriber
                        subscriber.isSubscribed = true; // Ensure this field is true for all subscribers
                        subscriber.createdBy = userId;   // Set createdBy to the userId passed in

                        // Push valid subscriber to the validSubscribers array
                        validSubscribers.push(subscriber as ISubscriber);
                    }
                })
                .on('end', () => {
                    resolve({
                        validSubscribers,
                        invalidEntries
                    });
                })
                .on('error', (error) => {
                    reject(new Error(`Error parsing CSV: ${error.message}`));
                });
        });
    } catch (error) {
        console.error('Error processing CSV:', error);
        throw new Error('Error processing CSV');
    }
};


const validateSubscriber = async (subscriber: Partial<ISubscriber>) => {
    const { error } = subscriberSchema.validate(subscriber, { abortEarly: false });


    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return { isValid: false, errors: errorMessages };
    }

    // const segmentId = subscriber.segmentId;



    // if (segmentId) {
    //     const id = typeof segmentId === 'string' ? segmentId : (segmentId as Types.ObjectId).toHexString();

    //     if (!mongoose.Types.ObjectId.isValid(id)) {
    //         return { isValid: false, errors: ['Invalid segmentId format'] };
    //     }

    //     const segment = await Segment.findById(id);
    //     if (!segment) {
    //         return { isValid: false, errors: ['The specified segment does not exist'] };
    //     }
    // }

    return { isValid: true, errors: [] };
};
