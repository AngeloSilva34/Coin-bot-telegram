import {Schema, model, Document, Types} from "mongoose";

export interface iAlert extends Document {
    user: Types.ObjectId,
    telegramId: number,
    asset: string,
    value: number,
    validity: Date,
    createdAt: Date
}

const AlertsSchema = new Schema<iAlert>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    telegramId: {
        type: Number,
        required: true,
        index: true
    },
    asset: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    validity: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Alerts = model("Alerts", AlertsSchema)

export default Alerts