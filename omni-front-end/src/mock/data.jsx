export const sessionEvents = [
  {
    id: 1,
    time: "12:01 - 12:25",
    pose: "Tree Pose",
    duration: "24 min",
    accuracy: { tree: 46, warrior: 31 }
  },
  {
    id: 2,
    time: "11:30 - 11:55",
    pose: "Warrior II",
    duration: "25 min",
    accuracy: { tree: 20, warrior: 65 }
  },
  {
    id: 3,
    time: "10:50 - 11:10",
    pose: "Downward Dog",
    duration: "20 min",
    accuracy: { tree: 10, warrior: 15 }
  },
  {
    id: 4,
    time: "10:15 - 10:45",
    pose: "Cobra Pose",
    duration: "30 min",
    accuracy: { tree: 5, warrior: 10 }
  },
  {
    id: 5,
    time: "09:30 - 10:00",
    pose: "Triangle Pose",
    duration: "30 min",
    accuracy: { tree: 50, warrior: 40 }
  },
];

export const deviceProfiles = [
  {
    id: 1,
    name: "Yoga Mat - Pressure Grid",
    description: "High-resolution pressure sensing mat for yoga and balance training",
    type: "32x32 Grid",
    dataFormat: "Binary Grid Array",
    activeDevices: 23,
    status: "active",
    icon: "▦"
  },
  {
    id: 2,
    name: "3-Axis Accelerometer",
    description: "Wearable motion sensor for tracking body movements",
    type: "Scalar Time-Series",
    dataFormat: "JSON (x, y, z, timestamp)",
    activeDevices: 15,
    status: "active",
    icon: "∿"
  },
  {
    id: 3,
    name: "Heart Rate Monitor",
    description: "Continuous heart rate monitoring during exercise",
    type: "Scalar Time-Series",
    dataFormat: "JSON (bpm, timestamp)",
    activeDevices: 89,
    status: "active",
    icon: "♥"
  }
];

export const users = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Operator",
    project: "Yoga Research Lab",
    status: "active",
    lastActive: "2 minutes ago",
    sessions: 24,
    initials: "SC"
  },
  {
    id: 2,
    name: "Dr. Martinez",
    email: "martinez@example.com",
    role: "Supporter",
    project: "Yoga Research Lab",
    status: "active",
    lastActive: "15 minutes ago",
    sessions: 0,
    initials: "DM"
  },
  {
    id: 3,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Operator",
    project: "Physical Therapy Clinic",
    status: "active",
    lastActive: "1 hour ago",
    sessions: 67,
    initials: "JS"
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    role: "Supporter",
    project: "Sports Performance",
    status: "active",
    lastActive: "3 hours ago",
    sessions: 0,
    initials: "EW"
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.k@example.com",
    role: "Operator",
    project: "Sports Performance",
    status: "active",
    lastActive: "1 day ago",
    sessions: 12,
    initials: "DK"
  }
];