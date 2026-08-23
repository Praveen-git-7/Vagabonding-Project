const mongoose = require("mongoose");
const Schema = mongoose.Schema;   //Just for making short name
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
         filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: "https://i.pinimg.com/564x/a9/54/84/a954847d9beefce654db167f73cbeef2.jpg",
            set: (v) => v === "" ? "https://i.pinimg.com/564x/a9/54/84/a954847d9beefce654db167f73cbeef2.jpg" : v,
        },
    },
    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    attractions: {
        type: [String],
        required: false
    },
});


listingSchema.post("findOneAndDelete", async(listing) => {
    //Here, this will work whenever findOneAndDelete is called, and it's directly as we know that findByIdAndDelete internally calls findOneAndDelete that's why when we press delte btn in listing it gets called and deletes all it's reviews as well by finding there ids
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;