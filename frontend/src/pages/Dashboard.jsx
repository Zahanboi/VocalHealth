// import React, { useState, useEffect, useContext } from "react";
// import ReactMarkdown from "react-markdown";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, BarChart, Bar
// } from "recharts";
// import { Mic } from "lucide-react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import moment from "moment-timezone";
// import { AuthContext } from "../context/AuthContext";

// const Card = ({ children, className = "" }) => (
//   <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>{children}</div>
// );

// const Button = ({ children, className = "", ...props }) => (
//   <button className={`px-4 py-2 rounded-md font-medium transition-colors ${className}`} {...props}>
//     {children}
//   </button>
// );

// const Progress = ({ value, className = "" }) => (
//   <div className={`w-full h-2 bg-gray-200 rounded-full ${className}`}>
//     <div className="h-full bg-pink-500 rounded-full transition-all duration-300" style={{ width: `${value || 0}%` }} />
//   </div>
// );

// const COLORS = ['#ec4899', '#f472b6', '#fbcfe8'];

// export default function Dashboard() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//     const { user, logout } = useContext(AuthContext);
  

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/reports/dashboard-stats', {
//         headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
//       });
//       setDashboardData(response.data.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
//   }

//   if (!dashboardData) {
//     return <div className="flex items-center justify-center min-h-screen text-red-500">Failed to load data</div>;
//   }

//   const latestReport = dashboardData.recentReports?.[dashboardData.recentReports.length - 1] || {};

//   // **Function to clean the findings**
//   const cleanFindings = (text) => {
//     if (!text || typeof text !== "string") return "";

//     // Remove content inside <think> tags
//     let cleanedText = text.replace(/<think>[\s\S]*?<\/think>/, "").trim();

//     // Remove everything from "**Signature:**" onwards
//     const signatureIndex = cleanedText.indexOf("**Signature:**");
//     if (signatureIndex !== -1) {
//       cleanedText = cleanedText.substring(0, signatureIndex).trim();
//     }

//     return cleanedText;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto p-6 space-y-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
//           <div>
//             <h1 className="text-3xl font-bold text-pink-500">Welcome, {user.fullName}</h1>
//             <h1 className="text-xl font-bold text-gray-800">Voice Health Dashboard</h1>
//             <p className="text-gray-600 mt-1">Track your vocal performance and health</p>
//           </div>

//           <Link to="/health">
//             <Button className="bg-pink-500 hover:bg-pink-600 text-white">
//               Start New Recording <Mic className="ml-2 h-4 w-4 inline" />
//             </Button>
//           </Link>
//         </div>

//         {/* Latest Report */}
//         {latestReport && (
//           <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
//             <h2 className="text-xl font-semibold mb-4">Latest Analysis</h2>
//             <p className="text-2xl font-bold mb-2">{latestReport.prediction || "N/A"}</p>
//             <p className="opacity-80">
//               Analyzed on: {latestReport.analysisDate ? moment(latestReport.analysisDate).format('MMMM D, YYYY') : "N/A"}
//             </p>

//             {/* Markdown Rendering & Cleaning Findings */}
//             {latestReport.findings && (
//               <div className="mt-4 text-sm opacity-90">
//                 <ReactMarkdown>{cleanFindings(latestReport.findings)}</ReactMarkdown>
//               </div>
//             )}
//           </Card>
//         )}

//         {/* Metrics Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card>
//             <h3 className="text-lg font-semibold mb-4">Voice Stability</h3>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Jitter</span>
//                   <span className="font-semibold">
//                     {dashboardData.averages?.avgJitter !== undefined
//                       ? dashboardData.averages?.avgJitter.toFixed(2)
//                       : "0"}%
//                   </span>
//                 </div>
//                 <Progress value={dashboardData.averages?.avgJitter ? (dashboardData.averages.avgJitter / 3) * 100 : 0} />
//               </div>
//               <div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Shimmer</span>
//                   <span className="font-semibold">
//                     {dashboardData.averages?.avgShimmer !== undefined
//                       ? dashboardData.averages?.avgShimmer.toFixed(2)
//                       : "0"}%
//                   </span>
//                 </div>
//                 <Progress value={dashboardData.averages?.avgShimmer ? (dashboardData.averages.avgShimmer / 100) * 100 : 0} />
//               </div>
//             </div>
//           </Card>

