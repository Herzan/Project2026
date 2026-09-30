const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    assignee: {
      type: String,
      trim: true,
      default: 'Unassigned'
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true, // adds createdAt / updatedAt
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Task', taskSchema);
