import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  ChevronDown, ChevronUp, CheckCircle, Circle, Heart, Activity, Zap, User, Smile, ArrowLeft, LayoutDashboard
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-100 transition-transform hover:scale-[1.01] ${className}`}>{children}</div>
);

const Progress = ({ value, className = "" }) => (
  <div className={`w-full h-3 bg-purple-100 rounded-full overflow-hidden ${className}`}>
    <div className="h-full bg-gradient-to-r from-purple-600 via-pink-400 to-green-400 rounded-full transition-all duration-700" style={{ width: `${value || 0}%` }} />
  </div>
);

const exerciseCategories = {
  breathing: {
    title: "Breathing Exercises",
    description: "Strengthen your breath control and stamina",
    exercises: [
      { id: "b1", name: "Diaphragmatic Breathing", duration: "5 mins", instructions: "Lie down, place hand on belly, breathe deeply", details: "Lie on your back and focus on expanding your belly as you breathe. This builds vocal support." },
      { id: "b2", name: "Square Breathing", duration: "3 mins", instructions: "Inhale 4s, hold 4s, exhale 4s, hold 4s", details: "Square breathing helps regulate your breath and calm your nervous system." },
      { id: "b3", name: "Sustained Breath", duration: "4 mins", instructions: "Sustain 'ah' sound as long as possible", details: "Builds vocal endurance and control." },
    ]
  },
  pitch: {
    title: "Pitch Control",
    description: "Expand your vocal range and accuracy",
    exercises: [
      { id: "p1", name: "Pitch Slides", duration: "4 mins", instructions: "Slide between high and low notes", details: "Improves control and flexibility of pitch." },
      { id: "p2", name: "Scale Practice", duration: "5 mins", instructions: "Sing major scale up and down", details: "Essential for developing pitch precision." },
      { id: "p3", name: "Interval Jumps", duration: "3 mins", instructions: "Jump between musical intervals", details: "Train your ear and vocal agility." },
    ]
  },
  articulation: {
    title: "Articulation Exercises",
    description: "Sharpen clarity and pronunciation",
    exercises: [
      { id: "a1", name: "Tongue Twisters", duration: "4 mins", instructions: "Start slow, build speed", details: "Great for improving enunciation and speed." },
      { id: "a2", name: "Lip Trills", duration: "3 mins", instructions: "Buzz lips with pitch shifts", details: "Wakes up your vocal cords gently." },
      { id: "a3", name: "Diction Practice", duration: "5 mins", instructions: "Focus on consonants", details: "Boosts speech clarity and articulation." },
    ]
  },
};

const ExerciseSection = ({ category, exercises, isOpen, onToggle, completedExercises = [], onExerciseToggle }) => {
  const completed = Array.isArray(completedExercises) ? completedExercises : [];
  const [expandedExercise, setExpandedExercise] = useState(null);
  const toggleExerciseDetails = (id) => setExpandedExercise(prev => prev === id ? null : id);

  return (
    <Card className="mb-4 overflow-hidden">
      <button onClick={onToggle} className="w-full p-6 flex items-center justify-between bg-white hover:bg-purple-50 transition-colors">
        <div>
          <h3 className="text-left text-xl font-bold text-purple-800 flex items-center gap-2">
            <Activity className="text-green-500" /> {category.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 italic">{category.description}</p>
        </div>
        {isOpen ? <ChevronUp className="h-6 w-6 text-purple-500" /> : <ChevronDown className="h-6 w-6 text-purple-500" />}
      </button>

      {isOpen && (
        <div className="p-6 space-y-4 animate-fade-in">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Zap className="text-purple-500 w-4 h-4" />
                    <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                    <span className="text-sm text-green-600">{exercise.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{exercise.instructions}</p>
                </div>
                <button onClick={() => onExerciseToggle(exercise.id)} className="ml-4 p-2 hover:bg-green-50 rounded-full transition-colors">
                  {completed.includes(exercise.id) ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-gray-400" />}
                </button>
              </div>
              {expandedExercise === exercise.id && <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-700">{exercise.details}</div>}
              <button onClick={() => toggleExerciseDetails(exercise.id)} className="text-purple-600 text-sm mt-2 font-semibold">
                {expandedExercise === exercise.id ? "Hide Details ⬆️" : "Learn More ⬇️"}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center gap-4 py-4 mb-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Home
      </button>
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
      >
        <LayoutDashboard className="w-5 h-5" />
        Dashboard
      </button>
    </nav>
  );
};

const ExercisesPage = () => {
  const { user } = useContext(AuthContext);
  const [openSections, setOpenSections] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [totalExercises, setTotalExercises] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExerciseProgress();
    const total = Object.values(exerciseCategories).reduce((acc, cat) => acc + cat.exercises.length, 0);
    setTotalExercises(total);
  }, []);

  const fetchExerciseProgress = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/exercises/progress", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      if (response.data.success) {
        setCompletedExercises(response.data.todayProgress?.completedExercises || []);
      }
    } catch (error) {
      console.error("Error fetching exercise progress:", error);
      setCompletedExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = async (exerciseId) => {
    const current = Array.isArray(completedExercises) ? completedExercises : [];
    const updated = current.includes(exerciseId)
      ? current.filter(id => id !== exerciseId)
      : [...current, exerciseId];
    setCompletedExercises(updated);
    try {
      await axios.post("http://localhost:8000/api/exercises/track", { completedExercises: updated }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
    } catch (error) {
      console.error("Error updating exercise progress:", error);
      setCompletedExercises(current);
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-lg font-semibold text-purple-700 animate-pulse">Loading your personalized vocal warm-up...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-100 text-gray-900 font-inter p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <NavBar />
        <div className="text-center flex flex-col items-center">
          <Smile className="text-purple-500 w-10 h-10 mb-3 animate-bounce" />
          <h1 className="text-4xl font-extrabold text-purple-700 drop-shadow-sm">Hey {user.fullName}! 🌟</h1>
          <p className="text-gray-600 mt-1 text-lg italic">Every rep brings you one step closer to vocal mastery 🎶</p>
        </div>

        <Card className="text-center p-6">
          <p className="text-sm text-gray-600">Today's Progress</p>
          <p className="text-3xl font-extrabold text-green-600">
            {completedExercises.length} / {totalExercises}
          </p>
          <Progress value={(completedExercises.length / totalExercises) * 100} className="mt-2" />
        </Card>

        <div className="space-y-4">
          {Object.entries(exerciseCategories).map(([key, category]) => (
            <ExerciseSection
              key={key}
              category={category}
              exercises={category.exercises}
              isOpen={openSections.includes(key)}
              onToggle={() => setOpenSections(prev => prev.includes(key) ? prev.filter(sec => sec !== key) : [...prev, key])}
              completedExercises={completedExercises}
              onExerciseToggle={toggleExercise}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
