import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { enrollCourseTable, coursesTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const { userId } = await auth();

    let userCategories: string[] = [];
    let userEmail: string | null = null;
    
    if (userId) {
      try {
        const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }).then(res => res.json()).catch(() => null);
        
        if (clerkUser?.email_addresses?.[0]?.email_address) {
          userEmail = clerkUser.email_addresses[0].email_address;
          
          const enrollments = await db
            .select({
              cid: enrollCourseTable.cid,
            })
            .from(enrollCourseTable)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .where(eq(enrollCourseTable.userEmail, userEmail));
          
          if (enrollments.length > 0) {
            const coursePromises = enrollments.map((enrollment) =>
              db
                .select({ category: coursesTable.category })
                .from(coursesTable)
                .where(eq(coursesTable.cid, enrollment.cid))
                .limit(1)
            );
            
            const coursesData = await Promise.all(coursePromises);
            userCategories = coursesData
              .map((result) => result[0]?.category)
              .filter(Boolean) as string[];
          }
        }
      } catch (error) {
        console.log("Could not fetch user courses:", error);
      }
    }

    const opportunities = [
      {
        id: "hack-1",
        title: "AI for Good Global Hackathon 2025",
        description: "Build AI solutions that make a positive impact on society. Join 10,000+ developers worldwide in creating innovative applications for education, healthcare, and sustainability.",
        type: "hackathon",
        organizer: "Tech for Good Foundation",
        category: "Artificial Intelligence",
        deadline: new Date("2025-01-15"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$50,000",
        eligibility: "Students and professionals worldwide",
        tags: ["AI", "Machine Learning", "Social Impact", "Python"],
        imageUrl: "/opportunities/hackathon-ai.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "devpost"
      },
      {
        id: "hack-2",
        title: "Web3 Developer Challenge",
        description: "Build the next generation of decentralized applications. 48-hour intensive coding marathon with workshops on Solidity, smart contracts, and DeFi protocols.",
        type: "hackathon",
        organizer: "Blockchain Alliance",
        category: "Blockchain",
        deadline: new Date("2025-02-01"),
        registrationUrl: "https://mlh.io/seasons/2025/events",
        prizePool: "$75,000",
        eligibility: "All developers",
        tags: ["Web3", "Blockchain", "DeFi", "Solidity"],
        imageUrl: "/opportunities/hackathon-web3.jpg",
        location: "Hybrid - San Francisco",
        mode: "hybrid",
        isActive: true,
        isFeatured: true,
        source: "mlh"
      },
      {
        id: "hack-3",
        title: "HealthTech Innovation Sprint",
        description: "Create innovative healthcare solutions using technology. Focus on telemedicine, patient care systems, medical data analytics, and AI diagnostics.",
        type: "hackathon",
        organizer: "Healthcare Innovation Lab",
        category: "Healthcare",
        deadline: new Date("2025-01-25"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$40,000",
        eligibility: "Students and healthcare professionals",
        tags: ["HealthTech", "Medicine", "Innovation", "AI"],
        imageUrl: "/opportunities/hackathon-health.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "devpost"
      },
      {
        id: "hack-4",
        title: "GitHub Global Campus Hackathon",
        description: "Student hackathon focusing on open source contributions and collaborative development. Build tools that help developers worldwide.",
        type: "hackathon",
        organizer: "GitHub Education",
        category: "Open Source",
        deadline: new Date("2025-02-28"),
        registrationUrl: "https://education.github.com/events",
        prizePool: "$25,000",
        eligibility: "Students with GitHub Student Pack",
        tags: ["Open Source", "GitHub", "Students", "Git"],
        imageUrl: "/opportunities/hack-github.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "github"
      },
      {
        id: "hack-5",
        title: "Cloud Native Hackathon",
        description: "Build scalable applications using Kubernetes, Docker, and microservices. Focus on cloud-native architectures and DevOps practices.",
        type: "hackathon",
        organizer: "Cloud Native Computing Foundation",
        category: "Cloud Computing",
        deadline: new Date("2025-01-20"),
        registrationUrl: "https://www.cncf.io/events/",
        prizePool: "$30,000",
        eligibility: "All developers",
        tags: ["Kubernetes", "Docker", "Cloud", "DevOps"],
        imageUrl: "/opportunities/hack-cloud.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "cncf"
      },
      {
        id: "hack-6",
        title: "Mobile App Innovation Challenge",
        description: "Create the next breakthrough mobile application. Build for iOS, Android, or cross-platform using React Native or Flutter.",
        type: "hackathon",
        organizer: "Mobile Developers Association",
        category: "Mobile Development",
        deadline: new Date("2025-02-05"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$35,000",
        eligibility: "Mobile developers worldwide",
        tags: ["Mobile", "iOS", "Android", "React Native", "Flutter"],
        imageUrl: "/opportunities/hack-mobile.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "devpost"
      },
      {
        id: "hack-7",
        title: "Data Science for Climate Change",
        description: "Use data science and machine learning to tackle climate challenges. Analyze environmental data and build predictive models.",
        type: "hackathon",
        organizer: "Climate Tech Alliance",
        category: "Data Science",
        deadline: new Date("2025-01-28"),
        registrationUrl: "https://www.kaggle.com/competitions",
        prizePool: "$45,000",
        eligibility: "Data scientists and students",
        tags: ["Data Science", "Climate", "Python", "Machine Learning"],
        imageUrl: "/opportunities/hack-climate.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "kaggle"
      },
      {
        id: "hack-8",
        title: "Cybersecurity CTF Championship",
        description: "Test your security skills in Capture The Flag challenges. Compete in web exploitation, cryptography, reverse engineering, and forensics.",
        type: "hackathon",
        organizer: "Global Cybersecurity Alliance",
        category: "Cybersecurity",
        deadline: new Date("2025-02-12"),
        registrationUrl: "https://ctftime.org/",
        prizePool: "$60,000",
        eligibility: "Security enthusiasts worldwide",
        tags: ["Cybersecurity", "CTF", "Hacking", "Security"],
        imageUrl: "/opportunities/hack-security.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "ctftime"
      },
      {
        id: "hack-9",
        title: "IoT Smart Cities Hackathon",
        description: "Build IoT solutions for smart cities. Create systems for traffic management, energy efficiency, and public safety.",
        type: "hackathon",
        organizer: "Smart Cities Initiative",
        category: "IoT",
        deadline: new Date("2025-01-18"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$40,000",
        eligibility: "Hardware and software developers",
        tags: ["IoT", "Smart Cities", "Hardware", "Sensors"],
        imageUrl: "/opportunities/hack-iot.jpg",
        location: "Hybrid - Multiple Cities",
        mode: "hybrid",
        isActive: true,
        isFeatured: true,
        source: "devpost"
      },
      {
        id: "hack-10",
        title: "Game Development Jam 2025",
        description: "Create innovative games in 72 hours. Any engine, any platform. Theme revealed at start of event.",
        type: "hackathon",
        organizer: "Indie Game Developers",
        category: "Game Development",
        deadline: new Date("2025-02-08"),
        registrationUrl: "https://itch.io/jams",
        prizePool: "$20,000",
        eligibility: "Game developers worldwide",
        tags: ["Game Dev", "Unity", "Unreal", "Godot"],
        imageUrl: "/opportunities/hack-game.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "itchio"
      },

      {
        id: "hack-11",
        title: "FinTech Innovation Challenge",
        description: "Revolutionize financial services with innovative technology solutions. Build payment systems, trading platforms, or financial analytics tools.",
        type: "hackathon",
        organizer: "FinTech Alliance",
        category: "Financial Technology",
        deadline: new Date("2025-02-20"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$55,000",
        eligibility: "Developers and finance professionals",
        tags: ["FinTech", "Finance", "Banking", "APIs"],
        imageUrl: "/opportunities/hack-fintech.jpg",
        location: "New York, NY",
        mode: "hybrid",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-12",
        title: "EdTech Learning Revolution",
        description: "Create the future of education technology. Build platforms for online learning, student engagement, or educational assessment.",
        type: "hackathon",
        organizer: "Education Innovation Hub",
        category: "Education Technology",
        deadline: new Date("2025-01-30"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$35,000",
        eligibility: "Educators and developers",
        tags: ["EdTech", "Education", "Learning", "Students"],
        imageUrl: "/opportunities/hack-edtech.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-13",
        title: "AR/VR Metaverse Hackathon",
        description: "Build immersive experiences in augmented and virtual reality. Create games, training simulations, or social platforms.",
        type: "hackathon",
        organizer: "Metaverse Developers",
        category: "AR/VR",
        deadline: new Date("2025-02-15"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$50,000",
        eligibility: "AR/VR developers worldwide",
        tags: ["AR", "VR", "Metaverse", "Unity", "Unreal"],
        imageUrl: "/opportunities/hack-arvr.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-14",
        title: "E-commerce Platform Challenge",
        description: "Build innovative e-commerce solutions. Create shopping experiences, inventory management, or customer analytics platforms.",
        type: "hackathon",
        organizer: "Retail Tech Alliance",
        category: "E-commerce",
        deadline: new Date("2025-01-22"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$30,000",
        eligibility: "Full-stack developers",
        tags: ["E-commerce", "Retail", "Web Development", "APIs"],
        imageUrl: "/opportunities/hack-ecommerce.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-15",
        title: "Quantum Computing Challenge",
        description: "Explore quantum algorithms and quantum machine learning. Build solutions using IBM Qiskit or Google Cirq.",
        type: "hackathon",
        organizer: "Quantum Computing Institute",
        category: "Quantum Computing",
        deadline: new Date("2025-03-01"),
        registrationUrl: "https://qiskit.org/events",
        prizePool: "$70,000",
        eligibility: "Advanced developers and researchers",
        tags: ["Quantum", "Qiskit", "Physics", "Algorithms"],
        imageUrl: "/opportunities/hack-quantum.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "ibm"
      },
      {
        id: "hack-16",
        title: "Full Stack Web Dev Marathon",
        description: "Build a complete web application from scratch. Showcase your skills in frontend, backend, and database design.",
        type: "hackathon",
        organizer: "Web Developers Guild",
        category: "Web Development",
        deadline: new Date("2025-01-27"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$28,000",
        eligibility: "Web developers",
        tags: ["React", "Node.js", "Full Stack", "JavaScript"],
        imageUrl: "/opportunities/hack-fullstack.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-17",
        title: "Robotics & Automation Challenge",
        description: "Design and program robots for real-world applications. Focus on automation, AI, and hardware integration.",
        type: "hackathon",
        organizer: "Robotics Society",
        category: "Robotics",
        deadline: new Date("2025-02-18"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$42,000",
        eligibility: "Engineers and developers",
        tags: ["Robotics", "Automation", "AI", "Hardware"],
        imageUrl: "/opportunities/hack-robotics.jpg",
        location: "Boston, MA",
        mode: "offline",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-18",
        title: "Social Good App Challenge",
        description: "Create applications that address social issues. Focus on accessibility, education, or community building.",
        type: "hackathon",
        organizer: "Social Impact Tech",
        category: "Social Impact",
        deadline: new Date("2025-01-24"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$32,000",
        eligibility: "All developers",
        tags: ["Social Impact", "Accessibility", "Community", "NGO"],
        imageUrl: "/opportunities/hack-social.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-19",
        title: "Backend Architecture Showdown",
        description: "Design scalable backend systems. Focus on microservices, databases, and API design patterns.",
        type: "hackathon",
        organizer: "Backend Developers Alliance",
        category: "Backend Development",
        deadline: new Date("2025-02-22"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$38,000",
        eligibility: "Backend developers",
        tags: ["Backend", "Microservices", "APIs", "Databases"],
        imageUrl: "/opportunities/hack-backend.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },
      {
        id: "hack-20",
        title: "DevOps & Infrastructure Hackathon",
        description: "Build CI/CD pipelines, infrastructure as code, and monitoring solutions. Master modern DevOps practices.",
        type: "hackathon",
        organizer: "DevOps Foundation",
        category: "DevOps",
        deadline: new Date("2025-02-14"),
        registrationUrl: "https://devpost.com/hackathons",
        prizePool: "$33,000",
        eligibility: "DevOps engineers",
        tags: ["DevOps", "CI/CD", "Terraform", "Kubernetes"],
        imageUrl: "/opportunities/hack-devops.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "devpost"
      },

      {
        id: "comp-1",
        title: "Google Code Jam 2025",
        description: "Test your coding skills in one of the world's most prestigious programming competitions. Solve algorithmic challenges and compete globally.",
        type: "competition",
        organizer: "Google",
        category: "Competitive Programming",
        deadline: new Date("2025-03-01"),
        registrationUrl: "https://codingcompetitions.withgoogle.com/codejam",
        prizePool: "$15,000",
        eligibility: "Worldwide",
        tags: ["Algorithms", "Data Structures", "Problem Solving", "C++", "Python"],
        imageUrl: "/opportunities/comp-google.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "google"
      },
      {
        id: "comp-2",
        title: "Meta Hacker Cup",
        description: "Annual programming competition organized by Meta. Solve challenging algorithmic problems and compete for top rankings.",
        type: "competition",
        organizer: "Meta",
        category: "Competitive Programming",
        deadline: new Date("2025-02-15"),
        registrationUrl: "https://www.facebook.com/codingcompetitions/hacker-cup",
        prizePool: "$20,000",
        eligibility: "Global participants",
        tags: ["Algorithms", "Coding", "Meta", "C++"],
        imageUrl: "/opportunities/comp-meta.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "meta"
      },
      {
        id: "comp-3",
        title: "ACM ICPC Regional Contest",
        description: "International Collegiate Programming Contest. Team-based algorithmic competition for university students. Gateway to World Finals.",
        type: "competition",
        organizer: "ACM",
        category: "Competitive Programming",
        deadline: new Date("2025-01-30"),
        registrationUrl: "https://icpc.global/",
        prizePool: "Varies by region",
        eligibility: "University students",
        tags: ["ACM", "ICPC", "Team Competition", "Algorithms"],
        imageUrl: "/opportunities/comp-icpc.jpg",
        location: "Regional",
        mode: "offline",
        isActive: true,
        isFeatured: true,
        source: "icpc"
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
        tags: ["NASA", "Space", "Science", "Data"],
        imageUrl: "/opportunities/comp-nasa.jpg",
        location: "Global",
        mode: "hybrid",
        isActive: true,
        isFeatured: true,
        source: "nasa"
      },
      {
        id: "comp-5",
        title: "Kaggle Machine Learning Competition",
        description: "Compete in data science challenges with real-world datasets. Build predictive models and compete on the leaderboard.",
        type: "competition",
        organizer: "Kaggle",
        category: "Data Science",
        deadline: new Date("2025-02-28"),
        registrationUrl: "https://www.kaggle.com/competitions",
        prizePool: "$100,000",
        eligibility: "Data scientists worldwide",
        tags: ["Machine Learning", "Data Science", "Python", "Kaggle"],
        imageUrl: "/opportunities/comp-kaggle.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "kaggle"
      },

      {
        id: "comp-6",
        title: "Codeforces Global Round",
        description: "High-stakes competitive programming round with complex algorithmic challenges. Compete for rating and prizes.",
        type: "competition",
        organizer: "Codeforces",
        category: "Competitive Programming",
        deadline: new Date("2025-01-25"),
        registrationUrl: "https://codeforces.com/",
        prizePool: "$15,000",
        eligibility: "All competitive programmers",
        tags: ["Algorithms", "Codeforces", "Programming", "C++"],
        imageUrl: "/opportunities/comp-codeforces.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "codeforces"
      },
      {
        id: "comp-7",
        title: "Microsoft Imagine Cup",
        description: "Global student technology competition. Build innovative solutions that address world challenges using Microsoft technologies.",
        type: "competition",
        organizer: "Microsoft",
        category: "Software Development",
        deadline: new Date("2025-03-15"),
        registrationUrl: "https://imaginecup.microsoft.com/",
        prizePool: "$100,000",
        eligibility: "Students worldwide",
        tags: ["Microsoft", "Azure", "Innovation", "Students"],
        imageUrl: "/opportunities/comp-microsoft.jpg",
        location: "Global",
        mode: "hybrid",
        isActive: true,
        isFeatured: false,
        source: "microsoft"
      },
      {
        id: "comp-8",
        title: "TopCoder Open Championship",
        description: "Premier competitive programming championship. Multiple tracks including algorithms, marathon matches, and design.",
        type: "competition",
        organizer: "TopCoder",
        category: "Competitive Programming",
        deadline: new Date("2025-02-10"),
        registrationUrl: "https://www.topcoder.com/",
        prizePool: "$50,000",
        eligibility: "TopCoder members",
        tags: ["Algorithms", "TopCoder", "Design", "Marathon"],
        imageUrl: "/opportunities/comp-topcoder.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "topcoder"
      },
      {
        id: "comp-9",
        title: "AWS DeepRacer League",
        description: "Autonomous racing league powered by reinforcement learning. Train ML models to race on virtual and physical tracks.",
        type: "competition",
        organizer: "Amazon Web Services",
        category: "Machine Learning",
        deadline: new Date("2025-02-25"),
        registrationUrl: "https://aws.amazon.com/deepracer/",
        prizePool: "$50,000",
        eligibility: "ML enthusiasts worldwide",
        tags: ["AWS", "Machine Learning", "AI", "Reinforcement Learning"],
        imageUrl: "/opportunities/comp-deepracer.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "aws"
      },
      {
        id: "comp-10",
        title: "HackerRank World Championship",
        description: "Annual coding competition with algorithmic challenges. Compete against top developers from around the world.",
        type: "competition",
        organizer: "HackerRank",
        category: "Competitive Programming",
        deadline: new Date("2025-03-10"),
        registrationUrl: "https://www.hackerrank.com/",
        prizePool: "$25,000",
        eligibility: "All developers",
        tags: ["Algorithms", "HackerRank", "Programming", "Problem Solving"],
        imageUrl: "/opportunities/comp-hackerrank.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "hackerrank"
      },

      {
        id: "fund-1",
        title: "Y Combinator Winter 2025",
        description: "Apply to the world's most successful startup accelerator. Get $500k funding, mentorship from industry leaders, and connections to investors.",
        type: "funding",
        organizer: "Y Combinator",
        category: "Startup Accelerator",
        deadline: new Date("2025-01-20"),
        registrationUrl: "https://www.ycombinator.com/apply",
        prizePool: "$500,000 for 7%",
        eligibility: "Early-stage startups",
        tags: ["Accelerator", "Seed Funding", "Mentorship", "Startups"],
        imageUrl: "/opportunities/fund-yc.jpg",
        location: "San Francisco, CA",
        mode: "hybrid",
        isActive: true,
        isFeatured: true,
        source: "ycombinator"
      },
      {
        id: "fund-2",
        title: "Techstars Startup Weekend",
        description: "54-hour event where you can pitch ideas, form teams, and launch startups. Receive mentorship from industry experts and potential funding.",
        type: "funding",
        organizer: "Techstars",
        category: "Startup Event",
        deadline: new Date("2025-02-10"),
        registrationUrl: "https://www.techstars.com/communities/startup-weekend",
        prizePool: "Varies by location",
        eligibility: "Aspiring entrepreneurs",
        tags: ["Startup", "Mentorship", "Networking", "Pitch"],
        imageUrl: "/opportunities/fund-techstars.jpg",
        location: "Multiple cities",
        mode: "offline",
        isActive: true,
        isFeatured: true,
        source: "techstars"
      },
      {
        id: "fund-3",
        title: "500 Global Seed Program",
        description: "Join a 4-month program with $150k investment. Get access to mentors, resources, and a global network of founders and investors.",
        type: "funding",
        organizer: "500 Global",
        category: "Seed Funding",
        deadline: new Date("2025-01-31"),
        registrationUrl: "https://500.co/",
        prizePool: "$150,000",
        eligibility: "Early-stage startups",
        tags: ["Seed", "Accelerator", "Global", "Network"],
        imageUrl: "/opportunities/fund-500.jpg",
        location: "Global",
        mode: "hybrid",
        isActive: true,
        isFeatured: true,
        source: "500global"
      },
      {
        id: "fund-4",
        title: "Microsoft for Startups",
        description: "Get up to $150,000 in Azure credits, technical support, and go-to-market resources. Access to Microsoft's global network.",
        type: "funding",
        organizer: "Microsoft",
        category: "Cloud Credits & Support",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://www.microsoft.com/startups",
        prizePool: "$150,000 Azure credits",
        eligibility: "B2B startups",
        tags: ["Cloud", "Azure", "Technical Support", "Credits"],
        imageUrl: "/opportunities/fund-microsoft.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "microsoft"
      },
      {
        id: "fund-5",
        title: "AWS Activate Program",
        description: "Receive up to $100,000 in AWS credits, technical support, and training. Perfect for early-stage startups building on AWS.",
        type: "funding",
        organizer: "Amazon Web Services",
        category: "Cloud Credits",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://aws.amazon.com/activate/",
        prizePool: "$100,000 AWS credits",
        eligibility: "Startups and founders",
        tags: ["AWS", "Cloud", "Credits", "Support"],
        imageUrl: "/opportunities/fund-aws.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: true,
        source: "aws"
      },

      {
        id: "fund-6",
        title: "Google for Startups Accelerator",
        description: "3-month accelerator program with equity-free support. Get mentorship from Google experts and access to Google Cloud credits.",
        type: "funding",
        organizer: "Google",
        category: "Accelerator",
        deadline: new Date("2025-02-15"),
        registrationUrl: "https://startup.google.com/",
        prizePool: "Equity-free + $100k credits",
        eligibility: "Tech startups",
        tags: ["Google", "Accelerator", "Mentorship", "Credits"],
        imageUrl: "/opportunities/fund-google.jpg",
        location: "Global",
        mode: "hybrid",
        isActive: true,
        isFeatured: false,
        source: "google"
      },
      {
        id: "fund-7",
        title: "Sequoia Arc Program",
        description: "Early-stage company builder program. Get funding, resources, and mentorship from Sequoia Capital partners.",
        type: "funding",
        organizer: "Sequoia Capital",
        category: "Venture Capital",
        deadline: new Date("2025-01-25"),
        registrationUrl: "https://www.sequoiacap.com/arc/",
        prizePool: "$1,000,000",
        eligibility: "Pre-seed and seed startups",
        tags: ["VC", "Funding", "Sequoia", "Mentorship"],
        imageUrl: "/opportunities/fund-sequoia.jpg",
        location: "Global",
        mode: "hybrid",
        isActive: true,
        isFeatured: false,
        source: "sequoia"
      },
      {
        id: "fund-8",
        title: "Antler Global Founder Program",
        description: "Join a cohort-based program to find co-founders, validate ideas, and get initial funding. Global presence in 25+ cities.",
        type: "funding",
        organizer: "Antler",
        category: "Pre-seed",
        deadline: new Date("2025-02-20"),
        registrationUrl: "https://www.antler.co/",
        prizePool: "$100,000 - $250,000",
        eligibility: "Aspiring founders",
        tags: ["Pre-seed", "Co-founder", "Global", "Cohort"],
        imageUrl: "/opportunities/fund-antler.jpg",
        location: "25+ Cities Globally",
        mode: "hybrid",
        isActive: true,
        isFeatured: false,
        source: "antler"
      },
      {
        id: "fund-9",
        title: "Product Hunt Maker Festival",
        description: "Launch your product and compete for community recognition. Winners get featured placement and investor introductions.",
        type: "funding",
        organizer: "Product Hunt",
        category: "Product Launch",
        deadline: new Date("2025-02-05"),
        registrationUrl: "https://www.producthunt.com/",
        prizePool: "Exposure + Investor Intros",
        eligibility: "Product makers",
        tags: ["Product Launch", "Community", "Exposure", "Networking"],
        imageUrl: "/opportunities/fund-producthunt.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "producthunt"
      },
      {
        id: "fund-10",
        title: "NVIDIA Inception Program",
        description: "Support program for AI startups. Get access to NVIDIA technology, go-to-market support, and VC introductions.",
        type: "funding",
        organizer: "NVIDIA",
        category: "AI Startups",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://www.nvidia.com/en-us/startups/",
        prizePool: "Credits + Support",
        eligibility: "AI/ML startups",
        tags: ["AI", "GPU", "NVIDIA", "Machine Learning"],
        imageUrl: "/opportunities/fund-nvidia.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "nvidia"
      },
      {
        id: "fund-11",
        title: "Stripe Atlas Startup Toolkit",
        description: "Incorporate your company, open a bank account, and get access to exclusive perks from partners worth over $20k.",
        type: "funding",
        organizer: "Stripe",
        category: "Incorporation Support",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://stripe.com/atlas",
        prizePool: "$20,000+ in perks",
        eligibility: "New startups",
        tags: ["Incorporation", "Banking", "Legal", "Perks"],
        imageUrl: "/opportunities/fund-stripe.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "stripe"
      },
      {
        id: "fund-12",
        title: "GCP for Startups",
        description: "Google Cloud credits up to $200,000, technical training, and business support for cloud-first startups.",
        type: "funding",
        organizer: "Google Cloud",
        category: "Cloud Credits",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://cloud.google.com/startup",
        prizePool: "$200,000 GCP credits",
        eligibility: "Cloud startups",
        tags: ["Google Cloud", "Credits", "Infrastructure", "Support"],
        imageUrl: "/opportunities/fund-gcp.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "googlecloud"
      },
      {
        id: "fund-13",
        title: "GitHub Sponsors Program",
        description: "Get sponsored to work on open source projects. Build in public and earn recurring revenue from supporters.",
        type: "funding",
        organizer: "GitHub",
        category: "Open Source Funding",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://github.com/sponsors",
        prizePool: "Recurring Sponsorships",
        eligibility: "Open source developers",
        tags: ["Open Source", "GitHub", "Sponsorship", "Recurring"],
        imageUrl: "/opportunities/fund-githubsponsors.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "github"
      },
      {
        id: "fund-14",
        title: "Indie Hackers Community Challenges",
        description: "Monthly challenges for indie founders. Build and launch products, grow revenue, and share learnings with the community.",
        type: "funding",
        organizer: "Indie Hackers",
        category: "Indie Founders",
        deadline: new Date("2025-12-31"),
        registrationUrl: "https://www.indiehackers.com/",
        prizePool: "Community Recognition",
        eligibility: "Indie makers and founders",
        tags: ["Indie", "Bootstrapping", "Community", "SaaS"],
        imageUrl: "/opportunities/fund-indiehackers.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "indiehackers"
      },
      {
        id: "fund-15",
        title: "OpenAI Startup Fund",
        description: "Investment and partnership opportunities for companies using AI to drive positive global impact.",
        type: "funding",
        organizer: "OpenAI",
        category: "AI Ventures",
        deadline: new Date("2025-03-01"),
        registrationUrl: "https://openai.com/fund",
        prizePool: "Varies",
        eligibility: "AI-first startups",
        tags: ["AI", "OpenAI", "GPT", "Investment"],
        imageUrl: "/opportunities/fund-openai.jpg",
        location: "Global",
        mode: "online",
        isActive: true,
        isFeatured: false,
        source: "openai"
      },
    ];

    let filteredOpportunities = opportunities;
    if (type && type !== "all") {
      filteredOpportunities = opportunities.filter(opp => opp.type === type);
    }

    if (featured === "true") {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.isFeatured);
    }

    const now = new Date();
    filteredOpportunities = filteredOpportunities.filter(
      opp => new Date(opp.deadline) > now
    );

    if (userCategories.length > 0) {
      const scoredOpportunities = filteredOpportunities.map(opp => {
        let relevanceScore = 0;
        
        userCategories.forEach(userCat => {
          if (opp.category.toLowerCase().includes(userCat.toLowerCase()) ||
              userCat.toLowerCase().includes(opp.category.toLowerCase())) {
            relevanceScore += 10;
          }
          
          opp.tags.forEach(tag => {
            if (tag.toLowerCase().includes(userCat.toLowerCase()) ||
                userCat.toLowerCase().includes(tag.toLowerCase())) {
              relevanceScore += 2;
            }
          });
        });
        
        return { ...opp, relevanceScore };
      });
      
      scoredOpportunities.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
      
      filteredOpportunities = scoredOpportunities;
    } else {
      filteredOpportunities.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }

    return NextResponse.json({
      success: true,
      count: filteredOpportunities.length,
      personalized: userCategories.length > 0,
      userCategories: userCategories,
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