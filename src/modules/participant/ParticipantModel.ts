import mongoose, { Document, Model } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    participant: {
      type: ObjectId,
      ref: 'User',
      description: 'User participating',
      required: true,
      index: true,
    },
    total: {
      type: Number,
      required: false,
      description: 'Value to contribute',
      default: 0,
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
    collection: 'Participant',
  },
);

export interface IParticipant extends Document {
  participant: string;
  total: number;
  active: boolean;
}

const ParticipantModel: Model<IParticipant> = mongoose.model('Participant', schema);

export default ParticipantModel;
