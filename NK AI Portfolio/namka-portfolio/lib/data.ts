export const auditData = [
    {
        num: "01",
        name: "NAMKA NFT Marketplace",
        type: "Web3 · React · ThirdWeb",
        verdict: "upgrade" as const,
        action: "Keep the Web3 positioning. Add AI-generated product descriptions, AI image tagging, and a Gemini-powered search. Transform it from a demo into a live AI-enhanced marketplace.",
        link: "https://namka-marketplace.netlify.app/"
    },
    {
        num: "02",
        name: "DevelopMe Mentorship",
        type: "Platform · UI Design · Behance",
        verdict: "replace" as const,
        action: "Lives on Behance only — no live demo, no interactivity. Replaced with an AI Mentor Matching demo: describe your goals, Gemini suggests the right mentor profile.",
        link: "https://www.behance.net/gallery/173247639/Develop-Me"
    },
    {
        num: "03",
        name: "DevConnect Platform",
        type: "SaaS · React · Matching",
        verdict: "upgrade" as const,
        action: "Good concept, but rendered blank in production. Fixed, then upgraded with AI Dev Brief Generator: clients describe their project, Gemini writes a structured brief.",
        link: "https://devconnect-v2.netlify.app/"
    },
    {
        num: "04",
        name: "Weather App",
        type: "API · Vanilla JavaScript",
        verdict: "replace" as const,
        action: "Basic JS from 2022, not competitive. Replaced with AI Weather Advisor: same data, but Gemini interprets conditions and tells you what to wear, bring, and plan.",
        link: "https://namka-weather-app.netlify.app/"
    },
    {
        num: "05",
        name: "Food Recipes API",
        type: "API · React · MealDB",
        verdict: "replace" as const,
        action: "Tutorial-level project. Replaced with AI Chef: describe what's in your fridge, Gemini generates a full recipe with steps, nutrition, and plating suggestions.",
        link: "https://foodrecipes-api.netlify.app/"
    }
];

export const demos = [
    {
        slug: "website-roaster",
        tag: "⭐ Featured Demo · New Build",
        icon: "🔥",
        name: "AI Website Roaster",
        desc: "Enter any URL. Gemini audits the website in seconds — scoring design, copy, UX, SEO, and conversion potential. Returns a brutal, honest, actionable report with a score out of 100.",
        pills: ["Gemini API", "Next.js", "Tailwind"],
        featured: true   // spans 2 columns, has a mock output panel on the right
    },
    {
        slug: "ai-chef",
        tag: "Replaces: Food Recipes API",
        icon: "👨‍🍳",
        name: "AI Chef",
        desc: "Describe what's in your fridge. Gemini generates a full recipe with steps, timing, nutrition, and plating suggestions.",
        pills: ["Gemini API", "React"]
    },
    {
        slug: "weather-advisor",
        tag: "Replaces: Weather App",
        icon: "🌤️",
        name: "AI Weather Advisor",
        desc: "Not just the temperature. Gemini interprets today's conditions for your plans — what to wear, whether to reschedule, what to expect.",
        pills: ["Gemini API", "Weather API", "React"]
    },
    {
        slug: "mentor-matcher",
        tag: "Replaces: DevelopMe",
        icon: "🎓",
        name: "AI Mentor Matcher",
        desc: "Describe your learning goals and experience level. Gemini returns a personalised mentor profile, learning path, and weekly schedule.",
        pills: ["Gemini API", "React", "Next.js"]
    },
    {
        slug: "dev-brief",
        tag: "Upgrades: DevConnect",
        icon: "📋",
        name: "AI Dev Brief Generator",
        desc: "Clients describe their project in plain English. Gemini transforms it into a professional dev brief with scope, stack, milestones, and budget ranges.",
        pills: ["Gemini API", "React", "PDF Export"]
    },
    {
        slug: "nft-describer",
        tag: "Upgrades: NAMKA Marketplace",
        icon: "🎨",
        name: "AI NFT Describer",
        desc: "Upload an NFT image. Gemini generates a compelling collector description, rarity analysis, and suggested listing price.",
        pills: ["Gemini Vision", "ThirdWeb", "React"]
    }
];

export const clients = [
    { name: "Micassa Suites", location: "Kampala, Uganda", year: "2024", type: "Full-stack · Brand · SEO", tags: ["Web Dev", "Brand/CI", "Cyber Security"], hero: true },
    { name: "Sifinet Connect", location: "Bloemfontein · National", year: "2022", type: "Full-stack · Brand", tags: ["Web Dev", "Design"] },
    { name: "IDBS Online Learning", location: "Cape Town · International", year: "2020", type: "Web3 · Education", tags: ["Web3", "Platform"] },
    { name: "Digital Info Systems", location: "Cape Town · National", year: "2021", type: "Full-stack · Design", tags: ["Dev", "Graphic Design"] },
    { name: "UDYNET Wi-Fi", location: "Bloemfontein · National", year: "2019", type: "Video · Web · Brand", tags: ["Video", "Web"] },
];
