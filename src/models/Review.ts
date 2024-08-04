// models/Review.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
  classId: string;
  studentEmail: string;
  type: 'review' | 'tip';
  rating?: number;
  text: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
  classId: { type: String, required: true },
  studentEmail: { type: String, required: true },
  type: { type: String, enum: ['review', 'tip'], required: true },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: function(this: IReview) { 
      return this.type === 'review'; 
    } 
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;