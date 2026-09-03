import React, { useEffect, memo } from "react";
import { MapPin, Calendar, Sparkles } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const EXPERIENCE = [
  {
    role: "Python/Django Developer",
    company: "Mobitrail",
    location: "Goregaon East, Mumbai",
    period: "Jan 2026 — Present",
    current: true,
    points: [
      "Build and maintain AppInsights 360, Mobitrail's in-house application portfolio and security management platform, including a connector integration framework (Jira, ServiceNow, GitHub, Dynatrace, and more).",
      "Shipped an Observability Agent system: downloadable monitoring agents, per-download API keys, and live agent status tracking.",
      "Built a CMDB infrastructure synchronization pipeline from scratch, including scheduling, batch tracking, and data normalization.",
      "Led a UI redesign across the platform's tab pages and built the onboarding workflow.",
    ],
  },
  {
    role: "Software Development Intern",
    company: "XIRCLS",
    location: "Remote",
    period: "Oct 2025 — Jan 2026",
    current: false,
    points: [
      "Gained hands-on experience with backend development and modern web tooling ahead of joining Mobitrail full-time.",
    ],
  },
];

const ExperienceCard = memo(({ exp, index }) => (
  <div
    data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
    data-aos-duration="1000"
    className="relative pl-8 sm:pl-10"
  >
    {/* Timeline line + dot */}
    <div className="absolute left-0 top-1 bottom-0 w-px bg-gradient-to-b from-[#6366f1] to-[#a855f7]/20" />
    <div
      className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full ${
        exp.current
          ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] shadow-[0_0_12px_rgba(139,92,246,0.8)]"
          : "bg-white/30"
      }`}
    />

    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.01] mb-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 flex-wrap">
            {exp.role}
            {exp.current && (
              <span className="text-[0.65rem] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-[#a78bfa] border border-[#a855f7]/30">
                Current
              </span>
            )}
          </h3>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold mt-0.5">
            {exp.company}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs sm:text-sm text-gray-400 mb-4">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#a855f7]" /> {exp.period}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#a855f7]" /> {exp.location}
        </span>
      </div>

      <ul className="space-y-2">
        {exp.points.map((point, i) => (
          <li key={i} className="text-sm text-gray-300 leading-relaxed flex gap-2">
            <span className="text-[#a855f7] mt-1.5 shrink-0">▹</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  </div>
));

const Experience = () => {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  return (
    <div
      className="h-auto pb-[6%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10"
      id="Experience"
    >
      <div className="text-center mb-10">
        <h2
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="zoom-in-up"
          data-aos-duration="600"
        >
          Experience
        </h2>
        <p
          className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
          data-aos="zoom-in-up"
          data-aos-duration="800"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          Where I've worked and what I've built
          <Sparkles className="w-5 h-5 text-purple-400" />
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {EXPERIENCE.map((exp, index) => (
          <ExperienceCard key={exp.company} exp={exp} index={index} />
        ))}
      </div>
    </div>
  );
};

export default memo(Experience);