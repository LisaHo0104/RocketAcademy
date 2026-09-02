export const asset = (name: string) => `/assets/canva/${name}`;

export const projectLinks = {
  loveShield: "https://loveshieldproject.my.canva.site/love-shield-hpv-project",
  bloomberg:
    "https://a104995715.myportfolio.com/campaign-proposal-for-bloomberg-philanthropies",
  loreal: "https://a104995715.myportfolio.com/campaign-proposal-for-loreal",
  personalTikTok:
    "https://www.tiktok.com/@jcta_tt?is_from_webapp=1&sender_device=pc",
  nivea: "https://a104995715.myportfolio.com/sportsadvertisingmedia",
  genderlessBroom:
    "https://a104995715.myportfolio.com/campaign-proposal-for-loreal",
};

type AcademicProject = {
  ctaLabel: string;
  designation: string;
  href: string;
  imageHeight: number;
  imageFit: "contain" | "cover";
  imageWidth: number;
  name: string;
  quote: string;
  src: string;
};

export type CareerJourneyMedia = {
  alt: string;
  className?: string;
  description: string;
  details?: string;
  eyebrow: string;
  id: number;
  imageClassName?: string;
  metric?: string;
  thumbnail: string;
  title: string;
  videoSrc?: string;
};

export type CareerJourneyProject = {
  href: string;
  highlights: {
    label: string;
    value: string;
  }[];
  media?: CareerJourneyMedia[];
  period: string;
  role: string;
  summary: string[];
  title: string;
  video?: {
    alt: string;
    caption: string;
    poster: string;
    src: string;
    title: string;
  };
};

type AcademicBaseEntry = {
  body: string;
  context: string;
  highlight: string;
  title: string;
  year: string;
};

export type AcademicImageEntry = AcademicBaseEntry & {
  alt: string;
  artifact: "document" | "photo" | "reference";
  image: string;
  note?: never;
};

export type AcademicNoteEntry = AcademicBaseEntry & {
  alt?: never;
  artifact?: never;
  image?: never;
  note: {
    caption: string;
    headline: string;
  };
};

export type AcademicEntry = AcademicImageEntry | AcademicNoteEntry;

export const academicEntries = [
  {
    year: "2023",
    context: "Swinburne University",
    title:
      "Scholarship of Talents Year of 2023 - 2026 (Top 10%) Swinburne Vietnam (HCMC)",
    highlight: "Scholarship of Talents",
    body: "Top-performing student for outstanding academic achievement and strong understanding of public relations principles and communication strategies.",
    image: "/assets/portfolio/academic-scholarship-2023.png",
    alt: "Swinburne Scholarship of Talents certificate",
    artifact: "document",
  },
  {
    year: "2024",
    context: "Introduction to Public Relations Theory & Practice",
    title:
      "Best Performance Award in Introduction to Public Relations Theory & Practice",
    highlight: "Best Performance Award",
    body: "Top-performing student for outstanding academic achievement and strong understanding of public relations principles and communication strategies.",
    image: "/assets/portfolio/academic-swinburne-2024.png",
    alt: "Tien holding a Swinburne certificate",
    artifact: "photo",
  },
  {
    year: "2025",
    context: "Global Public Relations Practice",
    title: "Best Unit Performance in Global Public Relations Practice",
    highlight: "Highest overall performance in the unit",
    body: "Highest overall performance in the unit through developing an integrated PR campaign, demonstrating strengths in strategic planning, stakeholder communication, and campaign evaluation.",
    image: "/assets/portfolio/academic-reference-2025.png",
    alt: "Academic reference letter for Global Public Relations Practice",
    artifact: "reference",
  },
  {
    year: "2026",
    context: "Final year student",
    title: "Ready for What's Next",
    highlight: "GPA of 3.6/4.0",
    body: "Now in my final year with a GPA of 3.6/4.0. I continue to bridge classroom learning with real-world experiences through internships, campaigns, and personal projects.",
    note: {
      caption: "Final Year Student",
      headline: "GPA 3.6/4.0",
    },
  },
] satisfies AcademicEntry[];

