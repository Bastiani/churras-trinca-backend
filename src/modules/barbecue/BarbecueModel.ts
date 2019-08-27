import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    observation: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Barbecue',
  },
);

export interface IBarbecue extends Document {
  date: Date;
  description: string;
  observation: string;
  active: boolean;
}

const BarbecueModel: Model<IBarbecue> = mongoose.model('Barbecue', schema);

export default BarbecueModel;
