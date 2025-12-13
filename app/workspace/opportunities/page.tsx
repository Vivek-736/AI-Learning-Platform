"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ExternalLink, MapPin, Trophy, Rocket, Code2, DollarSign, Users, Star, Sparkles } from "lucide-react";
import localFont from "next/font/local";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  isFeatured?: boolean;
  relevanceScore?: number;
}

const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    fetchFeaturedOpportunities();
  }, []);

  useEffect(() => {
    fetchOpportunities(selectedType);
  }, [selectedType]);

  const fetchFeaturedOpportunities = async () => {
    setLoadingFeatured(true);
    try {
      const response = await fetch(`/api/opportunities?featured=true`);
      const data = await response.json();
      if (data.success) {
        setFeaturedOpportunities(data.opportunities);
        setIsPersonalized(data.personalized);
      }
    } catch (error) {
      console.error("Failed to fetch featured opportunities:", error);
    } finally {
      setLoadingFeatured(false);
    }
  };

  const fetchOpportunities = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/opportunities?type=${type}`);
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.opportunities);
        setIsPersonalized(data.personalized);
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
        return "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "competition":
        return "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "funding":
        return "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800";
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

  const FeaturedOpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const daysLeft = Math.ceil(
      (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const isUrgent = daysLeft <= 7 && daysLeft >= 0;

    return (
      <Card className="min-w-[350px] max-w-[400px] h-[420px] flex flex-col group hover:shadow-xl dark:hover:shadow-indigo-500/10 transition-all duration-300 border-2 border-gray-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-zinc-900/50 relative overflow-hidden">
        <CardHeader className="space-y-3 pb-3 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg ${getTypeColor(opportunity.type)} border-2 shrink-0`}>
              {getTypeIcon(opportunity.type)}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <CardTitle className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${nohemi.className} leading-tight line-clamp-2`}>
                {opportunity.title}
              </CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{opportunity.organizer}</p>
            </div>
            <div className="absolute top-2 right-2 shrink-0">
              <Badge className="bg-indigo-600 dark:bg-indigo-500 text-white border-0 shadow-sm text-[9px] px-1.5 py-0.5 leading-tight">
                <Star className="h-2 w-2" fill="white" />
              </Badge>
            </div>
          </div>
          
          <CardDescription className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
            {opportunity.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-0 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-1.5 min-h-[28px]">
            {opportunity.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs truncate max-w-[100px]"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 text-xs flex-1">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className={`truncate ${isUrgent ? "font-semibold text-red-600 dark:text-red-400" : "font-medium"}`}>
                {formatDeadline(opportunity.deadline)}
              </span>
            </div>
            
            {opportunity.prizePool && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-semibold text-indigo-900 dark:text-indigo-300 truncate">{opportunity.prizePool}</span>
              </div>
            )}
          </div>

          <Button
            onClick={() => window.open(opportunity.registrationUrl, "_blank")}
            className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium transition-all mt-auto"
            size="sm"
          >
            <span>Register Now</span>
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const daysLeft = Math.ceil(
      (new Date(opportunity.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const isUrgent = daysLeft <= 7 && daysLeft >= 0;

    return (
      <Card className="h-full flex flex-col group hover:shadow-lg dark:hover:shadow-indigo-500/10 transition-all duration-300 border-2 border-gray-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-zinc-900/50">
        <CardHeader className="space-y-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`p-2.5 rounded-lg ${getTypeColor(opportunity.type)} border shrink-0`}>
                {getTypeIcon(opportunity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className={`text-xl font-semibold text-gray-900 dark:text-gray-100 ${nohemi.className} leading-tight line-clamp-2`}>
                  {opportunity.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{opportunity.organizer}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`capitalize shrink-0 ${getTypeColor(opportunity.type)} border`}
            >
              {opportunity.type}
            </Badge>
          </div>
          
          <CardDescription className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
            {opportunity.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {opportunity.tags.slice(0, 4).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 truncate max-w-[120px]"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm flex-1">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className={`truncate ${isUrgent ? "font-semibold text-red-600 dark:text-red-400" : ""}`}>
                {formatDeadline(opportunity.deadline)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{opportunity.location} • {opportunity.mode}</span>
            </div>

            {opportunity.prizePool && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-medium truncate">{opportunity.prizePool}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{opportunity.eligibility}</span>
            </div>
          </div>

          <Button
            onClick={() => window.open(opportunity.registrationUrl, "_blank")}
            className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium transition-colors mt-auto"
          >
            <span>Register Now</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  const LoadingSkeleton = () => (
    <Card className="border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800" />
          </div>
        </div>
        <Skeleton className="h-16 w-full bg-gray-200 dark:bg-zinc-800" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-6 w-16 bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-5 w-full bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-full bg-gray-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-zinc-800" />
      </CardContent>
    </Card>
  );

  const FeaturedLoadingSkeleton = () => (
    <Card className="min-w-[350px] max-w-[400px] border-2 border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-zinc-800" />
            <Skeleton className="h-3 w-1/2 bg-gray-200 dark:bg-zinc-800" />
          </div>
        </div>
        <Skeleton className="h-12 w-full bg-gray-200 dark:bg-zinc-800" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-16 bg-gray-200 dark:bg-zinc-800" />
          <Skeleton className="h-5 w-14 bg-gray-200 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-8 w-full bg-gray-200 dark:bg-zinc-800" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className={`text-4xl font-bold text-gray-900 dark:text-white ${nohemi.className}`}>
              Opportunities
            </h1>
            {isPersonalized && (
              <Badge className="bg-indigo-600 dark:bg-indigo-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover hackathons, competitions, and funding opportunities to accelerate your career
          </p>
        </div>

        {/* Featured Opportunities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold text-gray-900 dark:text-white ${nohemi.className} flex items-center gap-2`}>
              <Star className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" />
              Featured Opportunities
            </h2>
          </div>
          
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {loadingFeatured ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <FeaturedLoadingSkeleton key={i} />
                  ))}
                </>
              ) : featuredOpportunities.length === 0 ? (
                <div className="w-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No featured opportunities available</p>
                </div>
              ) : (
                featuredOpportunities.map((opportunity) => (
                  <FeaturedOpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-gray-100 dark:bg-zinc-900 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 font-medium"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="hackathon"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 font-medium"
            >
              Hackathons
            </TabsTrigger>
            <TabsTrigger
              value="competition"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 font-medium"
            >
              Competitions
            </TabsTrigger>
            <TabsTrigger
              value="funding"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 font-medium"
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
                <Trophy className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold text-gray-700 dark:text-gray-300 ${nohemi.className}`}>
                  No opportunities found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later for new opportunities</p>
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

        {!loading && opportunities.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{opportunities.length}</p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400">Active Opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                      {opportunities.filter((o) => o.type === "hackathon").length}
                    </p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400">Hackathons</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                      {opportunities.filter((o) => o.type === "funding").length}
                    </p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400">Funding Events</p>
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
