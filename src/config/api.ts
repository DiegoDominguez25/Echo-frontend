export const API_CONFIG = {
  USE_MOCK_API: true,

  DATA_API: {
    BASE_URL: "https://api.example.com/data",
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
          byCategory: "/resources/words/category/:category",
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
    BASE_URL: "https://api.example.com",
    ENDPOINTS: {
      createAccount: "/users/account",
      createUserApplication: "/users/user_application",

      getUserProgress: "/users/progress/:user_id",
      getResourceProgress: "/users/progress/:user_id/:resource_uid",
      createOrUpdateEvaluation:
        "/users/progress/evaluation/:user_id/:resource_uid",
    },
  },

  AUDIO_ANALYSIS_API: {
    BASE_URL: "https://api.echo-audio-analysis.com/v1",
    ENDPOINTS: {
      analyze: "/evaluation/analyze",
      feedback: "/evaluation/feedback",
      tips: "/evaluation/tips",
    },
  },

  MOCK_DELAYS: {
    fast: 300,
    normal: 800,
    slow: 1500,
    audioAnalysis: 3000,
  },
};
