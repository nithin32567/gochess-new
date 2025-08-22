import mongoose from 'mongoose';

const liveSessionSchema = new mongoose.Schema({
    live_session_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: function() {
            return this._id;
        }
    },
    zoom_meeting_id: {
        type: String,
        required: true,
        unique: true
    },
    zoom_host_id: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    agenda: {
        type: String,
        required: true
    },
    scheduled_start_time: {
        type: String,
        required: true
    },
    scheduled_end_time: {
        type: String,
        required: true
    },
    host_url: {
        type: String,
        required: true
    },
    join_url: {
        type: String,
        required: true
    },
    passcode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'scheduled', 'cancelled'],
        default: 'scheduled',
        required: true
    },
    meeting_duration_completed:{
        type:String
    },
    meeting_participants_count:{
        type:Number
    }

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Create indexes for better query performance
// liveSessionSchema.index({ live_session_Id: 1 }, { unique: true });
// liveSessionSchema.index({ zoom_meeting_id: 1 });
// liveSessionSchema.index({ zoom_host_id: 1 });
// liveSessionSchema.index({ status: 1 });

const LiveSession = mongoose.model('LiveSession', liveSessionSchema);

export default LiveSession;
