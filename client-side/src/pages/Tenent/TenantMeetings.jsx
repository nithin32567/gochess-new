import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaVideo, FaPlus, FaSearch, FaClock, FaUser, FaChevronLeft, FaChevronRight, FaCog } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
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
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filtered = filtered.filter(meeting => {
          const meetingDate = new Date(meeting.start_time);
          return meetingDate >= weekStart && meetingDate <= weekEnd;
        });
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filtered = filtered.filter(meeting => {
          const meetingDate = new Date(meeting.start_time);
          return meetingDate >= monthStart && meetingDate <= monthEnd;
        });
        break;
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
      console.log(response.data,'response');
      
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
      console.log(startTime,'startTime');
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
const response = await axios.post(`${API_URL}/tenants/create_meetings`, newmeetingData,{ withCredentials: true });
console.log(response.data,'response');
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
    <div className="bg-gray-50 p-6 w-full h-full">
      {/* Header */}
      <div className={`flex justify-between items-center mb-8 ${showEditModal || showCreateModal || showSettingsModal ? 'opacity-50 pointer-events-none' : ''}`}>
        <h1 className="text-2xl font-bold text-gray-800">Live Sessions</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Create New Session
        </button>
      </div>

      {/* Search and Filter */}
      <div className={`mb-6 space-y-4 ${showEditModal || showCreateModal || showSettingsModal ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sessions</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex gap-4">
          <select 
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select 
            value={filters.timeRange}
            onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Times</option>
            <option value="morning">Morning (6 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 10 PM)</option>
          </select>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${showEditModal || showCreateModal || showSettingsModal ? 'opacity-50 pointer-events-none' : ''}`}>
        {currentCards.map((meeting,index) => {
          const isPast = isMeetingPast(meeting.start_time);
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{meeting.topic}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  meeting.status === 'completed' || meeting.status === 'cancelled'
                    ? 'bg-gray-100 text-gray-800' 
                    : meeting.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {meeting.status === 'ongoing' ? 'Ongoing' : 
                   meeting.status === 'completed' ? 'Completed' :
                   meeting.status === 'cancelled' ? 'Cancelled' : 'Scheduled'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt />
                  <span>{meeting.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock />
                  <span>{meeting.scheduled_start_time} - {meeting.scheduled_end_time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUser />
                  <span>{meeting.duration} minutes</span>
                </div>
                {meeting.agenda && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <span className="mt-[1px]">📝</span>
                    <span className="text-sm">{meeting.agenda}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                {meeting.status === 'scheduled' && (
                  <>
                    <a href={meeting.host_url} target="_blank" rel="noopener noreferrer">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Start Session
                      </button>
                    </a>
                    <button 
                      onClick={() => openEditModal(meeting)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                  </>
                )}
                {meeting.status === 'ongoing' && (
                  <a href={meeting.host_url} target="_blank" rel="noopener noreferrer">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Join Now 
                    </button>
                  </a>
                )}
                {meeting.status === 'completed' && (
                  <button 
                    onClick={() => openEditModal(meeting)}
                    disabled={true}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    Meeting Completed
                  </button>
                )}
                {meeting.status === 'cancelled' && (
                  <button 
                    className="w-full px-4 py-2 bg-red-100 text-red-800 rounded-lg cursor-not-allowed"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaChevronLeft />
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Meeting</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Topic</label>
                  <input
                    type="text"
                    value={newMeeting.topic}
                    onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter meeting topic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter duration in minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
                  <textarea
                    value={newMeeting.agenda}
                    onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter meeting agenda"
                    rows="2"
                  />
                </div>
              </div>

              {/* Settings Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Meeting Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Host Video</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMeeting.host_video}
                        onChange={(e) => setNewMeeting({ ...newMeeting, host_video: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Participant Video</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMeeting.participant_video}
                        onChange={(e) => setNewMeeting({ ...newMeeting, participant_video: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Join Before Host</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMeeting.join_before_host}
                        onChange={(e) => setNewMeeting({ ...newMeeting, join_before_host: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Mute Upon Entry</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMeeting.mute_upon_entry}
                        onChange={(e) => setNewMeeting({ ...newMeeting, mute_upon_entry: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Waiting Room</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMeeting.waiting_room}
                        onChange={(e) => setNewMeeting({ ...newMeeting, waiting_room: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Enable Chat</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newMeeting.enable_chat}
                        onChange={(e) => setNewMeeting({ ...newMeeting, enable_chat: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Edit Meeting Modal */}
      {showEditModal && editingMeeting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-opacity-30"></div>
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl relative z-50 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Meeting</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMeeting(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditMeeting} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Topic</label>
                  <input
                    type="text"
                    value={editForm.topic}
                    onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter meeting topic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter duration in minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agenda</label>
                  <textarea
                    value={editForm.agenda}
                    onChange={(e) => setEditForm({ ...editForm, agenda: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter meeting agenda"
                    rows="2"
                  >{editForm.agenda}</textarea>
                </div>
              </div>

              {/* Settings Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Meeting Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Host Video</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.host_video}
                        onChange={(e) => setEditForm({ ...editForm, host_video: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Participant Video</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.participant_video}
                        onChange={(e) => setEditForm({ ...editForm, participant_video: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Join Before Host</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.join_before_host}
                        onChange={(e) => setEditForm({ ...editForm, join_before_host: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Mute Upon Entry</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.mute_upon_entry}
                        onChange={(e) => setEditForm({ ...editForm, mute_upon_entry: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Waiting Room</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.waiting_room}
                        onChange={(e) => setEditForm({ ...editForm, waiting_room: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Enable Chat</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.enable_chat}
                        onChange={(e) => setEditForm({ ...editForm, enable_chat: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMeeting(null);

                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}   