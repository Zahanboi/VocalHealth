import React, { useState, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  Mic, TrendingUp, Activity, Award, Calendar, Bell, Settings, User, Heart, Shield, Target, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import { AuthContext } from "../context/AuthContext";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 ${className}`}>{children}</div>
);

const Button = ({ children, className = "", ...props }) => (
  <button className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${className}`} {...props}>
    {children}
  </button>
);

const Progress = ({ value, className = "" }) => (
  <div className={`w-full h-3 bg-gray-200 rounded-full ${className}`}>
    <div className="h-full bg-gradient-to-r from-purple-500 via-pink-400 to-green-400 rounded-full transition-all duration-500" style={{ width: `${value || 0}%` }} />
  </div>
);

const COLORS = ['#7c3aed', '#10b981', '#ec4899', '#6ee7b7', '#a78bfa'];

// --- Navbar Component ---
const Navbar = () => (
  <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm fixed top-0 left-0 z-30">
    <div className="container mx-auto px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 font-bold text-purple-700 text-xl">
        <Mic className="w-6 h-6 text-purple-600" />
        VocalHealth
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition">Home</Link>
        <Link to="/exercises" className="text-gray-700 hover:text-purple-600 font-medium transition">Exercises</Link>
      </div>
    </div>
  </nav>
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reports/dashboard-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading your vocal health data...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center mb-4 mx-auto">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-red-500 font-medium">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const latestReport = dashboardData.recentReports?.[dashboardData.recentReports.length - 1] || {};

  const cleanFindings = (text) => {
    if (!text || typeof text !== "string") return "";
    let cleanedText = text.replace(/<think>[\s\S]*?<\/think>/, "").trim();
    const signatureIndex = cleanedText.indexOf("**Signature:**");
    if (signatureIndex !== -1) {
      cleanedText = cleanedText.substring(0, signatureIndex).trim();
    }
    return cleanedText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 relative overflow-hidden">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/health-bg-elements.svg')] bg-no-repeat bg-right bg-contain opacity-10 pointer-events-none"></div>
      <div className="container mx-auto px-6 py-12 space-y-10 pt-24">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <User className="text-purple-600 w-6 h-6" />
            <div>
              <h1 className="text-4xl font-extrabold text-purple-700">Hello, {user.fullName}</h1>
              <p className="text-gray-600 text-lg">Your voice health journey continues 🌿</p>
            </div>
          </div>
          <Link to="/health">
            <Button className="bg-gradient-to-r from-purple-600 to-green-500 text-white">
              <Mic className="inline mr-2" /> Start Recording
            </Button>
          </Link>
        </div>

        {latestReport && (
          <Card className="p-6">
            <div className="flex items-center mb-2 space-x-2">
              <Heart className="text-pink-500" />
              <h2 className="text-2xl font-bold text-purple-700">Latest Analysis</h2>
            </div>
            <p className="text-lg text-gray-700 font-medium">{latestReport.prediction || "N/A"}</p>
            <p className="text-sm text-gray-500">{moment(latestReport.analysisDate).format('MMMM D, YYYY')}</p>
            {latestReport.findings && (
              <div className="mt-4 prose prose-sm max-w-none text-gray-600">
                <ReactMarkdown>{cleanFindings(latestReport.findings)}</ReactMarkdown>
              </div>
            )}
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-2 space-x-2">
              <Activity className="text-purple-500" />
              <h3 className="text-lg font-bold text-purple-700">Voice Stability</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Jitter</span>
                  <span>{dashboardData.averages?.avgJitter?.toFixed(2) || "0"}%</span>
                </div>
                <Progress value={(dashboardData.averages?.avgJitter / 3) * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Shimmer</span>
                  <span>{dashboardData.averages?.avgShimmer?.toFixed(2) || "0"}%</span>
                </div>
                <Progress value={(dashboardData.averages?.avgShimmer / 100) * 100} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-2 space-x-2">
              <TrendingUp className="text-green-500" />
              <h3 className="text-lg font-bold text-purple-700">Prediction Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={Object.entries(dashboardData.predictionDistribution || {}).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(dashboardData.predictionDistribution || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-2 space-x-2">
              <Zap className="text-green-500" />
              <h3 className="text-lg font-bold text-purple-700">Exercise Progress</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-green-600">
                {dashboardData.exerciseProgress?.completed || 0} / {dashboardData.exerciseProgress?.total || 9}
              </div>
              <p className="text-gray-600">Exercises Completed</p>
              <Progress value={(dashboardData.exerciseProgress?.completed / dashboardData.exerciseProgress?.total) * 100} className="mt-3" />
            </div>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-10 flex items-center gap-2">
          <Calendar className="text-purple-500 w-5 h-5" /> Weekly Voice Metrics
        </h2>
        <Card className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.weeklyData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => moment(date).format('MMM D')} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="jitter" stroke="#7c3aed" name="Jitter (%)" />
              <Line type="monotone" dataKey="shimmer" stroke="#10b981" name="Shimmer (%)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