export const academicProjects = [
  {
    name: "[2026] - Love & Shield",
    designation: "VNVC - PR Campaign",
    quote:
      "How do you talk about a sensitive health issue in a way that young people actually want to engage with? Love & Shield reimagines HPV awareness through strategic storytelling, digital engagement, and relatable communication, making prevention feel relevant, approachable, and empowering for Gen Z in Vietnam.",
    href: projectLinks.loveShield,
    src: "/assets/portfolio/project-love-shield.png",
    ctaLabel: "View Project",
    imageHeight: 1402,
    imageFit: "contain",
    imageWidth: 1122,
  },
  {
    name: "[2025] - Plastic-free India",
    designation: "Bloomberg Philanthropies - PR Campaign",
    quote:
      "Can strategic communication influence behaviour across cultural boundaries? Plastic-free India challenged me to think as a global PR practitioner, developing a culturally informed communication strategy that encouraged sustainable habits among young urban communities in India. By balancing local values with strategic communication, the campaign aimed to reduce plastic consumption, empower community action, and support India's vision of a plastic-free future.",
    href: projectLinks.bloomberg,
    src: "/assets/portfolio/project-plastic-free-india.png",
    ctaLabel: "View Project",
    imageHeight: 838,
    imageFit: "contain",
    imageWidth: 574,
  },
  {
    name: "[2025] - L'Oréal Men Expert",
    designation: "IMC Campaign",
    quote:
      'How do you launch a new men\'s grooming product while strengthening an established brand? This integrated marketing communications campaign repositioned beard care as an expression of self-care and emotional connection. Guided by the big idea "Care for Yourself, Care for Your Lovers," the campaign aimed to build awareness, inspire behaviour change, strengthen brand loyalty, and support the successful launch of the new product.',
    href: projectLinks.loreal,
    src: "/assets/portfolio/project-loreal-men-expert.png",
    ctaLabel: "View Project",
    imageHeight: 678,
    imageFit: "contain",
    imageWidth: 1012,
  },
  {
    name: "[2024] - NIVEA Sun",
    designation: "Digital Marketing Campaign",
    quote:
      'Marketing should inspire action, not just attention. This campaign repositions sun protection as part of an active lifestyle by combining digital marketing with a purpose-driven CSR initiative. Through "Stay Active, Stay Protected," the campaign encourages healthier habits while reinforcing the brand\'s core value of care.',
    href: projectLinks.nivea,
    src: "/assets/portfolio/project-nivea-sun.png",
    ctaLabel: "View Project",
    imageHeight: 632,
    imageFit: "contain",
    imageWidth: 890,
  },
  {
    name: "[2024] - The Genderless Broom",
    designation: "Tuva Communication - PR Campaign",
    quote:
      'Can communication turn an everyday object into a movement? Sometimes the simplest objects carry the strongest messages. By transforming the humble broom into a symbol of equality, this campaign challenged traditional gender stereotypes through an interactive exhibition, community activation, and TikTok challenge. Using creative storytelling and public participation, it encouraged audiences to rethink gender roles, share responsibilities, and "sweep away" outdated stereotypes.',
    href: projectLinks.genderlessBroom,
    src: "/assets/portfolio/project-genderless-broom.png",
    ctaLabel: "View Project",
    imageHeight: 1090,
    imageFit: "contain",
    imageWidth: 778,
  },
] satisfies AcademicProject[];

