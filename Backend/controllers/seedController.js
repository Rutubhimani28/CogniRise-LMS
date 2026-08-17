import bcrypt from "bcrypt";
import User from "../models/user";
import CourseCategories from "../models/courseCat";
import Course from "../models/course";

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

export const seedDatabase = async (req, res) => {
  try {
    // Clear existing collections
    await User.deleteMany({});
    await CourseCategories.deleteMany({});
    await Course.deleteMany({});

    // 1. Create Admin User
    const adminUser = await User.create({
      email: "admin@collegedao.io",
      password: hashPassword("Admin@123"),
      role: "admin",
      status: "verify",
      profile: {
        name: "Super Admin",
        bio: "System Administrator"
      }
    });

    // 2. Create 10 Enterprise Users
    const enterprisesData = [
      { name: "Chainlink Labs", email: "chainlink@collegedao.io", slug: "chainlink-labs", type: "Oracle Network" },
      { name: "Ethereum Foundation", email: "ethereum@collegedao.io", slug: "ethereum-foundation", type: "Layer 1 Ecosystem" },
      { name: "Polygon Ecosystem", email: "polygon@collegedao.io", slug: "polygon-ecosystem", type: "Layer 2 Scaling" },
      { name: "Solana Foundation", email: "solana@collegedao.io", slug: "solana-foundation", type: "High-Speed L1" },
      { name: "Uniswap Labs", email: "uniswap@collegedao.io", slug: "uniswap-labs", type: "DEX Protocol" },
      { name: "Aave Protocol", email: "aave@collegedao.io", slug: "aave-protocol", type: "Lending Market" },
      { name: "OpenSea Ventures", email: "opensea@collegedao.io", slug: "opensea-ventures", type: "NFT Marketplace" },
      { name: "Alchemy Web3", email: "alchemy@collegedao.io", slug: "alchemy-web3", type: "Developer Tooling" },
      { name: "ConsenSys", email: "consensys@collegedao.io", slug: "consensys-software", type: "Blockchain Solutions" },
      { name: "Binance Academy", email: "binance@collegedao.io", slug: "binance-academy", type: "Global Exchange" }
    ];

    const enterpriseUsers = [];
    for (const ent of enterprisesData) {
      const user = await User.create({
        email: ent.email,
        password: hashPassword("Enterprise@123"),
        role: "enterprise",
        status: "verify",
        profile: {
          name: ent.name,
          companySlug: ent.slug,
          companyType: ent.type,
          description: `${ent.name} leading web3 education partner.`,
          website: `https://${ent.slug}.com`
        }
      });
      enterpriseUsers.push(user);
    }

    // 3. Create 10 Student Users
    const studentsData = [
      { name: "Alex Johnson", email: "alex@collegedao.io", school: "UC Berkeley", year: "Senior" },
      { name: "Sophia Chen", email: "sophia@collegedao.io", school: "MIT", year: "Junior" },
      { name: "Liam Miller", email: "liam@collegedao.io", school: "Stanford University", year: "Graduate" },
      { name: "Emma Davis", email: "emma@collegedao.io", school: "Harvard University", year: "Sophomore" },
      { name: "Noah Wilson", email: "noah@collegedao.io", school: "Oxford University", year: "Senior" },
      { name: "Olivia Taylor", email: "olivia@collegedao.io", school: "ETH Zurich", year: "Graduate" },
      { name: "Ethan Brown", email: "ethan@collegedao.io", school: "Cornell Tech", year: "Junior" },
      { name: "Ava Martinez", email: "ava@collegedao.io", school: "Columbia University", year: "Freshman" },
      { name: "Lucas Anderson", email: "lucas@collegedao.io", school: "NYU", year: "Senior" },
      { name: "Isabella White", email: "isabella@collegedao.io", school: "University of Waterloo", year: "Graduate" }
    ];

    for (const st of studentsData) {
      await User.create({
        email: st.email,
        password: hashPassword("Student@123"),
        role: "student",
        status: "verify",
        profile: {
          name: st.name,
          school: st.school,
          yearOfSchool: st.year,
          bio: `Web3 enthusiast studying at ${st.school}.`
        }
      });
    }

    // 4. Create 10 Course Categories
    const categoriesData = [
      { name: "Smart Contracts", description: "Solidity and smart contract development" },
      { name: "DeFi & Web3", description: "Decentralized Finance protocols and infrastructure" },
      { name: "NFT & Gaming", description: "Non-Fungible Tokens, Metaverse & Web3 Gaming" },
      { name: "Layer 2 & Scaling", description: "Rollups, Zero-Knowledge proofs and sidechains" },
      { name: "Zero-Knowledge Proofs", description: "zk-SNARKs, zk-STARKs & Privacy primitives" },
      { name: "Web3 Security & Auditing", description: "Smart contract vulnerability analysis and auditing" },
      { name: "Blockchain Architecture", description: "Consensus algorithms, P2P networking and state machines" },
      { name: "Tokenomics & DAO Governance", description: "Token economics design and decentralized governance" },
      { name: "Frontend Web3 Integration", description: "Ethers.js, Viem, Wagmi and React Web3 frontends" },
      { name: "Crypto Legal & Compliance", description: "Regulatory frameworks and blockchain compliance" }
    ];

    const seededCategories = [];
    for (const cat of categoriesData) {
      const createdCat = await CourseCategories.create({
        name: cat.name,
        description: cat.description,
        createdName: "Super Admin",
        createdBy: adminUser._id,
        status: "Active",
        approvals: "approved"
      });
      seededCategories.push(createdCat);
    }

    // 5. Create 12 Sample Courses
    const coursesData = [
      { title: "Solidity & Smart Contract Security 101", catIndex: 0, entIndex: 0 },
      { title: "DeFi Protocol Architecture Masterclass", catIndex: 1, entIndex: 4 },
      { title: "Building Scalable DApps on Polygon", catIndex: 3, entIndex: 2 },
      { title: "Zero Knowledge Proofs Bootcamp", catIndex: 4, entIndex: 1 },
      { title: "Web3 Frontend Development with Wagmi & Viem", catIndex: 8, entIndex: 7 },
      { title: "NFT Smart Contracts & Minting DApps", catIndex: 2, entIndex: 6 },
      { title: "Smart Contract Auditing & Hacking 101", catIndex: 5, entIndex: 0 },
      { title: "Solana Rust Program Development", catIndex: 0, entIndex: 3 },
      { title: "Decentralized Oracle Integration Guide", catIndex: 1, entIndex: 0 },
      { title: "Tokenomics Design & DAO Treasury Management", catIndex: 7, entIndex: 5 },
      { title: "ConsenSys Web3 Developer Certification", catIndex: 6, entIndex: 8 },
      { title: "Crypto Legal Essentials for Founders", catIndex: 9, entIndex: 9 }
    ];

    for (const crs of coursesData) {
      const selectedCat = seededCategories[crs.catIndex];
      const selectedEnt = enterpriseUsers[crs.entIndex];

      await Course.create({
        title: crs.title,
        slug: crs.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: `Comprehensive course covering ${crs.title} with practical hands-on projects.`,
        category: selectedCat._id,
        createdBy: selectedEnt._id,
        status: "Published",
        enterpriseName: selectedEnt.profile.name,
        modules: []
      });
    }

    res.status(200).json({
      status: true,
      message: "Database seeded with 10+ Enterprises, 10+ Students, 10+ Categories, and 12+ Courses!",
      counts: {
        admin: 1,
        enterprises: enterpriseUsers.length,
        students: studentsData.length,
        categories: seededCategories.length,
        courses: coursesData.length
      }
    });
  } catch (error) {
    console.error("Seeding Error:", error);
    res.status(500).json({
      status: false,
      message: error.message || "Failed to seed database"
    });
  }
};
