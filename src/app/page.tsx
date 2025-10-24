'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShareModal from "../components/ShareModal";
import SoundModal from "../components/SoundModal";
import MusicModal from "../components/MusicModal";
import SettingsModal from "../components/SettingsModal";
import AuthModal from "../components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [time, setTime] = useState(new Date());
  const [activeIcon, setActiveIcon] = useState("home");
  const [activeGroup, setActiveGroup] = useState("home"); // For timer/home/idea group
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [timerTime, setTimerTime] = useState(25 * 60); // Start at 25 minutes for timer mode
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [tasks, setTasks] = useState<{id: number, text: string, completed: boolean}[]>([]);
  const [newTask, setNewTask] = useState('');
  const [taskIdCounter, setTaskIdCounter] = useState(1);
  const [isStudyLogsMode, setIsStudyLogsMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [useCustomSubject, setUseCustomSubject] = useState(false);
  const [studyLogs, setStudyLogs] = useState<{subject: string, duration: number, date: string}[]>([]);
  const [showStudyLogs, setShowStudyLogs] = useState(false);
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/embed/playlist/4Zjli1P13J5mmSCD5iKAXK?utm_source=generator&theme=0');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState('https://i.pinimg.com/originals/14/ae/7e/14ae7ede205573466d68eb3a562fe349.gif');
  const [embedVisible, setEmbedVisible] = useState(false);
  const [syllabus, setSyllabus] = useState<{subject: string, totalChapters: number, completedChapters: number}[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    } else if (user) {
      setShowAuthModal(false);
    }
  }, [user, loading]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      if (isStudyLogsMode) {
        // Count up for study logs
        interval = setInterval(() => {
          setTimerTime((time) => time + 1);
        }, 1000);
      } else {
        // Count down for regular timer
        interval = setInterval(() => {
          setTimerTime((time) => {
            if (time > 0) {
              return time - 1;
            } else {
              setIsTimerRunning(false);
              return 0;
            }
          });
        }, 1000);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isStudyLogsMode]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{backgroundImage: `url('${backgroundUrl}')`}}>
        {/* Dark Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)'
          }}
        ></div>
        {/* Logo */}
        <div className="absolute top-6 left-6 z-10">
          <div className="text-white">
            <div className="text-6xl font-bold">focus</div>
            <div className="text-[10px] text-white text-right">by F R I D A Y</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-20">
          <div className="text-center">
            <div className="text-white text-3xl font-bold mb-8">
              Welcome to Focus
            </div>
            <div className="text-white text-lg mb-8">
              Please login or sign up to continue
            </div>
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => {}} />
      </div>
    );
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  };

  const formatTimerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {id: taskIdCounter, text: newTask, completed: false}]);
      setTaskIdCounter(taskIdCounter + 1);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task));
  };

  const resetTimer = () => {
    if (isStudyLogsMode) {
      setTimerTime(0);
      setIsStudyLogsMode(false);
      setSelectedSubject('');
      setCustomSubject('');
      setUseCustomSubject(false);
    } else {
      setTimerTime(25 * 60);
    }
    setIsTimerRunning(false);
  };

  const openMiniWindow = () => {
    const miniWindow = window.open('', 'MiniTimer', 'width=300,height=200');
    if (miniWindow) {
      miniWindow.document.write(`
        <html>
          <head>
            <title>Mini Timer</title>
            <style>
              body { font-family: Arial, sans-serif; background: linear-gradient(to bottom right, #581c87, #1e3a8a, #581c87); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .timer { font-size: 4rem; font-weight: bold; }
              .controls { margin-top: 1rem; }
              button { background: rgba(255,255,255,0.2); color: white; border: none; padding: 0.5rem 1rem; margin: 0 0.5rem; border-radius: 0.5rem; cursor: pointer; }
            </style>
          </head>
          <body>
            <div class="timer" id="timer">25:00</div>
            <div class="controls">
              <button id="start">Start</button>
              <button id="close">Close</button>
            </div>
            <script>
              let time = 25 * 60;
              let running = false;
              let interval;

              function updateTimer() {
                const mins = Math.floor(time / 60);
                const secs = time % 60;
                document.getElementById('timer').textContent = \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
              }

              document.getElementById('start').addEventListener('click', () => {
                running = !running;
                document.getElementById('start').textContent = running ? 'Pause' : 'Start';
                if (running) {
                  interval = setInterval(() => {
                    if (time > 0) {
                      time--;
                      updateTimer();
                    } else {
                      running = false;
                      document.getElementById('start').textContent = 'Start';
                      clearInterval(interval);
                    }
                  }, 1000);
                } else {
                  clearInterval(interval);
                }
              });

              document.getElementById('close').addEventListener('click', () => {
                window.close();
              });

              updateTimer();
            </script>
          </body>
        </html>
      `);
    }
  };

  const handleIdeaClick = () => {
    setIsStudyLogsMode(true);
    setIsTimerMode(false);
    setTimerTime(0);
    setIsTimerRunning(false);
    setSelectedSubject('');
    setCustomSubject('');
    setUseCustomSubject(false);
  };

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogStudy = () => {
    const subjectToLog = useCustomSubject ? customSubject : selectedSubject;
    if (subjectToLog && timerTime > 0) {
      const newLog = {
        subject: subjectToLog,
        duration: timerTime,
        date: new Date().toISOString()
      };

      setStudyLogs(prev => {
        const existingIndex = prev.findIndex(log => log.subject === subjectToLog);
        if (existingIndex >= 0) {
          // Update existing subject
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            duration: updated[existingIndex].duration + timerTime
          };
          return updated;
        } else {
          // Add new subject
          return [...prev, newLog];
        }
      });

      setShowStudyLogs(true);
      setTimerTime(0);
      setIsTimerRunning(false);
      setSelectedSubject('');
      setCustomSubject('');
      setUseCustomSubject(false);
    }
  };

  const getSubjectRanking = (duration: number) => {
    if (duration >= 3600 * 5) return { rank: 'Excellent', color: 'text-green-400' };
    if (duration >= 3600 * 3) return { rank: 'Best', color: 'text-blue-400' };
    if (duration >= 3600 * 2) return { rank: 'Good', color: 'text-yellow-400' };
    if (duration >= 3600) return { rank: 'Average', color: 'text-orange-400' };
    return { rank: 'Beginner', color: 'text-red-400' };
  };


  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };


  const handleIconClick = (iconName: string) => {
    setActiveIcon(iconName);
  };

  const handleGroupClick = (groupName: string) => {
    setActiveGroup(groupName);
    setActiveIcon(groupName);
    if (groupName === 'timer') {
      setIsTimerMode(true);
      setIsStudyLogsMode(false);
      setTimerTime(25 * 60); // Set to 25 minutes for countdown
      setIsTimerRunning(false);
      setSelectedSubject('');
    } else if (groupName === 'home') {
      setIsTimerMode(false);
      setIsStudyLogsMode(false);
      setTimerTime(25 * 60);
      setIsTimerRunning(false);
      setSelectedSubject('');
      setCustomSubject('');
      setUseCustomSubject(false);
    } else if (groupName === 'idea') {
      handleIdeaClick();
    }
  };

  const motivationalTexts = [
    "Stay focused, achieve greatness!",
    "Every moment counts, make it productive!",
    "Your future self will thank you!",
    "Small steps lead to big achievements!",
    "Consistency is the key to success!",
    "Push through, you're almost there!",
    "Believe in yourself and your abilities!",
    "Make today amazing!",
    "You're capable of incredible things!",
    "Stay determined, stay focused!",
    "Success is a journey, not a destination!",
    "Keep going, you're doing great!",
    "Your hard work will pay off!",
    "Dream big, work hard!",
    "Stay positive, work hard!",
    "You're stronger than you think!",
    "Make every second count!",
    "Focus on your goals!",
    "You're on the right path!",
    "Keep pushing forward!",
    "Success starts with focus!",
    "Embrace the challenge!",
    "Rise above the ordinary!",
    "Unlock your potential!",
    "Chase your dreams relentlessly!",
    "Turn obstacles into opportunities!",
    "Inspire others with your actions!",
    "Build habits that last!",
    "Celebrate small victories!",
    "Learn from every experience!",
    "Adapt and overcome!",
    "Visualize your success!",
    "Stay hungry for knowledge!",
    "Lead with purpose!",
    "Innovate and create!",
    "Persevere through difficulties!",
    "Find joy in the process!",
    "Balance work and rest!",
    "Nurture your passions!",
    "Connect with like-minded people!",
    "Reflect and grow!",
    "Aim high, achieve more!",
  ];

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden" style={{backgroundImage: `url('${backgroundUrl}')`}}>
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)'
        }}
      ></div>
      {/* Logo */}
      <div className="absolute top-6 left-6 z-10">
        <div className="text-white">
          <div className="text-6xl font-bold">focus</div>
          <div className="text-[10px] text-white text-right">by F R I D A Y</div>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-20">
        {!isTimerMode && !isStudyLogsMode ? (
          <>
            {/* Motivational Text and Real-time Clock Centered */}
            <div className="text-center">
              {/* Motivational Text */}
              <div className="-mb-10">
                <h1 className="text-white text-3xl font-bold">
                  {motivationalTexts[time.getDay()]}
                </h1>
              </div>

              {/* Real-time Clock */}
              <div className="text-white text-[12rem] font-bold font-avion tracking-wider">
                {formatTime(time)}
              </div>
            </div>
          </>
        ) : isStudyLogsMode ? (
          <div className="flex gap-6 w-full max-w-6xl">
            {/* Left Side - Timer and Controls */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Study Timer */}
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
                <div className="text-white text-[6rem] font-bold font-avion tracking-wider mb-4">
                  {formatStudyTime(timerTime)}
                </div>

                {/* Subject Selection */}
                <div className="mb-6">
                  <div className="flex mb-2">
                    <button
                      onClick={() => setUseCustomSubject(false)}
                      className={`flex-1 py-2 rounded-l-lg font-medium transition-all cursor-pointer ${
                        !useCustomSubject
                          ? 'bg-teal-500/80 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Select Subject
                    </button>
                    <button
                      onClick={() => setUseCustomSubject(true)}
                      className={`flex-1 py-2 rounded-r-lg font-medium transition-all cursor-pointer ${
                        useCustomSubject
                          ? 'bg-teal-500/80 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Custom Subject
                    </button>
                  </div>

                  {!useCustomSubject ? (
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full bg-white/20 text-white rounded-lg px-4 py-3 border border-white/30 focus:bg-white/30 focus:border-white/50 cursor-pointer"
                    >
                      <option value="">Select Subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                      <option value="Economics">Economics</option>
                      <option value="Psychology">Psychology</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Enter custom subject..."
                      className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg px-4 py-3 border border-white/30 focus:bg-white/30 focus:border-white/50 cursor-pointer"
                    />
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="bg-white/20 text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/30 transition-all"
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={handleLogStudy}
                    disabled={(!selectedSubject && !customSubject) || timerTime === 0}
                    className="bg-teal-500/80 text-white px-6 py-3 rounded-lg font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500 transition-all"
                  >
                    Log Study
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Study Logs Display */}
            {showStudyLogs && (
              <div className="w-80 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <h2 className="text-white text-xl font-bold mb-4">Study Rankings</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {studyLogs
                    .sort((a, b) => b.duration - a.duration)
                    .map((log, index) => {
                      const ranking = getSubjectRanking(log.duration);
                      return (
                        <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{log.subject}</span>
                            <span className={`text-sm font-bold ${ranking.color}`}>
                              {ranking.rank}
                            </span>
                          </div>
                          <div className="text-white/70 text-sm">
                            Duration: {formatStudyTime(log.duration)}
                          </div>
                          <div className="text-white/50 text-xs">
                            {new Date(log.date).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ) : isTimerMode ? (
          <div className="flex gap-6 w-full max-w-7xl">
            {/* Left Side - Syllabus Tracker */}
            <div className="w-80">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <h2 className="text-white text-lg font-bold mb-3">Syllabus Tracker</h2>
                {/* Add Subject */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Enter subject name"
                    className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 border border-white/30 mb-2 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const subject = (e.target as HTMLInputElement).value.trim();
                        if (subject) {
                          setSyllabus([...syllabus, {subject, totalChapters: 0, completedChapters: 0}]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
                {/* Subjects List */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {syllabus.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-white font-medium mb-2">{item.subject}</div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="number"
                          placeholder="Total Chapters"
                          value={item.totalChapters || ''}
                          min="0"
                          step="1"
                          onChange={(e) => {
                            const newSyllabus = [...syllabus];
                            newSyllabus[index].totalChapters = Math.max(0, parseInt(e.target.value) || 0);
                            setSyllabus(newSyllabus);
                          }}
                          className="bg-white/20 text-white placeholder-white/60 rounded-lg px-2 py-1 border border-white/30 text-sm focus:outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Completed Chapters"
                          value={item.completedChapters || ''}
                          min="0"
                          max={item.totalChapters}
                          step="1"
                          onChange={(e) => {
                            const newSyllabus = [...syllabus];
                            const value = Math.max(0, parseInt(e.target.value) || 0);
                            newSyllabus[index].completedChapters = Math.min(value, item.totalChapters);
                            setSyllabus(newSyllabus);
                          }}
                          className="bg-white/20 text-white placeholder-white/60 rounded-lg px-2 py-1 border border-white/30 text-sm focus:outline-none"
                        />
                      </div>
                      {item.totalChapters > 0 && (
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full transition-all"
                            style={{width: `${(item.completedChapters / item.totalChapters) * 100}%`}}
                          ></div>
                        </div>
                      )}
                      <div className="text-white/70 text-xs mt-1">
                        {item.completedChapters}/{item.totalChapters} chapters completed
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Timer */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-white text-[6rem] font-bold font-avion tracking-wider mb-6">
                  {formatTimerTime(timerTime)}
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="bg-white/20 text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/30 transition-all"
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerTime(25 * 60);
                    }}
                    className="bg-white/20 text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/30 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => openMiniWindow()}
                    className="bg-white/20 text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/30 transition-all"
                  >
                    Mini Screen
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Tasks */}
            <div className="w-80">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <h2 className="text-white text-lg font-bold mb-3">Tasks</h2>
                <div className="flex mb-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a task..."
                    className="flex-1 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 border border-white/30 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                  <button
                    onClick={addTask}
                    className="ml-2 bg-white/20 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-white/30 transition-all"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center mb-2">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer mr-2 transition-all duration-200 ${
                          task.completed ? 'bg-teal-500 border-teal-500' : 'border-white/50 hover:border-white/80'
                        }`}
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        )}
                      </div>
                      <span className={`flex-1 transition-all duration-200 ${task.completed ? 'line-through text-white/60' : 'text-white'}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Motivational Text and Time */}
            <div className="text-center mb-8">
              <div className="text-white text-2xl font-bold mb-4 font-avion">
                {motivationalTexts[time.getDay()]}
              </div>
              <div className="text-white text-6xl font-bold font-avion tracking-wider">
                {formatTime(time)}
              </div>
            </div>

            {/* Timer Section */}
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-white text-[6rem] font-bold font-avion tracking-wider mb-6">
                {formatTimerTime(timerTime)}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-white/20 text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/30 transition-all"
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerTime(25 * 60);
                  }}
                  className="bg-white/20 text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-white/30 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spotify Embed */}
      {embedVisible && (
        <div className="fixed bottom-20 left-6 z-30">
          <iframe
            data-testid="embed-iframe"
            style={{borderRadius: '12px'}}
            src={spotifyUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-30">
        {/* Left Side - Music and Sound */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (activeIcon === 'music') {
                handleIconClick('home');
                setShowMusicModal(false);
              } else {
                handleIconClick('music');
                setShowMusicModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${
              activeIcon === 'music'
                ? 'bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50'
                : 'bg-white/5'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 21q-1.65 0-2.825-1.175T6 17t1.175-2.825T10 13q.575 0 1.063.138t.937.412V4q0-.425.288-.712T13 3h4q.425 0 .713.288T18 4v2q0 .425-.288.713T17 7h-3v10q0 1.65-1.175 2.825T10 21"/>
            </svg>
          </button>
          
          <button
            onClick={() => {
              if (activeIcon === 'sound') {
                handleIconClick('home');
                setShowSoundModal(false);
              } else {
                handleIconClick('sound');
                setShowSoundModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${
              activeIcon === 'sound'
                ? 'bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50'
                : 'bg-white/5'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.025 22q-.35 0-.612-.187T8.05 21.3L5.5 13H3q-.425 0-.712-.288T2 12t.288-.712T3 11h3.25q.325 0 .588.188t.362.512l1.65 5.375L12.025 2.8q.075-.35.35-.575T13 2t.625.213t.35.562l2.175 9.4l1.4-4.475q.1-.325.362-.512T18.5 7t.575.175t.375.475L20.7 11h.3q.425 0 .713.288T22 12t-.288.713T21 13h-1q-.325 0-.575-.175t-.375-.475l-.475-1.275L16.95 16.3q-.1.325-.375.525T15.95 17t-.6-.238t-.325-.537L13 7.525l-3.025 13.7q-.075.35-.337.55T9.025 22"/>
            </svg>
          </button>
        </div>

        {/* Right Side - Grouped Timer/Home/Idea + Individual Icons */}
        <div className="flex items-center gap-3">
          {/* Grouped Timer/Home/Idea with sliding indicator */}
          <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
            {/* Sliding background indicator */}
            <div 
              className={`absolute top-1 bottom-1 w-8 rounded-xl bg-teal-500/90 shadow-lg shadow-teal-500/40 transition-all duration-500 ease-out ${
                activeGroup === 'timer' ? 'left-1' : 
                activeGroup === 'home' ? 'left-9' : 'left-17'
              }`}
            />
            
            <button
              onClick={() => handleGroupClick('timer')}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 3q-.425 0-.712-.288T9 2t.288-.712T10 1h4q.425 0 .713.288T15 2t-.288.713T14 3zm2 11q.425 0 .713-.288T13 13V9q0-.425-.288-.712T12 8t-.712.288T11 9v4q0 .425.288.713T12 14m0 8q-1.85 0-3.488-.712T5.65 19.35t-1.937-2.863T3 13t.713-3.488T5.65 6.65t2.863-1.937T12 4q1.55 0 2.975.5t2.675 1.45l.7-.7q.275-.275.7-.275t.7.275t.275.7t-.275.7l-.7.7Q20 8.6 20.5 10.025T21 13q0 1.85-.713 3.488T18.35 19.35t-2.863 1.938T12 22m0-2q2.9 0 4.95-2.05T19 13t-2.05-4.95T12 6T7.05 8.05T5 13t2.05 4.95T12 20m0-7"/>
              </svg>
            </button>

            <button
              onClick={() => handleGroupClick('home')}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19"/>
              </svg>
            </button>

            <button
              onClick={() => handleGroupClick('idea')}
              className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer z-10"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 17q-.425 0-.712-.288T7 16t.288-.712T8 15h3q-.35-.425-.562-.937T10.1 13H5.5q-.425 0-.712-.288T4.5 12t.288-.712T5.5 11h4.6q.125-.55.338-1.062T11 9H5q-.425 0-.712-.288T4 8t.288-.712T5 7h10q2.075 0 3.538 1.463T20 12t-1.463 3.538T15 17zm7-2q1.25 0 2.125-.875T18 12t-.875-2.125T15 9t-2.125.875T12 12t.875 2.125T15 15M5 17q-.425 0-.712-.288T4 16t.288-.712T5 15t.713.288T6 16t-.288.713T5 17"/>
              </svg>
            </button>
          </div>

          {/* Individual buttons */}
          <button
            onClick={() => {
              if (activeIcon === 'share') {
                handleIconClick('home');
                setShowShareModal(false);
              } else {
                handleIconClick('share');
                setShowShareModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${
              activeIcon === 'share'
                ? 'bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50'
                : 'bg-white/5'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 18q-1.25 0-2.125-.875T1 15V9q0-1.25.875-2.125T4 6h11.175q.425 0 .713.288t.287.712t-.288.713t-.712.287H4q-.425 0-.712.288T3 9v6q0 .425.288.713T4 16h6q.425 0 .713.288T11 17t-.288.713T10 18zm-1-2V8zm11 0q.425 0 .713-.288T15 15v-2h4.175l-.875.875q-.3.3-.3.7t.3.7t.713.3t.712-.3L22.3 12.7q.3-.3.3-.7t-.3-.7l-2.6-2.6q-.275-.275-.687-.287T18.3 8.7q-.275.275-.275.7t.275.7l.875.9H15q-.825 0-1.412.588T13 13v2q0 .425.288.713T14 16"/>
            </svg>
          </button>

          <button
            onClick={() => {
              if (activeIcon === 'settings') {
                handleIconClick('home');
                setShowSettingsModal(false);
              } else {
                handleIconClick('settings');
                setShowSettingsModal(true);
              }
            }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer ${
              activeIcon === 'settings'
                ? 'bg-teal-500/90 shadow-lg shadow-teal-500/40 border-teal-400/50'
                : 'bg-white/5'
            }`}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m2.2-2.85q.125-.125.063-.3t-.238-.2q-.65-.125-1.213-.488T16.9 17.2t-.387-1.275t.187-1.3q.05-.175-.062-.313t-.288-.087q-1.675.3-2.287 1.9t.487 2.975q.875 1.1 2.3 1.125t2.35-1.075M10.575 22q-.6 0-1-.462t-.5-1.088L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.563-.375t.612-.3l.225-1.65q.1-.65.6-1.1t1.15-.45h2.35q.65 0 1.15.45t.6 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-.2.15q-.2.15-.425.162t-.45-.087q-.525-.225-1.062-.363t-1.113-.162q-.625-.05-1.237.05t-1.238.175q-.475-.8-1.275-1.275T12.05 8.5q-1.45 0-2.475 1.025T8.55 12q0 .95.475 1.763t1.3 1.287q-.175.5-.25 1.025T10 17.125q0 1.05.338 2.038t.937 1.862q.2.3-.025.638t-.675.337"/>
            </svg>
          </button>

          <button
            onClick={() => {
              handleIconClick('fullscreen');
              toggleFullscreen();
            }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/20 cursor-pointer bg-white/5"
          >
            {isFullscreen ? (
              // Exit fullscreen icon
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18H4q-.425 0-.712-.288T3 17t.288-.712T4 16h3q.425 0 .713.288T8 17v3q0 .425-.288.713T7 21t-.712-.288T6 20zm12 0v2q0 .425-.288.713T17 21t-.712-.288T16 20v-3q0-.425.288-.712T17 16h3q.425 0 .713.288T21 17t-.288.713T20 18zM6 6V4q0-.425.288-.712T7 3t.713.288T8 4v3q0 .425-.288.713T7 8H4q-.425 0-.712-.288T3 7t.288-.712T4 6zm12 0h2q.425 0 .713.288T21 7t-.288.713T20 8h-3q-.425 0-.712-.288T16 7V4q0-.425.288-.712T17 3t.713.288T18 4z"/>
              </svg>
            ) : (
              // Enter fullscreen icon
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 19h2q.425 0 .713.288T8 20t-.288.713T7 21H4q-.425 0-.712-.288T3 20v-3q0-.425.288-.712T4 16t.713.288T5 17zm14 0v-2q0-.425.288-.712T20 16t.713.288T21 17v3q0 .425-.288.713T20 21h-3q-.425 0-.712-.288T16 20t.288-.712T17 19zM5 5v2q0 .425-.288.713T4 8t-.712-.288T3 7V4q0-.425.288-.712T4 3h3q.425 0 .713.288T8 4t-.288.713T7 5zm14 0h-2q-.425 0-.712-.288T16 4t.288-.712T17 3h3q.425 0 .713.288T21 4v3q0 .425-.288-.713T20 8t-.712-.288T19 7z"/>
              </svg>
            )}
          </button>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setActiveIcon('home'); // Reset to default when modal closes
          }}
        />

        {/* Sound Modal */}
        <SoundModal
          isOpen={showSoundModal}
          onClose={() => {
            setShowSoundModal(false);
            setActiveIcon('home'); // Reset to default when modal closes
          }}
        />

        {/* Music Modal */}
        <MusicModal
          isOpen={showMusicModal}
          onClose={() => {
            setShowMusicModal(false);
            setActiveIcon('home'); // Reset to default when modal closes
          }}
          onUpdate={setSpotifyUrl}
          onToggleEmbed={() => setEmbedVisible(!embedVisible)}
          embedVisible={embedVisible}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => {
            setShowSettingsModal(false);
            setActiveIcon('home'); // Reset to default when modal closes
          }}
          onBackgroundChange={setBackgroundUrl}
          currentBackground={backgroundUrl}
        />

    </div>
  );
}
