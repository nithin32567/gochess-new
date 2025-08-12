import axios from 'axios';
import LiveSession from '../../models/Live_Session.model.js';
import { v4 as uuidv4 } from 'uuid';
import MeetingCredential from '../../models/meeting.credential.model.js';

// Zoom API configuration

const getZoomToken = async (zoomApiKey,zoomApiSecret,ZOOM_ACCOUNT_ID) => {
    
    try {
        // Create Basic Auth token
        const basicAuth = Buffer.from(`${zoomApiKey}:${zoomApiSecret}`).toString('base64');
        
        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'account_credentials',
                account_id: ZOOM_ACCOUNT_ID
            },
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });                

        if (!response.data.access_token) {
            throw new Error('No access token in response');
        }

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Zoom token:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Response Data:', error.response?.data);
        console.error('Error Message:', error.message);

        throw new Error('Failed to authenticate with Zoom API');
    }
}

const getAllZoomUsers = async (accessToken) => {
    const response = await axios.get('https://api.zoom.us/v2/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('=====================start');
    console.log(response.data.users);
    console.log('=====================');
    
    return response.data.users;
  };
  

export const getMeetings = async (req, res) => {
    const tenantId = req.user.tenant_id;
    const zoomapikey = await MeetingCredential.findOne({ tenantId:tenantId });
    
    if (!zoomapikey) {
        throw new Error('Zoom API key not found');
    }

    const ZOOM_BASE_URL = 'https://api.zoom.us/v2';

    try {
        const token = await getZoomToken(zoomapikey.zoomApiKey, zoomapikey.zoomApiSecret,zoomapikey.zoomApiId);

        // getAllZoomUsers(token)

        // const token = await getZoomToken('5sThQbk1QaelICpRZAFqRQ', 'fBQMp3vPGYM8K8Psc4yLk3XHio59oMOU','wJULhOEiSRyDYjcdzeaNyQ');
        getAllZoomUsers(token)




        
        // First get all meetings from Zoom
        const zoomResponse = await axios.get(`${ZOOM_BASE_URL}/users/me/meetings`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                page_size: 100,
                type: 'scheduled'
            }
        });

        // Get all meetings from our database
        const dbMeetings = await LiveSession.find({});

        // Create a map of Zoom meeting IDs to database meetings for quick lookup
        const dbMeetingsMap = dbMeetings.reduce((map, meeting) => {
            map[meeting.zoom_meeting_id] = meeting;
            return map;
        }, {});

        // Process only meetings that exist in both Zoom and our database
        const processedMeetings = await Promise.all(
            zoomResponse.data.meetings
                .filter(zoomMeeting => dbMeetingsMap[zoomMeeting.id])
                .map(async (zoomMeeting) => {
                    const dbMeeting = dbMeetingsMap[zoomMeeting.id];
                    const now = new Date();
                    
                    // Parse the time strings properly
                    const [startHours, startMinutes] = dbMeeting.scheduled_start_time.split(':').map(Number);
                    const [endHours, endMinutes] = dbMeeting.scheduled_end_time.split(':').map(Number);
                    
                    // Create proper date objects using the meeting's date and time
                    const startTime = new Date(zoomMeeting.start_time);
                    startTime.setHours(startHours, startMinutes, 0, 0);
                    
                    const endTime = new Date(zoomMeeting.start_time);
                    endTime.setHours(endHours, endMinutes, 0, 0);
                    
                    let updatedStatus = dbMeeting.status;

                    // Only update status if it's not already completed or cancelled
                    if (updatedStatus !== 'completed' && updatedStatus !== 'cancelled') {
                        const nowTimestamp = now.getTime();
                        const startTimestamp = startTime.getTime();
                        const endTimestamp = endTime.getTime();

                        if (nowTimestamp > endTimestamp) {
                            updatedStatus = 'completed';
                        } else if (nowTimestamp >= startTimestamp && nowTimestamp <= endTimestamp) {
                            updatedStatus = 'ongoing';
                        } else {
                            updatedStatus = 'scheduled';
                        }

                        // Update status in database if it has changed
                        if (updatedStatus !== dbMeeting.status) {
                            try {
                                await LiveSession.findByIdAndUpdate(
                                    dbMeeting._id,
                                    { 
                                        status: updatedStatus,
                                        updated_at: new Date()
                                    },
                                    { new: true }
                                );
                            } catch (updateError) {
                                console.error(`Error updating meeting status: ${updateError.message}`);
                            }
                        }
                    }

                    // Format the date from Zoom's start_time
                    const meetingDate = new Date(zoomMeeting.start_time);
                    const formattedDate = meetingDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    // console.log(dbMeeting,'zoomMeeting.start_time');
                    
                    // Return combined meeting data
                    return {
                        live_session_Id: dbMeeting.live_session_Id,
                        topic: zoomMeeting.topic,
                        agenda: dbMeeting.agenda,
                        start_time: zoomMeeting.start_time,
                        date: formattedDate,
                        duration: zoomMeeting.duration,
                        scheduled_start_time: dbMeeting.scheduled_start_time,
                        scheduled_end_time: dbMeeting.scheduled_end_time,
                        zoom_meeting_id: zoomMeeting.id,
                        passcode: zoomMeeting.password,
                        host_url: dbMeeting.host_url,
                        join_url: zoomMeeting.join_url,
                        status: updatedStatus,
                        created_at: dbMeeting.created_at,
                        updated_at: dbMeeting.updated_at
                    };
                })
        );

        res.json({ 
            meetings: processedMeetings,
            total_count: processedMeetings.length,
            zoom_meetings_count: zoomResponse.data.meetings.length,
            db_meetings_count: dbMeetings.length
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch meetings',
            details: error.message
        });
    }
}



