import mongoose from "mongoose";

const AlertsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assertType: {
        type: String,
        required: true
    },
    assertValue: {
        type: Number,
        required: true
    }
})

const Alerts = mongoose.model("Alerts", AlertsSchema)

export default Alerts