export const careerJourneyProjects = [
  {
    title: "Hope Volunteer Club",
    href: "https://www.facebook.com/tinhnguyenhope.hcm",
    role: "Media & PR Member",
    period: "Oct 2023 - Dec 2024",
    highlights: [
      {
        value: "250M VND",
        label: "raised through community fundraising campaigns",
      },
      {
        value: "+34.4%",
        label: "growth in social media engagement",
      },
      {
        value: "2023-2024",
        label: "campaign ideation, content, promotion, and event support",
      },
    ],
    summary: [
      "My journey didn't begin with a business; it began with a community. Joining Hope Volunteer Club gave me the opportunity to contribute from idea to execution, from brainstorming fundraising campaigns and creating communication content to promoting volunteer events and working closely with team members and community partners.",
      "Watching our campaigns raise 250 million VND and increase social media engagement by 34.4% taught me that thoughtful communication has the power to inspire action, strengthen communities, and create meaningful impact beyond business.",
      "More importantly, it was where I first discovered that the most rewarding part of communication is connecting people with a shared purpose.",
    ],
    media: [
      {
        id: 1,
        eyebrow: "Community home",
        title: "Hope Volunteer Club",
        description:
          "A volunteer community in Ho Chi Minh City where my communication journey first took shape through fundraising, event promotion, and purposeful storytelling.",
        details: "CLB Tinh Nguyen HOPE Tp.HCM",
        metric: "18K followers",
        thumbnail: "/assets/portfolio/hope-facebook-profile.png",
        alt: "Hope Volunteer Club Facebook profile and cover image",
        className: "career-layout-card-wide",
      },
      {
        id: 2,
        eyebrow: "Event recap",
        title: "Hoi Am Chuyen Ke",
        description:
          "Recap content that documented meaningful activities, from performances to gift-giving and shared meals with children and families.",
        details: "Tet Am 2025",
        metric: "5 comments · 13 shares",
        thumbnail: "/assets/portfolio/hope-tet-am-recap.png",
        alt: "Hope Volunteer Club Tet Am event recap collage",
        className: "career-layout-card-tall",
      },
      {
        id: 3,
        eyebrow: "Fundraising call",
        title: "Warmth Campaign",
        description:
          "A winter donation appeal for children in Buon Drang Phok, designed to turn care into immediate community support.",
        details: "Xuan Yeu Thuong 2025",
        metric: "127 reactions · 24 shares",
        thumbnail: "/assets/portfolio/hope-winter-call.png",
        alt: "Hope Volunteer Club winter donation appeal post",
        className: "career-layout-card-tall",
      },
      {
        id: 4,
        eyebrow: "Team moment",
        title: "On-site Connection",
        description:
          "A personal memory from the field that reminds me why communication work matters most when it brings people closer together.",
        details: "Buon Drang Phok, Dak Lak",
        thumbnail: "/assets/portfolio/hope-tet-am-team.png",
        alt: "Three Hope Volunteer Club members standing in front of a Tet Am backdrop",
        className: "career-layout-card-square",
      },
      {
        id: 5,
        eyebrow: "Campaign launch",
        title: "Manh Ghep Tuoi Tho",
        description:
          "A Mid-Autumn campaign launch that used warm illustration and child-centered storytelling to invite community participation.",
        details: "Tet Trung Thu 2024",
        metric: "96 reactions · 54 comments",
        thumbnail: "/assets/portfolio/hope-mid-autumn-project.png",
        alt: "Hope Volunteer Club Mid-Autumn 2024 campaign announcement",
        className: "career-layout-card-wide",
      },
      {
        id: 6,
        eyebrow: "Early campaign",
        title: "Hoi Cho Don Trang",
        description:
          "One of the early Mid-Autumn communication pieces that helped me learn how visual stories can build participation before an event.",
        details: "Tet Trung Thu 2023",
        metric: "30 comments · 3 shares",
        thumbnail: "/assets/portfolio/hope-mid-autumn-2023.png",
        alt: "Hope Volunteer Club Mid-Autumn 2023 fair post",
        className: "career-layout-card-square",
      },
      {
        id: 7,
        eyebrow: "Volunteer recruitment",
        title: "Final Puzzle Piece",
        description:
          "Recruitment content inviting volunteers to complete the campaign team and help create a full Mid-Autumn night for children.",
        details: "Manh Ghep Tuoi Tho",
        thumbnail: "/assets/portfolio/hope-mid-autumn-recruitment.png",
        alt: "Hope Volunteer Club volunteer recruitment post with puzzle visual",
        className: "career-layout-card-tall",
      },
    ],
  },
  {
    title: "Swinburne Vietnam - HCMC",
    href: "https://www.facebook.com/SwinburneHCM",
    role: "VJ / Content Creator / Editor",
    period: "May 2024 - April 2025",
    highlights: [
      {
        value: "VJ",
        label: "presenting on camera and interviewing students",
      },
      {
        value: "Video",
        label: "filming campus events and editing social content",
      },
      {
        value: "Brand Voice",
        label: "turning student stories into clear audience connection",
      },
    ],
    summary: [
      "Sometimes the best opportunities begin in familiar places. Returning to Swinburne Vietnam as a VJ and Content Creator allowed me to tell authentic student stories while developing my skills in digital storytelling, video production and audience engagement. Whether I was interviewing students, presenting on camera, filming campus events or editing videos, I learned that every piece of content represents a brand's voice. This experience taught me how authenticity, creativity and clear communication work together to build trust and meaningful audience connections.",
    ],
    media: [
      {
        id: 1,
        eyebrow: "Facebook profile",
        title: "Swinburne Vietnam - HCMC",
        description:
          "The official Swinburne Vietnam HCMC Facebook presence, where student-facing content, campus updates, and brand storytelling came together.",
        details: "Swinburne Vietnam Alliance Program",
        metric: "10K followers",
        thumbnail: "/assets/portfolio/swinburne-facebook-profile.png",
        alt: "Swinburne Vietnam HCMC Facebook profile and cover image",
      },
      {
        id: 2,
        eyebrow: "Event post",
        title: "Swinburne Experience Day 2025",
        description:
          "Admissions and event content introducing prospective students to the Top 1 percent global university program.",
        details: "Experience Day 2025",
        thumbnail: "/assets/portfolio/swinburne-experience-day-post.png",
        alt: "Swinburne Experience Day 2025 Facebook post",
      },
      {
        id: 3,
        eyebrow: "Video post",
        title: "Gordon Campbell Interview",
        description:
          "Campus video content featuring Dr Gordon Campbell and Swinburne student-life storytelling.",
        details: "Swinburne Life",
        metric: "848 reactions",
        thumbnail: "/assets/portfolio/swinburne-gordon-video-post.png",
        alt: "Swinburne Life video post featuring Dr Gordon Campbell",
      },
      {
        id: 4,
        eyebrow: "Campus moment",
        title: "Student Connection",
        description:
          "A student ambassador moment that reflects the warmth and visual identity of Swinburne Vietnam's campus community.",
        details: "Swinburne Vietnam HCMC",
        thumbnail: "/assets/portfolio/swinburne-team-red-shirts.png",
        alt: "Three Swinburne Vietnam students wearing red shirts at a table",
      },
    ],
    video: {
      title: "Campus stories in motion",
      caption: "Selected VJ, content creation, and editing work for Swinburne Vietnam - HCMC.",
      src: "/assets/portfolio/swinburne-vietnam-content-creator-silent.mp4",
      poster: "/assets/portfolio/swinburne-vietnam-content-creator-poster.png",
      alt: "Swinburne Vietnam content creator screen recording",
    },
  },
  {
    title: "XOCOATI Saigon",
    href: "https://www.instagram.com/xocoati.saigon/",
    role: "Marketing Assistant",
    period: "Nov 2024 - Feb 2025",
    highlights: [
      {
        value: "5,000 to 7,200",
        label: "social media follower growth",
      },
      {
        value: "+20%",
        label: "increase in workshop bookings",
      },
      {
        value: "+40%",
        label: "increase in campaign reach",
      },
    ],
    summary: [
      "Stepping into XOCOATI Saigon marked my first experience in commercial marketing. Working with a lifestyle and F&B brand showed me how creativity, strategy and data come together to support business goals. From planning content and writing copy to designing promotional materials and supporting campaign execution, I contributed to initiatives that grew social media followers from 5,000 to 7,200, increased workshop bookings by 20%, and achieved a 40% increase in campaign reach.",
      "More than the numbers, this experience helped me understand that successful marketing isn't just about creating attractive content - it's about delivering the right message to the right audience with a clear purpose.",
    ],
    media: [
      {
        id: 1,
        eyebrow: "Instagram profile",
        title: "xocoati.saigon",
        description:
          "The XOCOATI Saigon Instagram presence, where product storytelling, workshop promotion, and lifestyle content helped grow an engaged F&B community.",
        details: "XOCOATI Saigon",
        metric: "5,000 to 7,200 followers",
        thumbnail: "/assets/portfolio/xocoati-instagram-profile.png",
        alt: "XOCOATI Saigon Instagram profile",
        className: "career-layout-card-wide",
      },
      {
        id: 2,
        eyebrow: "Workshop campaign",
        title: "Hidden Chocolate Workshop",
        description:
          "Social content positioning the handcrafted chocolate workshop as a memorable Ho Chi Minh City lifestyle experience.",
        details: "Handcrafted Chocolate Workshop",
        metric: "+20% workshop bookings",
        thumbnail: "/assets/portfolio/xocoati-hidden-workshop.png",
        alt: "XOCOATI handcrafted chocolate workshop promotional post",
        className: "career-layout-card-tall",
      },
      {
        id: 3,
        eyebrow: "Workshop promotion",
        title: "Date Idea",
        description:
          "A workshop-focused creative angle designed to make the experience feel relatable, shareable, and easy to book.",
        details: "Ho Chi Minh City",
        metric: "+40% campaign reach",
        thumbnail: "/assets/portfolio/xocoati-date-idea-workshop.png",
        alt: "XOCOATI date idea handcrafted chocolate workshop post",
        className: "career-layout-card-tall",
      },
      {
        id: 4,
        eyebrow: "Product story",
        title: "Cocoa Drinks",
        description:
          "A warm product-focused visual highlighting XOCOATI's cocoa drinks, marshmallow, and brownie offering.",
        details: "XOCOATI Saigon",
        thumbnail: "/assets/portfolio/xocoati-cocoa-menu.png",
        alt: "XOCOATI cocoa drinks marshmallow and brownie product post",
        className: "career-layout-card-square",
      },
      {
        id: 5,
        eyebrow: "Brand experience",
        title: "Chocolate Workshop",
        description:
          "Behind-the-scenes workshop content that brought the hands-on chocolate-making experience closer to the audience.",
        details: "XOCOATI Chocolate Workshop",
        thumbnail: "/assets/portfolio/xocoati-chocolate-workshop.png",
        alt: "XOCOATI chocolate workshop behind-the-scenes post",
        className: "career-layout-card-square",
      },
      {
        id: 6,
        eyebrow: "XOCOATI Saigon in motion",
        title: "Campaign Visuals",
        description:
          "Selected social and campaign visuals from my marketing assistant work.",
        details: "XOCOATI Saigon",
        thumbnail: "/assets/portfolio/xocoati-hidden-workshop.png",
        videoSrc: "/assets/portfolio/xocoati-saigon-screen-recording-silent.mp4",
        alt: "XOCOATI Saigon marketing assistant screen recording",
        className: "career-layout-card-video",
      },
    ],
  },
  {
    title: "Personal TikTok Channel",
    href: projectLinks.personalTikTok,
    role: "Content Creator",
    period: "Present",
    highlights: [
      {
        value: "363",
        label: "followers",
      },
      {
        value: "43.2K",
        label: "likes",
      },
      {
        value: "Melbourne",
        label: "lifestyle content through an international student lens",
      },
    ],
    summary: [
      "I believe the best way to learn marketing is by becoming a creator myself. Through my personal TikTok channel, I am building my own brand by creating lifestyle content that showcases Melbourne through the eyes of an international student.",
      "The channel serves as a creative space where I continuously test content strategies, analyse audience engagement, and develop my storytelling and personal branding skills.",
    ],
    media: [
      {
        id: 1,
        eyebrow: "Creator profile",
        title: "miinmelb",
        description:
          "My personal TikTok channel, where I create lifestyle content about Melbourne and use each post to test storytelling, audience engagement, and personal branding.",
        details: "@jcta_tt",
        metric: "43.2K likes",
        thumbnail: "/assets/portfolio/personal-tiktok-channel.png",
        alt: "Personal TikTok channel profile showing Melbourne lifestyle content",
        className: "career-layout-card-wide career-layout-card-full-image",
        imageClassName: "career-layout-card-image-contain",
      },
    ],
  },
] satisfies CareerJourneyProject[];

