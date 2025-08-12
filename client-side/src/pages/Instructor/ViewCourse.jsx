import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewCourseInstructor() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    console.log('page loaded');
    
    const API_URL = import.meta.env.VITE_API_URL;
    console.log("ViewCourse", API_URL);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/instructors/instructor-courses`, {
                    withCredentials: true
                });
                console.log('res', response);
                
                if (response.data.success) {
                    setCourses(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError(error.response?.data?.message || 'Failed to fetch courses');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourses();
    }, [API_URL]);

    if (loading) {
        return <div className="p-8">Loading courses...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">My Courses</h1>
            {courses.length === 0 ? (
                <div className="text-gray-600">No courses found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2">{course.course_title}</h2>
                            <p className="text-gray-600 mb-4">{course.short_description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {course.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}