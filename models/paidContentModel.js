import mongoose from "mongoose";

const paidContentSchema = new mongoose.Schema(
  {
    // Content Name (Short Notes, Master Package etc.)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Price of Content
    price: {
      type: Number,
      required: true,
    },

    // Coupon Code (Optional)
    coupons: [
      {
        code: {
          type: String,
          trim: true,
        },
        discountPercent: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Purchase Date
    boughtDate: {
      type: Date,
      default: Date.now,
    },

    // Validity Expiry Date
    validTill: {
      type: Date,
      required: true,
    },

    // Content Type (PDF, TestSeries, Video, Package etc.)
    contentType: {
      type: String,
      required: true,
      enum: ["SHORT_NOTES", "TEST_SERIES", "FORMULA_SHEET", "PYQ", "TOP_500_QS" , "MASTER_PACKAGE"],
    },
  },
  { timestamps: true }
);

const PaidContent = mongoose.model("PaidContent", paidContentSchema);

export default PaidContent;
