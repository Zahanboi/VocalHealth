import { Mic, Star, ThumbsUp, BookOpen, Bot, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const primaryColor = "blue"; // Change this to your preferred color

const LandingPage = () => {
  return (
    <div className="font-inter bg-gradient-to-tr from-blue-100 via-white to-blue-200 min-h-screen text-gray-900">
      <header className="bg-blue-50 shadow-lg py-5 px-8 flex justify-between items-center rounded-b-3xl">
        <div className="flex items-center gap-3 text-blue-700 font-extrabold text-3xl tracking-tight">
          <Mic className="w-7 h-7" />
          VocalHealth
        </div>
        <nav className="flex gap-8 text-base font-semibold">
          <Link to="/" className="text-blue-600 hover:underline underline-offset-4 transition">Home</Link>
          <Link to="/auth" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16 space-y-24">
        {/* Hero */}
        <section className="flex flex-col md:flex-row items-center md:justify-between gap-12 md:gap-0">
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Explore Your <span className="text-blue-600 underline decoration-blue-300">Vocal Strength</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-xl mx-auto md:mx-0">
              A personal dashboard to learn, improve, and track your vocal health with AI-guided assistance.
            </p>
            <Link to="/health">
              <button className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl shadow-lg flex items-center gap-3 font-semibold text-lg transition">
                Launch Dashboard <ArrowRight size={20} />
              </button>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-blue-100 rounded-full shadow-inner flex items-center justify-center">
              <Mic className="w-32 h-32 text-blue-400 opacity-70" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Star className="text-blue-500" size={36} />,
              title: "Daily Vocal Tips",
              desc: "Get handpicked voice care tips every day to strengthen your vocal cords."
            },
            {
              icon: <Bot className="text-blue-500" size={36} />,
              title: "AI Assistant",
              desc: "Interact with your vocal assistant for guidance on warmups and health tracking."
            },
            {
              icon: <BookOpen className="text-blue-500" size={36} />,
              title: "Learning Zone",
              desc: "Explore articles, videos, and case studies tailored to your voice goals."
            }
          ].map((f, i) => (
            <div key={i} className="bg-white border-2 border-blue-200 p-8 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center">
              <div className="mb-5">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <section className="relative text-center bg-gradient-to-r from-blue-500 to-blue-400 text-white py-16 px-8 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 opacity-30 rounded-full blur-2xl" />
          <h2 className="text-3xl font-extrabold mb-4">Ready to Take Control of Your Voice?</h2>
          <p className="text-lg mb-8">Start your wellness journey today with tailored guidance and AI insights.</p>
          <Link to="/auth">
            <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 shadow transition text-lg">
              Join the Community
            </button>
          </Link>
        </section>
      </main>

      <footer className="bg-blue-50 border-t mt-24 py-6 text-center text-sm text-gray-500 rounded-t-3xl shadow-inner">
        &copy; {new Date().getFullYear()} VocalHealth. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
