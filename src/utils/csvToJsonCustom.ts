import fs from "fs";
import csv from "csv-parser";
import mongoose, { Types } from 'mongoose';
import { ISubscriber } from "../types/subscriber.js";
import { subscriberSchema } from '../middlewares/subscriberValidation.js';
import Segment from './../models/segment.js';

interface RowData {
    rowCount: number;
    subscriber: Partial<ISubscriber>;
    data: any;
}

export const csvToJson = async (filePath: string, userId: Types.ObjectId): Promise<{ validSubscribers: ISubscriber[], invalidEntries: { row: number, errors: string[], data: any; }[]; }> => {
    const rowsData: RowData[] = [];
    const invalidEntries: { row: number, errors: string[], data: any; }[] = [];

    return new Promise((resolve, reject) => {
        let rowCount = 0;

        fs.createReadStream(filePath, { encoding: 'utf-8' })
            .pipe(csv({ skipLines: 0, strict: true }))
            .on('data', (data) => {
                rowCount++;

                const subscriber: Partial<ISubscriber> = {
                    customFields: {},
                };

                Object.keys(data).forEach((key) => {
                    if (['name', 'email', 'notes', 'isSubscribed', 'segmentId', 'createdBy'].includes(key)) {
                        (subscriber as any)[key] = data[key];
                    } else {
                        subscriber.customFields![key] = data[key];
                    }
                });

                rowsData.push({ rowCount, subscriber, data });
            })
            .on('end', async () => {
                try {
                    const processedResults = await Promise.all(
                        rowsData.map(async ({ rowCount, subscriber, data }) => {
                            const validation = await validateSubscriber(subscriber);

                            if (!validation.isValid) {
                                return {
                                    isValid: false,
                                    entry: {
                                        row: rowCount,
                                        errors: validation.errors,
                                        data: data
                                    }
                                };
                            } else {
                                subscriber.isSubscribed = true;
                                subscriber.createdBy = userId;
                                return { isValid: true, subscriber: subscriber as ISubscriber };
                            }
                        })
                    );

                    const finalValidSubscribers = processedResults
                        .filter((result): result is { isValid: true; subscriber: ISubscriber; } => result.isValid)
                        .map(result => result.subscriber);

                    const finalInvalidEntries = processedResults
                        .filter((result): result is { isValid: false; entry: { row: number; errors: string[]; data: any; }; } => !result.isValid)
                        .map(result => result.entry);

                    resolve({
                        validSubscribers: finalValidSubscribers,
                        invalidEntries: finalInvalidEntries
                    });
                } catch (error) {
                    console.error('Error processing CSV:', error);
                    reject(new Error('Error processing CSV'));
                }
            })
            .on('error', (error) => {
                console.error('Error parsing CSV:', error);
                reject(new Error(`Error parsing CSV: ${error.message}`));
            });
    });
};

const validateSubscriber = async (subscriber: Partial<ISubscriber>) => {
    const { error } = subscriberSchema.validate(subscriber, { abortEarly: false });

    let errors: string[] = [];

    if (error) {
        errors = error.details.map(detail => detail.message);
    }

    const segmentId = subscriber.segmentId;

    if (segmentId) {
        const id = typeof segmentId === 'string' ? segmentId : (segmentId as Types.ObjectId).toHexString();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            errors.push('Invalid segmentId format');
        } else {
            try {
                const segment = await Segment.findById(id);
                if (!segment) {
                    errors.push('The specified segment does not exist');
                }
            } catch (error) {
                console.error('Error checking segment:', error);
                errors.push('Error checking segment in database');
            }
        }
    }

    return { isValid: errors.length === 0, errors };
};