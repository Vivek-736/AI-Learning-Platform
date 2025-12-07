"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ExternalLink, MapPin, Trophy, Rocket, Code2, DollarSign, Users } from "lucide-react";
import localFont from "next/font/local";
import { Skeleton } from "@/components/ui/skeleton";

const nohemi = localFont({
  src: [
    {
      path: "../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
});

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: "hackathon" | "competition" | "funding";
  organizer: string;
  category: string;
  deadline: string;
  registrationUrl: string;
  prizePool: string;
  eligibility: string;
  tags: string[];
  location: string;
  mode: string;
  isActive: boolean;
}

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchOpportunities(selectedType);
  }, [selectedType]);

  const fetchOpportunities = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/opportunities?type=${type}`);
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hackathon":
        return <Code2 className="h-5 w-5" />;
      case "competition":
        return <Trophy className="h-5 w-5" />;
      case "funding":
        return <Rocket className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hackathon":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "competition":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "funding":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (daysLeft < 0) return `Expired`;
    if (daysLeft === 0) return `Today - ${formattedDate}`;
    if (daysLeft === 1) return `Tomorrow - ${formattedDate}`;
    if (daysLeft <= 7) return `${daysLeft} days left - ${formattedDate}`;
    return formattedDate;
  };

  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const daysLeft = Math.ceil(
      (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const isUrgent = daysLeft <= 7 && daysLeft >= 0;

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-300 bg-white">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2.5 rounded-lg ${getTypeColor(opportunity.type)} border`}>
                {getTypeIcon(opportunity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className={`text-xl font-semibold text-gray-900 ${nohemi.className} leading-tight`}>
                  {opportunity.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{opportunity.organizer}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`capitalize shrink-0 ${getTypeColor(opportunity.type)} border`}
            >
              {opportunity.type}
            </Badge>
          </div>
          
          <CardDescription className="text-gray-700 leading-relaxed">
            {opportunity.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {opportunity.tags.slice(0, 4).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <span className={isUrgent ? "font-semibold text-red-600" : ""}>
                {formatDeadline(opportunity.deadline)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>{opportunity.location} • {opportunity.mode}</span>
            </div>

            {opportunity.prizePool && (
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">{opportunity.prizePool}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-700">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>{opportunity.eligibility}</span>
            </div>
          </div>

          <Button
            onClick={() => window.open(opportunity.registrationUrl, "_blank")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium group-hover:bg-indigo-700 transition-colors"
          >
            <span>Register Now</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <Card className="border-2">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className={`text-4xl font-bold text-gray-900 ${nohemi.className}`}>
            Opportunities
          </h1>
          <p className="text-gray-600 text-lg">
            Discover hackathons, competitions, and funding opportunities to accelerate your career
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-gray-100 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-medium"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="hackathon"
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-medium"
            >
              Hackathons
            </TabsTrigger>
            <TabsTrigger
              value="competition"
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-medium"
            >
              Competitions
            </TabsTrigger>
            <TabsTrigger
              value="funding"
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-medium"
            >
              Funding
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))}
              </div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-16">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold text-gray-700 ${nohemi.className}`}>
                  No opportunities found
                </h3>
                <p className="text-gray-500 mt-2">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {opportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats */}
        {!loading && opportunities.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-indigo-100 bg-indigo-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 rounded-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-900">{opportunities.length}</p>
                    <p className="text-sm text-indigo-700">Active Opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-600 rounded-lg">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-900">
                      {opportunities.filter((o) => o.type === "hackathon").length}
                    </p>
                    <p className="text-sm text-purple-700">Hackathons</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      {opportunities.filter((o) => o.type === "funding").length}
                    </p>
                    <p className="text-sm text-blue-700">Funding Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;
