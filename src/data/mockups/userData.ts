import type { Users, UserApplication, Progress } from "@data/types/UserData";

export const mockUsers: Users[] = [
  {
    uid: "user_001",
    email: "john.doe@example.com",
    name: "John Doe",
    password: "hashedPassword123",
    disabled: false,
  },
  {
    uid: "user_002",
    email: "maria.garcia@example.com",
    name: "María García",
    password: "hashedPassword456",
    disabled: false,
  },
  {
    uid: "user_003",
    email: "disabled.user@example.com",
    name: "Disabled User",
    password: "hashedPassword789",
    disabled: true,
  },
];

export const mockUserApplications: UserApplication[] = [
  {
    uid: "app_001",
    userId: "user_001",
    lastLogin: new Date("2024-07-15T10:30:00"),
    creationDate: new Date("2024-01-15T08:00:00"),
    dateOfBirth: new Date("1995-03-20"),
    gender: 1,
    profilePicture: "https://picsum.photos/150/150?random=1",
    username: "johndoe95",
  },
  {
    uid: "app_002",
    userId: "user_002",
    lastLogin: new Date("2024-07-14T16:45:00"),
    creationDate: new Date("2024-02-10T12:30:00"),
    dateOfBirth: new Date("1992-08-15"),
    gender: 2,
    profilePicture: "https://picsum.photos/150/150?random=2",
    username: "maria_garcia",
  },
  {
    uid: "app_003",
    userId: "user_003",
    lastLogin: new Date("2024-06-20T09:15:00"),
    creationDate: new Date("2024-01-05T14:20:00"),
    dateOfBirth: new Date("1988-12-03"),
    gender: 3,
    profilePicture: "https://picsum.photos/150/150?random=3",
    username: "user_disabled",
  },
];

export const mockProgress: Record<string, Progress[]> = {
  app_001: [
    {
      uid: "progress_001",
      resourceUid: "sentence_001",
      type: 1,
      completed: true,
      completionDate: new Date("2024-07-10T14:30:00"),
      attempts: 3,
      lastAttempt: new Date("2024-07-10T14:30:00"),
      evaluation: {
        audioUrl: "https://example.com/audio/user001_sentence001.mp3",
        totalScore: 85,
        clarityScore: 90,
        speedScore: 80,
        rythmScore: 85,
        articulationScore: 85,
        clarityTip: "Excelente",
        speedTip: "Bueno",
        rythmTip: "Bueno",
        articulationTip: "Bueno",
      },
    },
    {
      uid: "progress_002",
      resourceUid: "word_001",
      type: 2,
      completed: false,
      completionDate: new Date("2024-07-12T10:15:00"),
      attempts: 1,
      lastAttempt: new Date("2024-07-12T10:15:00"),
      evaluation: {
        audioUrl: "https://example.com/audio/user001_word001.mp3",
        totalScore: 65,
        clarityScore: 70,
        speedScore: 60,
        rythmScore: 65,
        articulationScore: 65,
        clarityTip: "Necesita mejorar",
        speedTip: "Lento",
        rythmTip: "Regular",
        articulationTip: "Regular",
      },
    },
    {
      uid: "progress_003",
      resourceUid: "sentence_003",
      type: 1,
      completed: true,
      completionDate: new Date("2024-07-14T09:45:00"),
      attempts: 2,
      lastAttempt: new Date("2024-07-14T09:45:00"),
      evaluation: {
        audioUrl: "https://example.com/audio/user001_sentence003.mp3",
        totalScore: 78,
        clarityScore: 80,
        speedScore: 75,
        rythmScore: 80,
        articulationScore: 78,
        clarityTip: "Bueno",
        speedTip: "Bueno",
        rythmTip: "Bueno",
        articulationTip: "Bueno",
      },
    },
  ],

  app_002: [
    {
      uid: "progress_004",
      resourceUid: "sentence_002",
      type: 1,
      completed: true,
      completionDate: new Date("2024-07-13T16:20:00"),
      attempts: 2,
      lastAttempt: new Date("2024-07-13T16:20:00"),
      evaluation: {
        audioUrl: "https://example.com/audio/user002_sentence002.mp3",
        totalScore: 92,
        clarityScore: 95,
        speedScore: 90,
        rythmScore: 90,
        articulationScore: 95,
        clarityTip: "Excelente",
        speedTip: "Excelente",
        rythmTip: "Excelente",
        articulationTip: "Excelente",
      },
    },
    {
      uid: "progress_005",
      resourceUid: "word_002",
      type: 2,
      completed: false,
      completionDate: new Date("2024-07-15T11:30:00"),
      attempts: 1,
      lastAttempt: new Date("2024-07-15T11:30:00"),
      evaluation: {
        audioUrl: "https://example.com/audio/user002_word002.mp3",
        totalScore: 73,
        clarityScore: 75,
        speedScore: 70,
        rythmScore: 75,
        articulationScore: 72,
        clarityTip: "Bueno",
        speedTip: "Regular",
        rythmTip: "Bueno",
        articulationTip: "Regular",
      },
    },
  ],
  app_003: [],
};

export const getProgressByUserUid = (userUid: string): Progress[] => {
  const userApp = mockUserApplications.find((app) => app.userId === userUid);

  if (!userApp) {
    return [];
  }

  return mockProgress[userApp.uid] || [];
};

export const getUserApplicationByUid = (
  userUid: string
): UserApplication | null => {
  return mockUserApplications.find((app) => app.userId === userUid) || null;
};

export const createOrUpdateEvaluation = (
  userUid: string,
  resourceUid: string,
  evaluation: Progress["evaluation"]
): Progress => {
  const userApp = getUserApplicationByUid(userUid);

  if (!userApp) {
    throw new Error("User application not found");
  }

  const progressArray = mockProgress[userApp.uid] || [];

  const existingProgressIndex = progressArray.findIndex(
    (p) => p.resourceUid === resourceUid
  );

  if (existingProgressIndex !== -1) {
    const existing = progressArray[existingProgressIndex];
    const updated: Progress = {
      ...existing,
      completed: true,
      completionDate: new Date(),
      attempts: existing.attempts + 1,
      lastAttempt: new Date(),
      evaluation: evaluation,
    };

    progressArray[existingProgressIndex] = updated;
    mockProgress[userApp.uid] = progressArray;
    return updated;
  } else {
    const newProgress: Progress = {
      uid: `progress_${Date.now()}`,
      resourceUid: resourceUid,
      type: getResourceType(resourceUid),
      completed: true,
      completionDate: new Date(),
      attempts: 1,
      lastAttempt: new Date(),
      evaluation: evaluation,
    };

    progressArray.push(newProgress);
    mockProgress[userApp.uid] = progressArray;
    return newProgress;
  }
};

export const getResourceType = (resourceUid: string): number => {
  if (resourceUid.startsWith("sentence_")) return 1;
  if (resourceUid.startsWith("word_")) return 2;
  if (resourceUid.startsWith("text_")) return 3;
  return 1;
};

export const getResourceProgressByUserUid = (
  userUid: string,
  resourceUid: string
): Progress | null => {
  const userProgress = getProgressByUserUid(userUid);
  return userProgress.find((p) => p.resourceUid === resourceUid) || null;
};

export const mockProgressByApplication = mockProgress;