export const skillGroups = [
  {
    title: "Communication & Client Understanding",
    items: [
      "In-depth interviewing and active listening",
      "Clear communication",
      "Meeting recap, follow-up, and action alignment",
    ],
  },
  {
    title: "Planning, Coordination & Execution",
    items: [
      "Timeline building and checklist-based planning",
      "On-site coordination with vendors and suppliers",
      "Real-time problem-solving under pressure",
      "Supporting event schedules and logistics flow",
    ],
  },
  {
    title: "Visual Thinking & Styling Support",
    items: [
      "Moodboard creation for decor and spatial layout",
      "Understanding setup flow",
      "Translating concepts into physical execution",
      "Basic knowledge of materials, printing, and visual touchpoints",
    ],
  },
];

export const featureImages = {
  heroSide: asset("2baae55a885ff2ebb8bf396fc68464f8.png"),
  heroFront: asset("3f13db76583904558f599e31d592f75d.png"),
  heroCameraStrip: asset("22937813d9ec33d2c8ffd34dcff26b9c.png"),
  quotePortrait: asset("ef40d1ab1abba4cd140cb4901ac2bc2a.png"),
  swimburnePhoto: asset("08782757fb77556fd69a1e4d4d970715.png"),
  gradeNinetyOne: asset("f844499dce9c0deadcb82d16ac963fe2.png"),
  workSetup: asset("b359602793bc1f8ac986f2fd920b5133.png"),
  workChecklist: asset("ca161e22754d3b7561486bfd01275ab9.png"),
  socialBanner: asset("d8559cf53ca69d64dfd6b4ce93e59d90.png"),
};

