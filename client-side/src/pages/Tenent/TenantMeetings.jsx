import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaVideo, FaPlus, FaSearch, FaClock, FaUser, FaChevronLeft, FaChevronRight, FaCog } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import Popup from "../../components/popup";
export default function TenantMeetings() {
 const [meetings, setMeetings] = useState([]);
 const [filteredMeetings, setFilteredMeetings] = useState([]);
 const [showCreateModal, setShowCreateModal] = useState(false);
 const [showSettingsModal, setShowSettingsModal] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
 const [loading, setLoading] = useState(false);
 const [selectedMeeting, setSelectedMeeting] = useState(null);
 const cardsPerPage = 6;
 const [newMeeting, setNewMeeting] = useState({
  topic: '',
  agenda: '',
  date: '',
  time: '',
  duration: '60',
  host_video: true,
  participant_video: true,
  join_before_host: false,
  mute_upon_entry: true,
  waiting_room: true,
  enable_chat: true
 });
 const [filters, setFilters] = useState({
  search: '',
  status: 'all',
  dateRange: 'all',
  timeRange: 'all'
 });
 const API_URL = import.meta.env.VITE_API_URL;
 const [settings, setSettings] = useState({
  host_video: true,
  participant_video: true,
  join_before_host: false,
  mute_upon_entry: true,
  waiting_room: true,
  enable_chat: true
 });
 const [showEditModal, setShowEditModal] = useState(false);
 const [editingMeeting, setEditingMeeting] = useState(null);
 const [editForm, setEditForm] = useState({
  topic: '',
  agenda: '',
  date: '',
  time: '',
  duration: '60',
  host_video: true,
  participant_video: true,
  join_before_host: false,
  mute_upon_entry: true,
  waiting_room: true,
  enable_chat: true,
  status: 'scheduled'
 });

 const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString('en-US', {
   year: 'numeric',
   month: 'short',
   day: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
   hour: '2-digit',
   minute: '2-digit',
   hour12: true
  });
  return { formattedDate, formattedTime, date };
 };

 const isMeetingPast = (meetingTime) => {
  const now = new Date();
  const meetingDate = new Date(meetingTime);
  return meetingDate < now;
 };

 useEffect(() => {
  fetchMeetings();
 }, []);

 useEffect(() => {
  filterMeetings();
 }, [meetings, filters]);

 const filterMeetings = () => {
  let filtered = [...meetings];

  // Search filter
  if (filters.search) {
   filtered = filtered.filter(meeting =>
    meeting.topic.toLowerCase().includes(filters.search.toLowerCase())
   );
  }

  // Status filter
  if (filters.status !== 'all') {
   filtered = filtered.filter(meeting => meeting.status === filters.status);
  }

  // Date range filter
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (filters.dateRange) {
   case 'today':
    filtered = filtered.filter(meeting => {
     const meetingDate = new Date(meeting.start_time);
     return meetingDate.toDateString() === today.toDateString();
    });
    break;
   case 'week': {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    filtered = filtered.filter(meeting => {
     const meetingDate = new Date(meeting.start_time);
     return meetingDate >= weekStart && meetingDate <= weekEnd;
    });
    break;
   }
   case 'month': {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    filtered = filtered.filter(meeting => {
     const meetingDate = new Date(meeting.start_time);
     return meetingDate >= monthStart && meetingDate <= monthEnd;
    });
    break;
   }
  }

  // Time range filter
  if (filters.timeRange !== 'all') {
   filtered = filtered.filter(meeting => {
    const meetingTime = new Date(meeting.start_time).getHours();
    switch (filters.timeRange) {
     case 'morning':
      return meetingTime >= 6 && meetingTime < 12;
     case 'afternoon':
      return meetingTime >= 12 && meetingTime < 17;
     case 'evening':
      return meetingTime >= 17 && meetingTime < 22;
     default:
      return true;
    }
   });
  }

  // Sort meetings by date in ascending order
  filtered.sort((a, b) => {
   const aDate = new Date(a.start_time);
   const bDate = new Date(b.start_time);
   return bDate - aDate; // Sort in ascending order (earliest date first)
  });

  setFilteredMeetings(filtered);
  setCurrentPage(1); // Reset to first page when filters change
 };

 const fetchMeetings = async () => {
  try {
   const response = await axios.get(`${API_URL}/tenants/meetings`, { withCredentials: true });
   console.log(response.data, 'response');

   setMeetings(response.data.meetings);
  } catch (error) {
   console.log('Failed to fetch meetings', error);
  }
 };

 const handleCreateMeeting = async (e) => {
  e.preventDefault();
  // console.log(newMeeting,'newMeeting');

  try {
   setLoading(true);
   const localDateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
   const startTime = localDateTime.toISOString(); // e.g., 2025-06-02T11:45:00.000Z
   console.log(startTime, 'startTime');
   const newmeetingData = {
    topic: newMeeting.topic,
    start_time: startTime,
    agenda: newMeeting.agenda,
    duration: newMeeting.duration,
    settings: {
     host_video: newMeeting.host_video,
     participant_video: newMeeting.participant_video,
     join_before_host: newMeeting.join_before_host,
     mute_upon_entry: newMeeting.mute_upon_entry,
     waiting_room: newMeeting.waiting_room
    }
   };
   const response = await axios.post(`${API_URL}/tenants/create_meetings`, newmeetingData, { withCredentials: true });
   console.log(response.data, 'response');
   setMeetings([...meetings, response.data]);
   setShowCreateModal(false);
   setNewMeeting({
    topic: '',
    agenda: '',
    date: '',
    time: '',
    duration: '60',
    host_video: true,
    participant_video: true,
    join_before_host: false,
    mute_upon_entry: true,
    waiting_room: true,
    enable_chat: true
   });
  } catch (error) {
   console.error('Failed to create meeting:', error);
  } finally {
   setLoading(false);
  }
 };

 const handleUpdateSettings = async (e) => {
  e.preventDefault();
  try {
   setLoading(true);
   const updatedMeeting = {
    ...selectedMeeting,
    ...settings
   };

   await axios.put(`${API_URL}/tenants/meetings/${selectedMeeting.id}`, updatedMeeting, { withCredentials: true });

   setMeetings(meetings.map(meeting =>
    meeting.id === selectedMeeting.id ? updatedMeeting : meeting
   ));

   setShowSettingsModal(false);
   setSelectedMeeting(null);
  } catch (error) {
   console.error('Failed to update meeting settings:', error);
  } finally {
   setLoading(false);
  }
 };

 const openSettingsModal = (meeting) => {
  setSelectedMeeting(meeting);
  setSettings({
   host_video: meeting.host_video,
   participant_video: meeting.participant_video,
   join_before_host: meeting.join_before_host,
   mute_upon_entry: meeting.mute_upon_entry,
   waiting_room: meeting.waiting_room,
   enable_chat: meeting.enable_chat
  });
  setShowSettingsModal(true);
 };

 const handleSettingChange = (setting) => (e) => {
  setSettings(prev => ({
   ...prev,
   [setting]: e.target.checked
  }));
 };

 // Calculate pagination
 const indexOfLastCard = currentPage * cardsPerPage;
 const indexOfFirstCard = indexOfLastCard - cardsPerPage;
 const currentCards = filteredMeetings.slice(indexOfFirstCard, indexOfLastCard);
 const totalPages = Math.ceil(filteredMeetings.length / cardsPerPage);

 const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
 };

 const openEditModal = (meeting) => {
  const meetingDate = new Date(meeting.start_time);
  setEditingMeeting(meeting);
  setEditForm({
   topic: meeting.topic,
   agenda: meeting.agenda,
   date: meetingDate.toISOString().split('T')[0],
   time: meetingDate.toTimeString().slice(0, 5),
   duration: meeting.duration,
   host_video: meeting.settings?.host_video || true,
   participant_video: meeting.settings?.participant_video || true,
   join_before_host: meeting.settings?.join_before_host || false,
   mute_upon_entry: meeting.settings?.mute_upon_entry || true,
   waiting_room: meeting.settings?.waiting_room || true,
   enable_chat: meeting.settings?.enable_chat || true,
   status: meeting.status || 'scheduled'
  });
  setShowEditModal(true);
 };

 const handleEditMeeting = async (e) => {
  e.preventDefault();
  try {
   setLoading(true);
   const localDateTime = new Date(`${editForm.date}T${editForm.time}`);
   const startTime = localDateTime.toISOString();

   const updatedMeetingData = {
    topic: editForm.topic,
    start_time: startTime,
    agenda: editForm.agenda,
    duration: parseInt(editForm.duration),
    status: editForm.status,
    settings: {
     host_video: editForm.host_video,
     participant_video: editForm.participant_video,
     join_before_host: editForm.join_before_host,
     mute_upon_entry: editForm.mute_upon_entry,
     waiting_room: editForm.waiting_room,
     enable_chat: editForm.enable_chat
    }
   };

   await axios.put(
    `${API_URL}/tenants/edit_meetings/${editingMeeting.zoom_meeting_id}`,
    updatedMeetingData,
    { withCredentials: true }
   );

   // Fetch fresh data after successful update
   await fetchMeetings();

   // Close the modal and reset state
   setShowEditModal(false);
   setEditingMeeting(null);
   setEditForm({
    topic: '',
    agenda: '',
    date: '',
    time: '',
    duration: '60',
    host_video: true,
    participant_video: true,
    join_before_host: false,
    mute_upon_entry: true,
    waiting_room: true,
    enable_chat: true,
    status: 'scheduled'
   });
  } catch (error) {
   console.error('Failed to update meeting:', error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <main className="container-wrapper-scroll">
   <section className={`addcourse ${showEditModal || showCreateModal || showSettingsModal ? 'opacity-50 pointer-events-none' : ''}`}>
    <div className="container-fluid">
     <div className="row justify-content-center">
      <div className="col-xl-2 col-lg-3 col-md-4">
       <button
        className="addnewcourse-btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() => setShowCreateModal(true)}
       >
        <i className="fa-solid fa-plus" /> Create New Session
       </button>
      </div>
     </div>
    </div>
   </section>

   <section className={`search-section pt-3 ${showEditModal || showCreateModal || showSettingsModal ? 'opacity-50 pointer-events-none' : ''}`}>
    <div className="container-fluid">
     <div className="row">
      <div className="col-xl-6 col-lg-6 col-sm-12 pb-sm-3">
       <div className="search-course">
        <input
         type="text"
         placeholder="Search meetings..."
         value={filters.search}
         onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <button>
         <i className="fa-solid fa-magnifying-glass" />
        </button>
       </div>
      </div>
      <div className="col-xl-2 col-lg-2 col-sm-4">
       <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
       >
        <option value="all">All Sessions</option>
        <option value="scheduled">Scheduled</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
       </select>
      </div>

      <div className="col-xl-2 col-lg-2 col-sm-4">
       <select
        value={filters.dateRange}
        onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
       >
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
       </select>
      </div>

      <div className="col-xl-2 col-lg-2 col-sm-4">
       <select
        value={filters.timeRange}
        onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
       >
        <option value="all">All Times</option>
        <option value="morning">Morning (6 AM - 12 PM)</option>
        <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
        <option value="evening">Evening (5 PM - 10 PM)</option>
       </select>
      </div>
     </div>
    </div>
   </section>

   <section className="createcourse-wrapper ourcourse-page">
    <div className="container-fluid">
     <div className="row">
      {currentCards.map((meeting, index) => {
       const isPast = isMeetingPast(meeting.start_time);
       return (
        <div key={index} className="col-xl-3 col-lg-3 col-sm-6">
         <div className="d-flex align-items-start justify-content-between mb-4">
          <h3 className="text-lg fw-bold text-secondary">{meeting.topic}</h3>
          <span className={`px-3 py-1 rounded-2 text-sm`}
           style={meeting.status === 'completed' || meeting.status === 'cancelled' ? {
            backgroundColor: "#666",
            color: "#222"
           } : meeting.status === 'ongoing' ? {
            backgroundColor: "#448",
            color: "#002"
           } : {
            backgroundColor: "#484",
            color: "#020"
           }}
          >
           {meeting.status === 'ongoing' ? 'Ongoing' :
            meeting.status === 'completed' ? 'Completed' :
             meeting.status === 'cancelled' ? 'Cancelled' : 'Scheduled'}
          </span>
         </div>

         <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2 text-secondary">
           <FaCalendarAlt />
           <span>{meeting.date}</span>
          </div>
          <div className="d-flex align-items-center gap-2 text-secondary">
           <FaClock />
           <span>{meeting.scheduled_start_time} - {meeting.scheduled_end_time}</span>
          </div>
          <div className="d-flex align-items-center gap-2 text-secondary">
           <FaUser />
           <span>{meeting.duration} minutes</span>
          </div>
          {meeting.agenda && (
           <div className="d-flex align-items-center gap-2 text-secondary">
            <span style={{ marginTop: "1px" }}>📝</span>
            <span className="text-sm">{meeting.agenda}</span>
           </div>
          )}
         </div>

         <div className="mt-4 d-flex gap-2">
          {meeting.status === 'scheduled' && (
           <>
            <a href={meeting.host_url} target="_blank" rel="noopener noreferrer">
             <button className="btn btn-primary">
              Start Session
             </button>
            </a>
            <button
             onClick={() => openEditModal(meeting)}
             className="btn btn-secondary"
            >
             Edit
            </button>
           </>
          )}
          {meeting.status === 'ongoing' && (
           <a href={meeting.host_url} target="_blank" rel="noopener noreferrer">
            <button className="btn btn-primary">
             Join Now
            </button>
           </a>
          )}
          {meeting.status === 'completed' && (
           <button
            onClick={() => openEditModal(meeting)}
            disabled={true}
            className="btn btn-secondary"
           >
            Meeting Completed
           </button>
          )}
          {meeting.status === 'cancelled' && (
           <button
            className="btn btn-danger"
            disabled
           >
            Cancelled Meeting
           </button>
          )}
         </div>
        </div>
       );
      })}
     </div>
    </div>
    {totalPages > 1 && (
     <div className="flex justify-center items-center gap-2 mt-8">
      <button
       onClick={() => handlePageChange(currentPage - 1)}
       disabled={currentPage === 1}
       className={`btn ${currentPage === 1
        ? 'btn-secondary disabled'
        : 'btn-primary'
        }`}
      >
       <FaChevronLeft />
      </button>

      {[...Array(totalPages)].map((_, index) => (
       <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={`btn ${currentPage === index + 1
         ? 'btn-primary text-white'
         : 'btn-secondary'
         }`}
       >
        {index + 1}
       </button>
      ))}

      <button
       onClick={() => handlePageChange(currentPage + 1)}
       disabled={currentPage === totalPages}
       className={`btn ${currentPage === totalPages
        ? 'btn-secondary disabled'
        : 'btn-primary'
        }`}
      >
       <FaChevronRight />
      </button>
     </div>
    )}
   </section>

   {showCreateModal && (
    <Popup>
     <h1 className="modal-title">Create New Meeting</h1>
     <button
      type="button"
      className="btn-close"
      data-bs-dismiss="modal"
      aria-label="Close"
      onClick={() => setShowCreateModal(false)}
     >
      <i className="fa-solid fa-xmark" />
     </button>

     <form onSubmit={handleCreateMeeting} className="space-y-4">
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
       <input
        type="text"
        value={newMeeting.topic}
        onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })}
        required
        placeholder="Enter meeting topic"
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
       <input
        type="number"
        min="1"
        value={newMeeting.duration}
        onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
        required
        placeholder="Enter duration in minutes"
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
       <input
        type="date"
        value={newMeeting.date}
        onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
        required
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
       <input
        type="time"
        value={newMeeting.time}
        onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
        required
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
       <textarea
        value={newMeeting.agenda}
        onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
        required
        placeholder="Enter meeting agenda"
        rows="2" />
      </div>
      <h5 className="py-2">Meeting Settings</h5>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Host Video</label>
       <input
        id="host_video"
        type="checkbox"
        checked={newMeeting.host_video}
        onChange={(e) => setNewMeeting({ ...newMeeting, host_video: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Participant Video</label>
       <input
        id="host_video"
        type="checkbox"
        checked={newMeeting.participant_video}
        onChange={(e) => setNewMeeting({ ...newMeeting, participant_video: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Join Before Host</label>
       <input
        id="host_video"
        type="checkbox"
        checked={newMeeting.join_before_host}
        onChange={(e) => setNewMeeting({ ...newMeeting, join_before_host: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Mute Upon Entry</label>
       <input
        id="host_video"
        type="checkbox"
        checked={newMeeting.mute_upon_entry}
        onChange={(e) => setNewMeeting({ ...newMeeting, mute_upon_entry: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Waiting Room</label>
       <input
        id="host_video"
        type="checkbox"
        checked={newMeeting.waiting_room}
        onChange={(e) => setNewMeeting({ ...newMeeting, waiting_room: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Enable Chat</label>
       <input
        id="host_video"
        type="checkbox"
        checked={newMeeting.enable_chat}
        onChange={(e) => setNewMeeting({ ...newMeeting, enable_chat: e.target.checked })}
       />
      </div>

      <div className="row justify-content-center">
       <div className="col-lg-4">
        <button
         type="button"
         onClick={() => setShowCreateModal(false)}
         className="addtrainer-btn">
         Cancel
        </button>
       </div>
       <div className="col-lg-4">
        <button
         disabled={loading}
         type="submit"
         className="addtrainer-btn">
         {loading ? 'Creating...' : 'Create Meeting'}
        </button>
       </div>
      </div>
     </form>
    </Popup>
   )}

   {showEditModal && editingMeeting && (
    <Popup>
     <h1 className="modal-title">Edit Meeting</h1>
     <button
      type="button"
      className="btn-close"
      data-bs-dismiss="modal"
      aria-label="Close"
      onClick={() => {
       setShowEditModal(false);
       setEditingMeeting(null);
      }}
     >
      <i className="fa-solid fa-xmark" />
     </button>
     <form onSubmit={handleEditMeeting} className="space-y-4">
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Topic</label>
       <input
        type="text"
        value={editForm.topic}
        onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
        required
        placeholder="Enter meeting topic"
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
       <input
        type="number"
        min="1"
        value={editForm.duration}
        onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
        required
        placeholder="Enter duration in minutes"
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
       <input
        type="date"
        value={editForm.date}
        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
        required
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
       <input
        type="time"
        value={editForm.time}
        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
        required
       />
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
       <select
        value={editForm.status}
        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
       >
        <option value="scheduled">Scheduled</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
       </select>
      </div>
      <div className="trainer-input-item">
       <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
       <textarea
        value={editForm.agenda}
        onChange={(e) => setEditForm({ ...editForm, agenda: e.target.value })}
        required
        placeholder="Enter meeting agenda"
        rows="2"
       >{editForm.agenda}</textarea>
      </div>
      <h5 className="py-2">Meeting Settings</h5>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Host Video</label>
       <input
        id="host_video"
        type="checkbox"
        checked={editForm.host_video}
        onChange={(e) => setEditForm({ ...editForm, host_video: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Participant Video</label>
       <input
        id="host_video"
        type="checkbox"
        checked={editForm.participant_video}
        onChange={(e) => setEditForm({ ...editForm, participant_video: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Join Before Host</label>
       <input
        id="host_video"
        type="checkbox"
        checked={editForm.join_before_host}
        onChange={(e) => setEditForm({ ...editForm, join_before_host: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Mute Upon Entry</label>
       <input
        id="host_video"
        type="checkbox"
        checked={editForm.mute_upon_entry}
        onChange={(e) => setEditForm({ ...editForm, mute_upon_entry: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Waiting Room</label>
       <input
        id="host_video"
        type="checkbox"
        checked={editForm.waiting_room}
        onChange={(e) => setEditForm({ ...editForm, waiting_room: e.target.checked })}
       />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       <label htmlFor="host_video" className="text-sm font-medium text-secondary">Enable Chat</label>
       <input
        id="host_video"
        type="checkbox"
        checked={editForm.enable_chat}
        onChange={(e) => setEditForm({ ...editForm, enable_chat: e.target.checked })}
       />
      </div>
      <div className="row justify-content-center">
       <div className="col-lg-4">
        <button
         type="button"
         onClick={() => {
          setShowEditModal(false);
          setEditingMeeting(null);
         }}
         className="addtrainer-btn">
         Cancel
        </button>
       </div>
       <div className="col-lg-4">
        <button
         disabled={loading}
         type="submit"
         className="addtrainer-btn">
         {loading ? 'Updating...' : 'Update Meeting'}
        </button>
       </div>
      </div>

     </form>
    </Popup>
   )}
  </main>
 );
}   