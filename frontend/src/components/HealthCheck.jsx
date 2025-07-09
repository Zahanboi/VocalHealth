import React, { useState, useEffect, useContext } from "react";
import {
  ArrowRight,
  UploadCloud,
  FileDown,
  Eye,
  FileAudio,
  Stethoscope,
  History
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment-timezone";
import.meta.env.VITE_BACKEND_URL

const HealthCheck = () => {
  const { user } = useContext(AuthContext);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [report, setReport] = useState(null);
  const [file, setFile] = useState(null);
  const [pastReports, setPastReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reports`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setPastReports(data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      const audio = new Audio(fileURL);
      audio.onloadedmetadata = () => {
        if (selectedFile.type === "audio/wav" && audio.duration <= 5) {
          setFile(selectedFile);
        } else {
          alert("Please upload a valid WAV file with a maximum length of 5 seconds.");
          setFile(null);
        }
      };
    }
  };

  const handleDiagnose = async () => {
    if (!file) {
      alert("Please upload a valid WAV file before diagnosing.");
      return;
    }
    setIsDiagnosing(true);
    setReport(null);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reports/diagnose`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReport(data.report);
      fetchReports();
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Error processing your audio file. Please try again.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleDownloadPDF = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `voice_pathology_report_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading the report. Please try again.");
    }
  };

  const openCloudinaryReport = () => {
    if (report?.pdfUrl) {
      window.open(report.pdfUrl, "_blank");
    } else {
      alert("Report is not available yet. Please diagnose first.");
    }
  };

  const formatDateTime = (dateString) => {
    return moment(dateString).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <div className="font-inter min-h-screen bg-gradient-to-br from-purple-100 via-green-100 to-white py-16 px-4">
      <main className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition shadow"
          >
            <ArrowRight className="rotate-180" size={18} /> Back to Home
          </button>
        </div>
        {report && (
          <div className="flex gap-4 mb-6 justify-center">
            {/* <button
              onClick={openCloudinaryReport}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition shadow"
            >
              <Eye size={18} /> View Full Report
            </button> */}
            {/* <button
              onClick={() => handleDownloadPDF(report.pdfUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow"
            >
              <FileDown size={18} /> Download PDF
            </button> */}
          </div>
        )}

        <div className="text-center space-y-4 mb-10">
          <h1 className="text-5xl font-bold text-purple-700">Voice Health Check</h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Upload a WAV file of your voice (max 5 seconds) to get an AI-powered vocal diagnosis.
          </p>

          <div className="mt-6 bg-white border-2 border-dashed border-purple-300 rounded-xl p-8 shadow-lg flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2">
              <UploadCloud size={20} /> Upload Audio
            </label>
            <input id="file-upload" type="file" accept=".wav" onChange={handleFileChange} className="sr-only" />
            <span className="mt-4 text-gray-700 flex items-center gap-2">
              {file ? <><FileAudio size={18} /> {file.name}</> : "No file chosen"}
            </span>
          </div>

          <button
            onClick={handleDiagnose}
            className="mt-8 flex items-center gap-2 justify-center bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 text-lg transition shadow-lg"
          >
            {isDiagnosing ? "Diagnosing..." : "Start Diagnosis"} <Stethoscope size={20} />
          </button>
        </div>

        {loadingReports ? (
          <p className="text-center text-gray-500">Loading past reports...</p>
        ) : (
          <div className="space-y-10">
            {report && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200">
                <h2 className="text-2xl font-semibold text-purple-600 mb-2">Diagnosis Result</h2>
                <p className="text-lg text-gray-800">
                  Predicted Condition: <span className="font-bold text-purple-700">{report.prediction}</span>
                </p>
                <p className="text-sm text-gray-500">Analysis Date: {formatDateTime(report.analysisDate)}</p>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
              <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center gap-2">
                <History size={22} /> Past Reports
              </h2>
              <ul>
                {pastReports.length === 0 ? (
                  <p className="text-gray-600">No past reports found.</p>
                ) : (
                  pastReports.map((rep) => (
                    <li key={rep._id} className="text-gray-700 mb-2 flex justify-between items-center">
                      <span>
                        <strong>{formatDateTime(rep.analysisDate)}:</strong> {rep.prediction}
                      </span>
                      <button
                        onClick={() => handleDownloadPDF(rep.pdfUrl)}
                        className="text-green-600 hover:underline flex items-center gap-1"
                      >
                        <FileDown size={16} />
                        Download
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthCheck;