export const archiveImages = [
  "011b726a47c05d9fa03ac5e062a90c0a.png",
  "056241181b8c86d860fbbb7d8a6287f9.png",
  "08782757fb77556fd69a1e4d4d970715.png",
  "0916bfe24491893055cffbc6e86d96e9.png",
  "0b528003e32debf575a1dd1c3f5fbd2b.png",
  "0f213c5f183d76da5206588e07b91913.png",
  "1075dee313e93bcb2b5ef62b6b50f638.png",
  "120100e1c11bbad402245005f1221a41.png",
  "1500b036162a2c225c73994514ad6566.png",
  "15bab295783b1eb16db3b472b11920d4.png",
  "19bfd57926854ba2d8436220e2563f33.png",
  "1dff278f68acf95f628599bc4b3b68e5.jpg",
  "1eb08d1ae768e846260c199c063bf19c.png",
  "219ba31fc90650ec8583e2a6a4dd8a6b.png",
  "22937813d9ec33d2c8ffd34dcff26b9c.png",
  "28d5b805cf061a0ce298ae6bce456b04.png",
  "2a9104612a084d63c8b4b0c28fc24ba7.png",
  "2baae55a885ff2ebb8bf396fc68464f8.png",
  "2c73908d6d3754e61fa99138f03d4fb6.jpg",
  "2e9899aaa702f83eae7fa2b44112016c.png",
  "3631074af198997fcbfeb86e9d5cce82.png",
  "37d2e13c8c0b325d0a16fae65f0053aa.png",
  "38de14e23f8bd54870acaad0868b9591.png",
  "3a0d64d82ade17fd731b9952da7d47bc.png",
  "3dfc73376b8be0f953cd9176e5836a6c.png",
  "3f13db76583904558f599e31d592f75d.png",
  "458e648f34d7d5dd42bf9570b7368a5c.png",
  "4adf7af218b6a51c3bd4bed406c35000.png",
  "4b5da71e75710431efd19ff6cc388562.png",
  "4d753a83b8691a469c9ee769d387f931.png",
  "532f9ad01d5a6ec152a4bf3439c5f6e7.png",
  "5e10dffc034a9b5bc13c9aebde3212bd.png",
  "5e3ccdc15e59ee89fb9ab9016dc6a649.png",
  "647f34be760d3d1b1e0ff6854c756554.png",
  "6b39898d0db205f9002c74a9b6d210da.png",
  "71b8cbfbf19089dcecb6888c11be0835.jpg",
  "743cebccfc7427e87fa31f37e7031caf.png",
  "759922f507e0efb8e10b889e34f851d7.png",
  "75ff34c5372a7850e8540eafdfa1e0b2.png",
  "76d10c164da58a58467969ab169c59e7.png",
  "7760582944780372a338f03a5c0d7e97.png",
  "7b04ba044083267936e89c2fc495c743.png",
  "7efb51e348955a263e675263b6c826a0.png",
  "8b7825ef58c5f2740582296d4357d47c.png",
  "8c445ebc40397075ae10fa85d736c04d.png",
  "8ed31bdc331ebf75a15de9308fe41e60.png",
  "8f6ce656467ac56e53b8495f9463b20f.png",
  "9142a6b5e287ebbb6db47c0b26a4166d.png",
  "999e1f7ff7ec1f4bbc95416362d16cd0.png",
  "9e205330bcac2dd7c2ca65f298008c54.png",
  "9f09513bf78fa00eab2a7a7d95fcdc83.png",
  "9f4ebad119cc2f0f8a471b087c0b6d20.png",
  "a0e2849c41e3a26590d72465c5a86ec7.png",
  "a49f2c89819e8ebed35d767d132f941e.png",
  "a58a7a0666706241667c6524d356be56.png",
  "ae229187c3e295743b44821536823b7b.png",
  "afb82670850e8014b117e79258a07fa1.png",
  "b017b8b3705de1399cca6d6b3b5e5dee.png",
  "b359602793bc1f8ac986f2fd920b5133.png",
  "b4db80c86526e2652f3108376b8683a7.png",
  "c3724de0d24960305eaa56b9a594d915.png",
  "c6baaeb8f2bf462b1f83fc356aae8b92.png",
  "c833c7534382b5960d058cd4bb2d2cb6.png",
  "c962811ebeb9a1addf8088e950abb909.png",
  "ca161e22754d3b7561486bfd01275ab9.png",
  "cb80e7e7d9a944a361051ad743baf867.png",
  "d75878706b5e33b58f541ecc829bffbe.png",
  "d8559cf53ca69d64dfd6b4ce93e59d90.png",
  "ddedbeed2a0ecf9f028221b669d2963a.png",
  "ef40d1ab1abba4cd140cb4901ac2bc2a.png",
  "f77916dc022a0f05f4e911ab1a3d502b.png",
  "f844499dce9c0deadcb82d16ac963fe2.png",
  "f8b0a17f4ec39f0ef4a6154ea3a94dc7.png",
  "fdb0755cbc7a07fa2452d527f699ab94.png",
].map(asset);