//           {/* Prediction Distribution Pie Chart */}
//           <Card>
//             <h3 className="text-lg font-semibold mb-4">Prediction Distribution</h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={Object.entries(dashboardData.predictionDistribution || {}).map(([name, value]) => ({ name, value }))}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label
//                 >
//                   {Object.entries(dashboardData.predictionDistribution || {}).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>

//           {/* Exercise Progress */}
//           <Card>
//             <h3 className="text-lg font-semibold mb-4">Exercise Progress</h3>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-pink-500 mb-2">
//                 {dashboardData.exerciseProgress?.completed || 0} / {dashboardData.exerciseProgress?.total || 9}
//               </div>
//               <p className="text-gray-600">Exercises completed today</p>
//               <Progress value={(dashboardData.exerciseProgress?.completed / dashboardData.exerciseProgress?.total) * 100} className="mt-4" />
//             </div>
//           </Card>
//         </div>

//         {/* Weekly Trends */}
//         <Card>
//           <h3 className="text-lg font-semibold mb-4">Weekly Voice Metrics</h3>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={dashboardData.weeklyData || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" tickFormatter={(date) => moment(date).format('MMM D')} />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="jitter" stroke="#ec4899" name="Jitter (%)" />
//               <Line type="monotone" dataKey="shimmer" stroke="#f472b6" name="Shimmer (%)" />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect, useContext } from "react";
// import ReactMarkdown from "react-markdown";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, BarChart, Bar
// } from "recharts";
// import { Mic } from "lucide-react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import moment from "moment-timezone";
// import { AuthContext } from "../context/AuthContext";

// const Card = ({ children, className = "" }) => (
//   <div className={`bg-white rounded-3xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition ${className}`}>{children}</div>
// );

// const Button = ({ children, className = "", ...props }) => (
//   <button className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-lg ${className}`} {...props}>
//     {children}
//   </button>
// );

// const Progress = ({ value, className = "" }) => (
//   <div className={`w-full h-3 bg-gray-200 rounded-full overflow-hidden ${className}`}>
//     <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${value || 0}%` }} />
//   </div>
// );

// const COLORS = ['#ec4899', '#f472b6', '#fbcfe8'];

// export default function Dashboard() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { user, logout } = useContext(AuthContext);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/reports/dashboard-stats', {
//         headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
//       });
//       setDashboardData(response.data.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen text-xl font-semibold">Loading voice insights...</div>;
//   }

//   if (!dashboardData) {
//     return <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">Failed to load dashboard data</div>;
//   }

//   const latestReport = dashboardData.recentReports?.[dashboardData.recentReports.length - 1] || {};

//   const cleanFindings = (text) => {
//     if (!text || typeof text !== "string") return "";
//     let cleanedText = text.replace(/<think>[\s\S]*?<\/think>/, "").trim();
//     const signatureIndex = cleanedText.indexOf("**Signature:**");
//     if (signatureIndex !== -1) {
//       cleanedText = cleanedText.substring(0, signatureIndex).trim();
//     }
//     return cleanedText;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-white to-blue-50 text-gray-900 font-inter">
//       <div className="max-w-6xl mx-auto p-6 space-y-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <div>
//             <h1 className="text-4xl font-extrabold text-pink-600 mb-1">Hello, {user.fullName}</h1>
//             <p className="text-lg text-gray-600">Welcome to your personalized vocal health dashboard</p>
//           </div>

//           <Link to="/health">
//             <Button className="bg-gradient-to-r from-pink-500 to-pink-400 text-white">
//               <Mic className="inline mr-2 animate-pulse" /> Start Recording
//             </Button>
//           </Link>
//         </div>

