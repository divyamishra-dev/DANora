import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data
  let complaints = [
    { id: "1", type: "AC Issue", description: "AC not cooling in Room 302", priority: "High", status: "In Progress", userId: "21BCE0001", createdAt: new Date().toISOString() },
    { id: "2", type: "Room Cleaning", description: "Please clean room 302", priority: "Low", status: "Resolved", userId: "21BCE0001", createdAt: new Date().toISOString() }
  ];

  let userData = {
    name: "Divya Mishra",
    regNumber: "21BCE0001",
    hostelBlock: "Block-D",
    roomNumber: "302"
  };

  let userVotes: Record<string, 'like' | 'dislike' | null> = {};

  let messData = {
    veg: [
      { id: "v1", name: "Paneer Butter Masala", likes: 120, dislikes: 5 },
      { id: "v2", name: "Roti", likes: 95, dislikes: 2 },
      { id: "v3", name: "Jeera Rice", likes: 80, dislikes: 8 },
      { id: "v4", name: "Dal Tadka", likes: 110, dislikes: 3 },
      { id: "v5", name: "Mix Veg Curry", likes: 65, dislikes: 12 },
      { id: "v6", name: "Gulab Jamun", likes: 210, dislikes: 1 }
    ],
    nonVeg: [
      { id: "nv1", name: "Chicken Curry", likes: 150, dislikes: 10 },
      { id: "nv2", name: "Roti", likes: 95, dislikes: 2 },
      { id: "nv3", name: "Egg Roast", likes: 70, dislikes: 15 },
      { id: "nv4", name: "Fish Fry", likes: 130, dislikes: 8 },
      { id: "nv5", name: "Chicken Biryani", likes: 250, dislikes: 4 },
      { id: "nv6", name: "Mutton Keema", likes: 180, dislikes: 12 },
      { id: "nv7", name: "Butter Chicken", likes: 190, dislikes: 5 },
      { id: "nv8", name: "Fish Curry", likes: 110, dislikes: 7 },
      { id: "nv9", name: "Egg Biryani", likes: 140, dislikes: 9 }
    ],
    special: [
      { id: "s1", name: "Masala Dosa", likes: 80, dislikes: 2 },
      { id: "s2", name: "Sambhar", likes: 60, dislikes: 5 },
      { id: "s3", name: "Vada", likes: 75, dislikes: 3 },
      { id: "s4", name: "Idli", likes: 50, dislikes: 10 },
      { id: "s5", name: "Coconut Chutney", likes: 90, dislikes: 1 },
      { id: "s6", name: "Filter Coffee", likes: 120, dislikes: 0 }
    ],
    nightMess: [
      { id: "n1", name: "Maggi", status: "Available", quantity: "Available" },
      { id: "n2", name: "Bread Omelette", status: "Running Low", quantity: "Limited" },
      { id: "n3", name: "Cold Coffee", status: "Out of Stock", quantity: "Out of Stock" },
      { id: "n4", name: "Sandwich", status: "Available", quantity: "Available" },
      { id: "n5", name: "Pasta", status: "Available", quantity: "Available" },
      { id: "n6", name: "French Fries", status: "Running Low", quantity: "Limited" }
    ]
  };

  let outingStatus = {
    isOut: false,
    leaveTime: null as string | null,
    timeUsedTodayMs: 0,
  };

  const laundryData = {
    queueCount: 15,
    estimatedReturn: "Ready by 6 PM",
    suggestion: "Better to give tomorrow morning"
  };

  const notices = [
    { id: "1", title: "Water supply maintenance on Sunday", category: "Maintenance", date: "2024-04-05" },
    { id: "2", title: "Hostel Day celebrations next week", category: "General", date: "2024-04-06" },
    { id: "3", title: "Strict adherence to outing timings", category: "Urgent", date: "2024-04-04" }
  ];

  // API Routes
  app.post("/api/login", (req, res) => {
    const { regNumber } = req.body;
    if (regNumber) userData.regNumber = regNumber;
    res.json(userData);
  });

  app.post("/api/user/update", (req, res) => {
    userData = { ...userData, ...req.body };
    res.json(userData);
  });

  app.get("/api/complaints", (req, res) => {
    res.json(complaints);
  });

  app.post("/api/complaints", (req, res) => {
    const newComplaint = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    complaints.unshift(newComplaint);
    res.json(newComplaint);
  });

  app.get("/api/mess", (req, res) => {
    res.json({ messData, userVotes });
  });

  app.post("/api/mess/vote", (req, res) => {
    const { category, itemId, type } = req.body; // type: 'like' or 'dislike'
    const cat = category as keyof typeof messData;
    
    if (Array.isArray(messData[cat])) {
      const items = messData[cat] as any[];
      const item = items.find(i => i.id === itemId);
      
      if (item) {
        const currentVote = userVotes[itemId];
        
        // If clicking the same button again, remove the vote
        if (currentVote === type) {
          if (type === 'like') item.likes--;
          else item.dislikes--;
          userVotes[itemId] = null;
        } else {
          // If switching from like to dislike or vice versa
          if (currentVote) {
            if (currentVote === 'like') item.likes--;
            else item.dislikes--;
          }
          
          // Add new vote
          if (type === 'like') item.likes++;
          else item.dislikes++;
          userVotes[itemId] = type;
        }
      }
    }
    res.json({ messData, userVotes });
  });

  app.get("/api/outing", (req, res) => {
    res.json(outingStatus);
  });

  app.post("/api/outing/start", (req, res) => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 7 || hours >= 19) {
      return res.status(400).json({ error: "Outing only allowed between 7 AM and 7 PM" });
    }
    outingStatus = { ...outingStatus, isOut: true, leaveTime: now.toISOString() };
    res.json(outingStatus);
  });

  app.post("/api/outing/end", (req, res) => {
    if (outingStatus.isOut && outingStatus.leaveTime) {
      const duration = new Date().getTime() - new Date(outingStatus.leaveTime).getTime();
      outingStatus.timeUsedTodayMs += duration;
    }
    outingStatus = { ...outingStatus, isOut: false, leaveTime: null };
    res.json(outingStatus);
  });

  app.post("/api/health/emergency", async (req, res) => {
    const { issue } = req.body;
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is in a hostel and reporting a health emergency: "${issue}". 
        Provide immediate, actionable, and specific first-aid advice in a numbered list. 
        Include steps like "1. Sit down and rest", "2. Drink water", etc., based on the issue.
        Keep it calm, professional, and helpful. 
        Note: Authorities and nearest hospital are being notified.`,
      });
      res.json({ advice: response.text });
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI advice" });
    }
  });

  app.get("/api/laundry", (req, res) => {
    res.json(laundryData);
  });

  app.get("/api/notices", (req, res) => {
    res.json(notices);
  });

  app.post("/api/sos", (req, res) => {
    console.log("SOS Alert Received:", req.body);
    res.json({ status: "Alert sent to warden and emergency contacts" });
  });

  app.post("/api/night-check", (req, res) => {
    console.log("Night Check Response:", req.body);
    res.json({ status: "Response recorded" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
