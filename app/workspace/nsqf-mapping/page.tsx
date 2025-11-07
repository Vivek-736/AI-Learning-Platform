"use client";

import React, { useState, useMemo } from "react";
import { nsqfCareers, NSQFCareer } from "@/config/nsqfData";
import {
  Search,
  BookOpen,
  Users,
  GraduationCap,
  Copy,
  CheckCheck,
  Star,
  Building,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NSQFMappingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | "">("");
  const [selectedDemand, setSelectedDemand] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string>("");

  const nsqfLevels = [
    ...new Set(nsqfCareers.map((career) => career.nsqf_level)),
  ].sort();
  const jobDemands = [
    ...new Set(nsqfCareers.map((career) => career.job_demand)),
  ];
  const sectors = [
    ...new Set(nsqfCareers.map((career) => career.sector)),
  ].sort();

  const filteredCareers = useMemo(() => {
    return nsqfCareers.filter((career) => {
      const matchesSearch =
        career.career.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.required_skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        career.training_pathway.some((path) =>
          path.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesLevel =
        selectedLevel === "" || career.nsqf_level === selectedLevel;
      const matchesDemand =
        selectedDemand === "" || career.job_demand === selectedDemand;
      const matchesSector =
        selectedSector === "" || career.sector === selectedSector;

      return matchesSearch && matchesLevel && matchesDemand && matchesSector;
    });
  }, [searchTerm, selectedLevel, selectedDemand, selectedSector]);

  const handleCopyToClipboard = async (
    career: NSQFCareer,
    type: "skills" | "pathway"
  ) => {
    const text =
      type === "skills"
        ? career.required_skills.join(", ")
        : career.training_pathway.join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(`${career.id}-${type}`);
      setTimeout(() => setCopiedId(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "Very High":
        return "text-green-600 bg-green-50";
      case "High":
        return "text-blue-600 bg-blue-50";
      case "Moderate":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getDemandStars = (demand: string) => {
    switch (demand) {
      case "Very High":
        return 5;
      case "High":
        return 4;
      case "Moderate":
        return 3;
      case "Low":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            NSQF Career Mapping
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Explore career pathways based on National Skills Qualifications
            Framework (NSQF)
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search careers, skills, or pathways..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {nsqfLevels.map((level) => (
                <option key={level} value={level}>
                  NSQF Level {level}
                </option>
              ))}
            </select>

            <select
              value={selectedDemand}
              onChange={(e) => setSelectedDemand(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Demands</option>
              {jobDemands.map((demand) => (
                <option key={demand} value={demand}>
                  {demand} Demand
                </option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <div
              key={career.id}
              className="bg-[#FFFFFF] rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {career.career}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>NSQF Level {career.nsqf_level}</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDemandColor(
                      career.job_demand
                    )}`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{career.job_demand}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < getDemandStars(career.job_demand)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {career.description}
                </p>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{career.sector}</span>
                  </div>
                  <div className="flex items-center text-gray-900 font-medium">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span>{career.average_salary}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Required Skills
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToClipboard(career, "skills")}
                      className="h-6 w-6 p-0 hover:bg-indigo-50"
                    >
                      {copiedId === `${career.id}-skills` ? (
                        <CheckCheck className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {career.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Training Pathway
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToClipboard(career, "pathway")}
                      className="h-6 w-6 p-0 hover:bg-indigo-50"
                    >
                      {copiedId === `${career.id}-pathway` ? (
                        <CheckCheck className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {career.training_pathway.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-indigo-600">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    💡 <strong>Tip:</strong> Copy the required skills and
                    training pathway above to use in course generation. Use
                    these details to create personalized learning paths in our
                    create course&apos;s workspace section.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No careers found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find relevant career
              pathways.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedLevel("");
                setSelectedDemand("");
                setSelectedSector("");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NSQFMappingPage;
