import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const opportunities = [
      {
        id: "hack-1",
        title: "AI for Good Hackathon 2024",
        description: "Build AI solutions that make a positive impact on society. Join developers worldwide in creating innovative applications.",
        type: "hackathon",
        organizer: "Tech for Good Foundation",
        category: "Artificial Intelligence",
        deadline: new Date("2025-01-15"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$50,000",
        eligibility: "Students and professionals worldwide",
        tags: ["AI", "Machine Learning", "Social Impact"],
        imageUrl: "/opportunities/hackathon-ai.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        source: "devpost"
      },
      {
        id: "hack-2",
        title: "Web3 Developer Challenge",
        description: "Build the next generation of decentralized applications. 48-hour intensive coding marathon.",
        type: "hackathon",
        organizer: "Blockchain Alliance",
        category: "Blockchain",
        deadline: new Date("2025-02-01"),
        registrationUrl: "https://mlh.io/seasons/2025/events",
        prizePool: "$75,000",
        eligibility: "All developers",
        tags: ["Web3", "Blockchain", "DeFi"],
        imageUrl: "/opportunities/hackathon-web3.jpg",
        location: "Hybrid",
        mode: "hybrid",
        isActive: true,
        source: "mlh"
      },
      {
        id: "hack-3",
        title: "HealthTech Innovation Sprint",
        description: "Create innovative healthcare solutions using technology. Focus on telemedicine, patient care, and medical data.",
        type: "hackathon",
        organizer: "Healthcare Innovation Lab",
        category: "Healthcare",
        deadline: new Date("2025-01-25"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$40,000",
        eligibility: "Students and healthcare professionals",
        tags: ["HealthTech", "Medicine", "Innovation"],
        imageUrl: "/opportunities/hackathon-health.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        source: "devpost"
      },
      
      {
        id: "comp-1",
        title: "Google Code Jam 2025",
        description: "Test your coding skills in one of the world's most prestigious programming competitions.",
        type: "competition",
        organizer: "Google",
        category: "Competitive Programming",
        deadline: new Date("2025-03-01"),
        registrationUrl: "https://codingcompetitions.withgoogle.com/codejam",
        prizePool: "$15,000",
        eligibility: "Worldwide",
        tags: ["Algorithms", "Data Structures", "Problem Solving"],
        imageUrl: "/opportunities/comp-google.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        source: "google"
      },
      {
        id: "comp-2",
        title: "Meta Hacker Cup",
        description: "Annual programming competition organized by Meta. Solve challenging algorithmic problems.",
        type: "competition",
        organizer: "Meta",
        category: "Competitive Programming",
        deadline: new Date("2025-02-15"),
        registrationUrl: "https://www.facebook.com/codingcompetitions/hacker-cup",
        prizePool: "$20,000",
        eligibility: "Global participants",
        tags: ["Algorithms", "Coding", "Meta"],
        imageUrl: "/opportunities/comp-meta.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        source: "meta"
      },
      {
        id: "comp-3",
        title: "ACM ICPC Regional Contest",
        description: "International Collegiate Programming Contest. Team-based algorithmic competition for university students.",
        type: "competition",
        organizer: "ACM",
        category: "Competitive Programming",
        deadline: new Date("2025-01-30"),
        registrationUrl: "https://icpc.global/",
        prizePool: "Varies by region",
        eligibility: "University students",
        tags: ["ACM", "ICPC", "Team Competition"],
        imageUrl: "/opportunities/comp-icpc.jpg",
        location: "Regional",
        mode: "offline",
        isActive: true,
        source: "icpc"
      },

      {
        id: "fund-1",
        title: "Y Combinator Winter 2025",
        description: "Apply to the world's most successful startup accelerator. Get funding, mentorship, and connections.",
        type: "funding",
        organizer: "Y Combinator",
        category: "Startup Accelerator",
        deadline: new Date("2025-01-20"),
        registrationUrl: "https://www.ycombinator.com/apply",
        prizePool: "$500,000 for 7%",
        eligibility: "Early-stage startups",
        tags: ["Accelerator", "Seed Funding", "Mentorship"],
        imageUrl: "/opportunities/fund-yc.jpg",
        location: "San Francisco, CA",
        mode: "hybrid",
        isActive: true,
        source: "ycombinator"
      },
      {
        id: "fund-2",
        title: "Techstars Startup Weekend",
        description: "54-hour event where you can pitch ideas, form teams, and launch startups. Receive mentorship from industry experts.",
        type: "funding",
        organizer: "Techstars",
        category: "Startup Event",
        deadline: new Date("2025-02-10"),
        registrationUrl: "https://www.techstars.com/communities/startup-weekend",
        prizePool: "Varies by location",
        eligibility: "Aspiring entrepreneurs",
        tags: ["Startup", "Mentorship", "Networking"],
        imageUrl: "/opportunities/fund-techstars.jpg",
        location: "Multiple cities",
        mode: "offline",
        isActive: true,
        source: "techstars"
      },
      {
        id: "fund-3",
        title: "500 Global Seed Program",
        description: "Join a 4-month program with $150k investment. Get access to mentors, resources, and global network.",
        type: "funding",
        organizer: "500 Global",
        category: "Seed Funding",
        deadline: new Date("2025-01-31"),
        registrationUrl: "https://500.co/",
        prizePool: "$150,000",
        eligibility: "Early-stage startups",
        tags: ["Seed", "Accelerator", "Global"],
        imageUrl: "/opportunities/fund-500.jpg",
        location: "Global",
        mode: "hybrid",
        isActive: true,
        source: "500global"
      },
      {
        id: "fund-4",
        title: "Microsoft for Startups",
        description: "Get up to $150,000 in Azure credits, technical support, and go-to-market resources.",
        type: "funding",
        organizer: "Microsoft",
        category: "Cloud Credits & Support",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://www.microsoft.com/startups",
        prizePool: "$150,000 Azure credits",
        eligibility: "B2B startups",
        tags: ["Cloud", "Azure", "Technical Support"],
        imageUrl: "/opportunities/fund-microsoft.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        source: "microsoft"
      },
      {
        id: "comp-4",
        title: "NASA Space Apps Challenge",
        description: "Global hackathon where teams use NASA's open data to address real-world problems on Earth and in space.",
        type: "competition",
        organizer: "NASA",
        category: "Space Technology",
        deadline: new Date("2025-10-01"),
        registrationUrl: "https://www.spaceappschallenge.org/",
        prizePool: "Global Recognition & Awards",
        eligibility: "Everyone worldwide",
        tags: ["NASA", "Space", "Science"],
        imageUrl: "/opportunities/comp-nasa.jpg",
        location: "Global",
        mode: "hybrid",
        isActive: true,
        source: "nasa"
      },
      {
        id: "hack-4",
        title: "GitHub Global Campus Hackathon",
        description: "Student hackathon focusing on open source contributions and collaborative development.",
        type: "hackathon",
        organizer: "GitHub Education",
        category: "Open Source",
        deadline: new Date("2025-02-28"),
        registrationUrl: "https://education.github.com/events",
        prizePool: "$25,000",
        eligibility: "Students with GitHub Student Pack",
        tags: ["Open Source", "GitHub", "Students"],
        imageUrl: "/opportunities/hack-github.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        source: "github"
      }
    ];

    let filteredOpportunities = opportunities;
    if (type && type !== "all") {
      filteredOpportunities = opportunities.filter(opp => opp.type === type);
    }

    const now = new Date();
    filteredOpportunities = filteredOpportunities.filter(
      opp => new Date(opp.deadline) > now
    );

    filteredOpportunities.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

    return NextResponse.json({
      success: true,
      count: filteredOpportunities.length,
      opportunities: filteredOpportunities,
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch opportunities",
      },
      { status: 500 }
    );
  }
}