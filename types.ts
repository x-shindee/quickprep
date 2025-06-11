
export interface StudyTopic {
  topicName: string;
  priority: 'High' | 'Medium' | 'Low' | string; // Allow string for flexibility if Gemini outputs other priorities
  learningStrategies: string[];
  keyQuestions: string[];
  estimatedTimeHours?: number;
  summary?: string; // Short summary of the topic
}

export interface StudyPlanData {
  title: string;
  introduction: string;
  topics: StudyTopic[];
  generalTips?: string[];
  courseName?: string; // Extracted or inferred course name
}

// For Google Search Grounding (if used, not in current version's core logic but good to have)
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri: string;
    title: string;
  };
  // Add other potential grounding chunk types if necessary
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields
}
    