//         {latestReport && (
//           <Card className="bg-pink-50 border-pink-200">
//             <h2 className="text-2xl font-bold text-pink-600 mb-2">Latest Voice Analysis</h2>
//             <p className="text-xl font-medium text-gray-800">{latestReport.prediction || "N/A"}</p>
//             <p className="text-sm text-gray-500 mt-1">Analyzed on {moment(latestReport.analysisDate).format('MMMM D, YYYY')}</p>
//             {latestReport.findings && (
//               <div className="mt-3 prose prose-sm text-gray-600">
//                 <ReactMarkdown>{cleanFindings(latestReport.findings)}</ReactMarkdown>
//               </div>
//             )}
//           </Card>
//         )}

//         <div className="grid md:grid-cols-3 gap-6">
//           <Card>
//             <h3 className="text-lg font-bold text-pink-600 mb-3">Voice Stability</h3>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span>Jitter</span>
//                   <span>{dashboardData.averages?.avgJitter?.toFixed(2) || "0"}%</span>
//                 </div>
//                 <Progress value={(dashboardData.averages?.avgJitter / 3) * 100} />
//               </div>
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span>Shimmer</span>
//                   <span>{dashboardData.averages?.avgShimmer?.toFixed(2) || "0"}%</span>
//                 </div>
//                 <Progress value={(dashboardData.averages?.avgShimmer / 100) * 100} />
//               </div>
//             </div>
//           </Card>

//           <Card>
//             <h3 className="text-lg font-bold text-pink-600 mb-3">Prediction Overview</h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={Object.entries(dashboardData.predictionDistribution || {}).map(([name, value]) => ({ name, value }))}
//                   cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label>
//                   {Object.entries(dashboardData.predictionDistribution || {}).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>

//           <Card>
//             <h3 className="text-lg font-bold text-pink-600 mb-3">Exercise Progress</h3>
//             <div className="text-center">
//               <div className="text-3xl font-extrabold text-pink-500">
//                 {dashboardData.exerciseProgress?.completed || 0} / {dashboardData.exerciseProgress?.total || 9}
//               </div>
//               <p className="text-gray-600">Exercises done today</p>
//               <Progress value={(dashboardData.exerciseProgress?.completed / dashboardData.exerciseProgress?.total) * 100} className="mt-3" />
//             </div>
//           </Card>
//         </div>

//         <Card className="col-span-3">
//           <h3 className="text-lg font-bold text-pink-600 mb-3">Weekly Voice Metrics</h3>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={dashboardData.weeklyData || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" tickFormatter={(date) => moment(date).format('MMM D')} />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="jitter" stroke="#ec4899" name="Jitter (%)" />
//               <Line type="monotone" dataKey="shimmer" stroke="#f472b6" name="Shimmer (%)" />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useContext } from "react";
// import ReactMarkdown from "react-markdown";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell
// } from "recharts";
// import { Mic } from "lucide-react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import moment from "moment-timezone";
// import { AuthContext } from "../context/AuthContext";

// const Card = ({ children, className = "" }) => (
//   <div className={`bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/40 hover:shadow-2xl transition duration-300 ${className}`}>{children}</div>
// );

// const Button = ({ children, className = "", ...props }) => (
//   <button className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all shadow-md hover:shadow-lg ${className}`} {...props}>
//     {children}
//   </button>
// );

// const Progress = ({ value, className = "" }) => (
//   <div className={`w-full h-3 bg-gray-200 rounded-full overflow-hidden ${className}`}>
//     <div className="h-full bg-pink-500 rounded-full transition-all duration-500" style={{ width: `${value || 0}%` }} />
//   </div>
// );

// const COLORS = ['#ec4899', '#f472b6', '#fbcfe8'];

// export default function Dashboard() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/reports/dashboard-stats', {
//         headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
//       });
//       setDashboardData(response.data.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="flex items-center justify-center min-h-screen text-xl font-semibold">Loading voice insights...</div>;
//   }

//   if (!dashboardData) {
//     return <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">Failed to load dashboard data</div>;
//   }

//   const latestReport = dashboardData.recentReports?.[dashboardData.recentReports.length - 1] || {};

