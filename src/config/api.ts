export const API_CONFIG = {
  USE_MOCK_API: false,

  DATA_API: {
    BASE_URL: "https://resources-api.lostresmodulos.shop",
    ENDPOINTS: {
      resources: {
        sentences: {
          all: "/resources/sentences",
          byId: "/resources/sentences/:id",
          byCategory: "/resources/sentences/category/:category",
        },
        words: {
          all: "/resources/words",
          byId: "/resources/words/:id",
          byCategory: "/resources/words/categories/:category",
          byDifficulty: "/resources/words/difficulty/:difficulty",
        },
        texts: {
          all: "/resources/texts",
          byId: "/resources/texts/:id",
          byCategory: "/resources/texts/category/:category",
        },
      },
    },
  },

  USER_API: {
    BASE_URL: "https://users-api.lostresmodulos.shop",
    ENDPOINTS: {
      createAccount: "/users/account",
      createUserApplication: "/users/user_application",
      userLogin: "/auth/login",
      getUserApplication: "/users/user_application/:user_id",

      getUserProgress: "/users/progress/completed/:user_id",
      getResourceProgress: "/users/progress/:user_id/:resource_uid",
      createOrUpdateEvaluation: "/users/user_application/progress/:uid_user",
    },
  },

  AUDIO_ANALYSIS_API: {
    BASE_URL: "https://feedback-api.lostresmodulos.shop",
    ENDPOINTS: {
      analyze: "/evaluation/analyze_audio",
      feedback: "/evaluation/evaluate_audio",
      tips: "/evaluation/feedback",
      tips_local: "/evaluation/feedback/local",
      classification: "/classification/classify_audio",
    },
  },

  MOCK_DELAYS: {
    fast: 300,
    normal: 800,
    slow: 1500,
    audioAnalysis: 3000,
  },
};
