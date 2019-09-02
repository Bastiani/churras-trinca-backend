import mongoose, { Document, Model } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

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
    },
    user: {
      type: ObjectId,
      ref: 'User',
      description: 'User created this',
      required: true,
      index: true,
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
  description?: string;
  observation?: string;
  total: string;
  user: string;
  active: boolean;
}

const BarbecueModel: Model<IBarbecue> = mongoose.model('Barbecue', schema);

export default BarbecueModel;