//   const cleanFindings = (text) => {
//     if (!text || typeof text !== "string") return "";
//     let cleanedText = text.replace(/<think>[\s\S]*?<\/think>/, "").trim();
//     const signatureIndex = cleanedText.indexOf("**Signature:**");
//     if (signatureIndex !== -1) {
//       cleanedText = cleanedText.substring(0, signatureIndex).trim();
//     }
//     return cleanedText;
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-gray-900 font-inter"
//       style={{
//         backgroundImage: "url("+"..assets/13313271_v870-tang-36.jpg"+")",
//         backgroundColor: '#fdf6f9',
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <div>
//             <h1 className="text-4xl font-extrabold text-pink-600 mb-2 drop-shadow-md">Hello, {user.fullName}</h1>
//             <p className="text-lg text-gray-600">Welcome back! Your vocal health journey awaits 🎤</p>
//           </div>

//           <Link to="/health">
//             <Button className="bg-gradient-to-r from-pink-500 to-pink-400 text-white">
//               <Mic className="inline mr-2 animate-pulse" /> Start Recording
//             </Button>
//           </Link>
//         </div>

//         <div className="w-full flex justify-center">
          
//         </div>

//         {latestReport && (
//           <Card>
//             <h2 className="text-2xl font-bold text-pink-600 mb-2">Latest Voice Analysis</h2>
//             <p className="text-xl font-medium text-gray-800">{latestReport.prediction || "N/A"}</p>
//             <p className="text-sm text-gray-500 mt-1">Analyzed on {moment(latestReport.analysisDate).format('MMMM D, YYYY')}</p>
//             {latestReport.findings && (
//               <div className="mt-3 prose prose-sm text-gray-600">
//                 <ReactMarkdown>{cleanFindings(latestReport.findings)}</ReactMarkdown>
//               </div>
//             )}
//           </Card>
//         )}

//         <div className="grid md:grid-cols-3 gap-6">
//           <Card>
//             <h3 className="text-lg font-bold text-pink-600 mb-3">Voice Stability</h3>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span>Jitter</span>
//                   <span>{dashboardData.averages?.avgJitter?.toFixed(2) || "0"}%</span>
//                 </div>
//                 <Progress value={(dashboardData.averages?.avgJitter / 3) * 100} />
//               </div>
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span>Shimmer</span>
//                   <span>{dashboardData.averages?.avgShimmer?.toFixed(2) || "0"}%</span>
//                 </div>
//                 <Progress value={(dashboardData.averages?.avgShimmer / 100) * 100} />
//               </div>
//             </div>
//           </Card>

//           <Card>
//             <h3 className="text-lg font-bold text-pink-600 mb-3">Prediction Overview</h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={Object.entries(dashboardData.predictionDistribution || {}).map(([name, value]) => ({ name, value }))}
//                   cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" label>
//                   {Object.entries(dashboardData.predictionDistribution || {}).map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>

//           <Card>
//             <h3 className="text-lg font-bold text-pink-600 mb-3">Exercise Progress</h3>
//             <div className="text-center">
//               <div className="text-3xl font-extrabold text-pink-500">
//                 {dashboardData.exerciseProgress?.completed || 0} / {dashboardData.exerciseProgress?.total || 9}
//               </div>
//               <p className="text-gray-600">Exercises done today</p>
//               <Progress value={(dashboardData.exerciseProgress?.completed / dashboardData.exerciseProgress?.total) * 100} className="mt-3" />
//             </div>
//           </Card>
//         </div>

//         <Card className="col-span-3">
//           <h3 className="text-lg font-bold text-pink-600 mb-3">Weekly Voice Metrics</h3>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={dashboardData.weeklyData || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" tickFormatter={(date) => moment(date).format('MMM D')} />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="jitter" stroke="#ec4899" name="Jitter (%)" />
//               <Line type="monotone" dataKey="shimmer" stroke="#f472b6" name="Shimmer (%)" />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>
//     </div>
//   );
// }

// [Completed Dashboard Code Below]
// [Completed Dashboard Code Below]
// [Completed Dashboard Code Below]
// [Completed Dashboard Code Below with UI Colors: Purple, Green & Accent Pink + Background Elements]
// [Enhanced Dashboard Code with Icons and Health Elements Restored]
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
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/health-bg-elements.svg')] bg-no-repeat bg-right bg-contain opacity-10 pointer-events-none"></div>
      <div className="container mx-auto px-6 py-12 space-y-10">
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