export const createMeeting = async (req, res) => {
    const ZOOM_BASE_URL = 'https://api.zoom.us/v2';
    try {
        console.log('Creating new meeting with data:', req.body);
        const tenantId = req.user.tenant_id;
        const zoomapikey = await MeetingCredential.findOne({ tenantId:tenantId });
        const token = await getZoomToken(zoomapikey.zoomApiKey,zoomapikey.zoomApiSecret,zoomapikey.zoomApiId);
        const { topic, start_time, duration, settings, agenda } = req.body;

        const meetingData = {
            topic,
            type: 2, // Scheduled meeting
            start_time,
            duration,
            timezone: "UTC",
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
                mute_upon_entry: true,
                waiting_room: true,
                meeting_authentication: true, // Enable meeting authentication
                // auto_recording: "cloud",
                auto_recording: "local",
                

                ...settings
            },
            password_type: 1 // 1 for numeric passcode
        };

        const response = await axios.post(`${ZOOM_BASE_URL}/users/me/meetings`, meetingData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data,'its from server');
        
        // Ensure we have the passcode in the response
        const meetingResponse = {
            ...response.data,
            password: response.data.passcode || response.data.passcode || 'No passcode set'
        };
        // console.log('Successfully created meeting with passcode');
        const dateObj = new Date(start_time);

        // Local date
        const localTime = dateObj.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }); // "HH:mm" format
        console.log('duration',duration,typeof duration);
        
        const end_time = new Date(start_time);
        end_time.setMinutes(end_time.getMinutes() + response.data.duration);
        const end_time_local = end_time.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        console.log(localTime,'localTime');
        console.log(end_time_local,'end_time_local');


        
        const liveSessionData = {
            topic,
            start_time,
            duration,
            agenda,
            zoom_meeting_id: response.data.id,
            passcode: response.data.password,
            host_url: response.data.start_url,
            join_url: response.data.join_url,
            status: 'scheduled',
            zoom_host_id: response.data.host_id,
            scheduled_start_time: localTime,
            scheduled_end_time: end_time_local,
        };
        const liveSession = await LiveSession.create(liveSessionData);
        liveSession.save();
        console.log(liveSession,'liveSession');
        res.json({
            live_session_Id: liveSession.live_session_Id,
            topic: liveSession.topic,
            agenda: liveSession.agenda,
            start_time: liveSession.start_time,
            date: start_time,
            duration: duration,
            scheduled_start_time: liveSession.scheduled_start_time,
            scheduled_end_time: liveSession.scheduled_end_time,
            zoom_meeting_id: liveSession.zoom_host_id,
            passcode: liveSession.passcode,
            host_url: liveSession.host_url,
            join_url: liveSession.join_url,
            status: liveSession.status
        });
    } catch (error) {
        console.error('Error creating meeting:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to create meeting',
            details: error.response?.data || error.message
        });
    }
}



export const updateMeeting = async (req, res) => {
    const ZOOM_BASE_URL = 'https://api.zoom.us/v2';

    try {
        console.log('Updating meeting:', req.params.meetingId, req.body);
        const tenantId = req.user.tenant_id;
        const zoomapikey = await MeetingCredential.findOne({ tenantId:tenantId });
        const token = await getZoomToken(zoomapikey.zoomApiKey,zoomapikey.zoomApiSecret);
        const { meetingId } = req.params;
        const { topic, agenda, start_time, duration, settings, status } = req.body;

        // Prepare the update data
        const updateData = {
            topic,
            agenda,
            start_time,
            duration: parseInt(duration),
            settings: {
                host_video: settings.host_video,
                participant_video: settings.participant_video,
                join_before_host: settings.join_before_host,
                mute_upon_entry: settings.mute_upon_entry,
                waiting_room: settings.waiting_room,
                enable_chat: settings.enable_chat
            }
        };

        // Update meeting in Zoom
        const zoomResponse = await axios.patch(
            `${ZOOM_BASE_URL}/meetings/${meetingId}`,
            updateData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        // console.log(zoomResponse.data,'zoomResponse');
        const dateObj = new Date(start_time);

        // Local date
        const localTime = dateObj.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }); // "HH:mm" format
        // console.log('duration',duration,typeof duration);
        
        const end_time = new Date(start_time);
        end_time.setMinutes(end_time.getMinutes() + duration);
        const end_time_local = end_time.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        // Update meeting in database
        const updatedMeeting = await LiveSession.updateOne(
            {zoom_meeting_id: meetingId},
            {
                topic,
                agenda,
                duration,
                settings,
                status,
                zoom_meeting_id: meetingId,
                scheduled_start_time: localTime,
                scheduled_end_time: end_time_local,
            },
        );
        console.log(updatedMeeting,'updatedMeeting');
        

        if (!updatedMeeting) {
            return res.status(404).json({ error: 'Meeting not found in database' });
        }

        console.log('Successfully updated meeting');
        res.json({
            ...zoomResponse.data,
            ...updatedMeeting
        });
    } catch (error) {
        console.error('Error updating meeting:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to update meeting',
            details: error.response?.data || error.message
        });
    }
};

