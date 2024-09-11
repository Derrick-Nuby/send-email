import { ISubscriber } from "../types/subscriber.js";
import Subscriber from "../models/subscriber.js";

export const getUserSubscribers = async (userId: string) => {
    try {

        const subscribers: ISubscriber[] = await Subscriber.find({ createdBy: userId });

        if (subscribers.length <= 0) {
            return [];
        }

        return subscribers;

    } catch (error) {
        console.error("Error fetching user subscribers:", error);
        return [];
    }
};

export const getSubscribersBySegment = async (userId: string, segmentId: string) => {
    try {

        const subscribers: ISubscriber[] = await Subscriber.find({ segmentId, createdBy: userId });

        if (subscribers.length <= 0) {
            return [];
        }

        return subscribers;

    } catch (error) {
        console.error("Error fetching subscribers by segment:", error);
        return [];
    }
};