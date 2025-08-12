import React from "react";
import { MdSchool, MdVideoCall, MdEvent } from "react-icons/md";

// Statistics Cards
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center w-64">
      <div className={`mb-4 text-3xl ${color}`}>{icon}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

const fakeStats = [
  {
    icon: <MdSchool className="w-8 h-8" />,
    label: "My Courses",
    value: 8,
    color: "text-blue-600",
  },
  {
    icon: <MdVideoCall className="w-8 h-8" />,
    label: "Live Sessions",
    value: 3,
    color: "text-orange-600",
  },
  {
    icon: <MdEvent className="w-8 h-8" />,
    label: "Upcoming Events",
    value: 2,
    color: "text-green-600",
  },
];

export default function InstructorDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Instructor!</h2>
        <p className="text-gray-600">Here's an overview of your teaching activities.</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fakeStats.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MdSchool className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">New student enrolled in your course</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Sessions</h2>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <MdVideoCall className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Live Session: React Basics</p>
                  <p className="text-sm text-gray-600">Today, 10:00 AM</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Join Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
