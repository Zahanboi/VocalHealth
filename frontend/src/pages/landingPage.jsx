import { Mic, Star, BookOpen, Bot, ArrowRight, Activity, Heart, Shield, Zap, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LandingPage = () => {
  const { user , logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="font-inter bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen text-gray-900 relative overflow-hidden">
      {/* Background Healthcare Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 transform rotate-12 opacity-10">
          <Heart className="w-16 h-16 text-pink-400" />
        </div>
        <div className="absolute top-40 right-20 transform -rotate-12 opacity-10">
          <Activity className="w-20 h-20 text-green-400" />
        </div>
        <div className="absolute bottom-40 left-20 transform rotate-45 opacity-10">
          <Shield className="w-24 h-24 text-blue-400" />
        </div>
        <div className="absolute top-60 left-1/2 transform -rotate-45 opacity-10">
          <Zap className="w-18 h-18 text-purple-400" />
        </div>
      </div>

      <header className="bg-white/90 backdrop-blur-md shadow-xl py-6 px-8 flex justify-between items-center rounded-b-3xl border-b border-blue-100 relative z-10">
        <div className="flex items-center gap-3 text-blue-700 font-extrabold text-3xl tracking-tight">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <Mic className="w-7 h-7 text-white" />
          </div>
          VocalHealth
        </div>
        <nav className="flex gap-8 text-base font-semibold">
          <Link to="/" className="text-blue-600 hover:underline underline-offset-4 transition">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
              <Link to="/exercises" className="text-gray-700 hover:text-blue-600 transition">Exercises</Link>
              <button
                onClick={() => {
                  logout();
                }}
                className="text-gray-700 hover:text-blue-600 transition font-semibold"
              >
                LogOut
              </button>
              {/* <Link to="/health" className="text-gray-700 hover:text-blue-600 transition">Health Check</Link> */}
            </>
          ) : (
            <Link to="/auth" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
          )}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 space-y-24 relative z-10">
        {/* Hero */}
        <section className="flex flex-col lg:flex-row items-center lg:justify-between gap-12 lg:gap-0">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 font-semibold text-sm border border-blue-200">
                ✨ AI-Powered Vocal Health Assistant
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Vocal Health</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Advanced AI technology meets personalized vocal care. Track, analyze, and improve your voice with professional-grade insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => handleNavigation('/health')}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl shadow-xl flex items-center gap-3 font-semibold text-lg transition transform hover:scale-105">
                Start Your Voice Journey <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => handleNavigation('/exercises')}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 rounded-2xl shadow-lg flex items-center gap-3 font-semibold text-lg transition">
                Start Exercises <BookOpen size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-2xl flex items-center justify-center border border-blue-200">
                <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl">
                  <Mic className="w-24 h-24 text-white" />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-400 rounded-2xl shadow-lg flex items-center justify-center transform rotate-12">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl shadow-lg flex items-center justify-center transform -rotate-12">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6).keys()].map((index) => {
            const features = [
              {
                icon: <Star className="text-yellow-500" size={32} />,
                title: "AI Voice Analysis",
                desc: "Advanced machine learning algorithms analyze your voice patterns and provide personalized recommendations.",
                color: "from-yellow-400 to-orange-400"
              },
              {
                icon: <Bot className="text-blue-500" size={32} />,
                title: "Smart Assistant",
                desc: "Get real-time guidance and feedback from our AI-powered vocal health assistant.",
                color: "from-blue-400 to-cyan-400"
              },
              {
                icon: <BookOpen className="text-green-500" size={32} />,
                title: "Personalized Exercises",
                desc: "Customized vocal exercises based on your analysis results and improvement goals.",
                color: "from-green-400 to-teal-400"
              },
              {
                icon: <Activity className="text-purple-500" size={32} />,
                title: "Progress Tracking",
                desc: "Monitor your vocal health journey with detailed analytics and progress reports.",
                color: "from-purple-400 to-pink-400"
              },
              {
                icon: <Shield className="text-indigo-500" size={32} />,
                title: "Health Monitoring",
                desc: "Continuous monitoring of key vocal health metrics and early warning systems.",
                color: "from-indigo-400 to-purple-400"
              },
              {
                icon: <Award className="text-red-500" size={32} />,
                title: "Achievement System",
                desc: "Gamified approach to vocal health with achievements and milestone tracking.",
                color: "from-red-400 to-pink-400"
              }
            ];

            const feature = features[index];
            return (
              <div key={index} className="group">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Additional Big Card Section */}
        <section className="mt-24 p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl font-extrabold">Ready to Transform Your Voice?</h2>
            <p className="text-lg max-w-2xl mx-auto">
              Join thousands who have already improved their vocal health with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 shadow-xl transition text-lg transform hover:scale-105">
                View Dashboard
              </button>
              <button 
                onClick={() => handleNavigation('/exercises')}
                className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white hover:text-blue-600 transition text-lg">
                Start Exercises
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white/90 backdrop-blur-md border-t border-gray-200 mt-24 py-8 text-center text-sm text-gray-600 rounded-t-3xl shadow-lg relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">VocalHealth</span>
          </div>
          <p>&copy; {new Date().getFullYear()} VocalHealth. All rights reserved. Empowering voices with AI technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

