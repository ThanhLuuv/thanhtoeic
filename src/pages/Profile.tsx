import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface Exercise {
  id: string;
  title: string;
  type: 'toeic' | 'dictation';
  part?: number;
  completed: boolean;
  score?: number;
  dateCompleted?: string;
  image?: string;
}

interface ProfileData {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  level: string;
  completedDictationSentences: number;
  totalDictationSentences: number;
}

const Profile: React.FC = () => {
  
  // Mock data - trong thực tế sẽ lấy từ API
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/img/chatbot.png", // Sử dụng ảnh có sẵn
    joinDate: "2024-01-15",
    totalExercises: 45,
    completedExercises: 32,
    averageScore: 85,
    level: "Intermediate",
    completedDictationSentences: 0,
    totalDictationSentences: 300
  });

  // Load completed dictation sentences from localStorage
  useEffect(() => {
    const savedSentences = localStorage.getItem('vocab-completed-sentences');
    if (savedSentences) {
      const completedSentences = JSON.parse(savedSentences);
      setProfileData(prev => ({
        ...prev,
        completedDictationSentences: completedSentences
      }));
    }
  }, []);

  const [exercises] = useState<Exercise[]>([
    {
      id: "1",
      title: "TOEIC Part 1 - Practice Set 1",
      type: "toeic",
      part: 1,
      completed: true,
      score: 90,
      dateCompleted: "2024-01-20",
      image: "/img/part1.png"
    },
    {
      id: "2",
      title: "Dictation Practice - Basic Level",
      type: "dictation",
      completed: true,
      score: 85,
      dateCompleted: "2024-01-18",
      image: "/img/chatbot.png"
    },
    {
      id: "3",
      title: "TOEIC Part 2 - Practice Set 1",
      type: "toeic",
      part: 2,
      completed: false,
      image: "/img/part1.png"
    },
    {
      id: "4",
      title: "Dictation Practice - Intermediate",
      type: "dictation",
      completed: false,
      image: "/img/chatbot.png"
    },
    {
      id: "5",
      title: "TOEIC Part 1 - Practice Set 2",
      type: "toeic",
      part: 1,
      completed: true,
      score: 88,
      dateCompleted: "2024-01-22",
      image: "/img/part1.png"
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'exercises'>('overview');

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExerciseTypeColor = (type: string) => {
    return type === 'toeic' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getExerciseTypeIcon = (type: string) => {
    return type === 'toeic' ? '📝' : '🎧';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Header */}
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
         </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profileData.avatar}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
              />
              <button className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

                         {/* Profile Info */}
             <div className="flex-1 text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                   <p className="text-gray-600">{profileData.email}</p>
                 </div>
                 
                 <div className="flex flex-wrap gap-4 justify-center md:justify-end mt-4 md:mt-0">
                                       <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <p className="text-sm text-gray-600">Join Date</p>
                      <p className="font-semibold text-gray-900">{new Date(profileData.joinDate).toLocaleDateString('en-US')}</p>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <p className="text-sm text-gray-600">Level</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(profileData.level)}`}>
                        {profileData.level}
                      </span>
                    </div>
                 </div>
               </div>
             </div>

            
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
                             <button
                 onClick={() => setActiveTab('overview')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                   activeTab === 'overview'
                     ? 'border-green-500 text-green-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Overview
               </button>
               <button
                 onClick={() => setActiveTab('exercises')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                   activeTab === 'exercises'
                     ? 'border-green-500 text-green-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 Exercise Library ({exercises.length})
               </button>
            </nav>
          </div>

          <div className="p-5">
            {activeTab === 'overview' ? (
              /* Overview Tab */
              <div className="space-y-8">
                                 {/* Progress Overview */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                          <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">{profileData.completedExercises}</div>
                          <div className="text-sm text-gray-600">Exercises Completed</div>
                        </div>
                      </div>
                     
                                          <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">{profileData.averageScore}%</div>
                          <div className="text-sm text-gray-600">Average Score</div>
                        </div>
                      </div>

                                          <div className="bg-gray-50 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">{profileData.completedDictationSentences}</div>
                          <div className="text-sm text-gray-600">Dictation Sentences Completed</div>
                        </div>
                      </div>
                   </div>
                 </div>

                {/* Recent Activity */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                   <div className="space-y-3">
                     {exercises.filter(ex => ex.completed).slice(0, 3).map((exercise) => (
                       <div key={exercise.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getExerciseTypeColor(exercise.type)}`}>
                           {getExerciseTypeIcon(exercise.type)}
                         </div>
                         <div className="flex-1">
                           <p className="text-sm font-medium text-gray-900">{exercise.title}</p>
                           <p className="text-xs text-gray-500">
                             Completed on {new Date(exercise.dateCompleted!).toLocaleDateString('en-US')}
                           </p>
                         </div>
                         <div className="text-right">
                           <span className="text-sm font-semibold text-green-600">{exercise.score}%</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            ) : (
                             /* Exercises Tab */
               <div>
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-semibold text-gray-900">Personal Exercise Library</h3>
                   <div className="flex space-x-2">
                     <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                       <option value="">All Types</option>
                       <option value="toeic">TOEIC</option>
                       <option value="dictation">Dictation</option>
                     </select>
                     <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                       <option value="">All Status</option>
                       <option value="completed">Completed</option>
                       <option value="incomplete">Incomplete</option>
                     </select>
                   </div>
                 </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img
                          src={exercise.image}
                          alt={exercise.title}
                          className="w-full h-32 object-cover rounded-t-xl"
                        />
                        <div className="absolute top-2 left-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getExerciseTypeColor(exercise.type)}`}>
                            {getExerciseTypeIcon(exercise.type)} {exercise.type === 'toeic' ? `Part ${exercise.part}` : 'Dictation'}
                          </span>
                        </div>
                                                 {exercise.completed && (
                           <div className="absolute top-2 right-2">
                             <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                               ✓ Completed
                             </span>
                           </div>
                         )}
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{exercise.title}</h4>
                        
                                                 {exercise.completed ? (
                           <p className="text-sm text-gray-600">Completed</p>
                         ) : (
                           <p className="text-sm text-gray-600">Not completed</p>
                         )}
                        
                        <div className="mt-4">
                                                     <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                             {exercise.completed ? 'Retry' : 'Start'}
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
