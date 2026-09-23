export type Preferences = {
  user_id: string;
  experience_level: 'beginner' | 'intermediate' | 'experienced';
  fitness_level: 'light' | 'moderate' | 'high';
  preferred_difficulty: 'easy' | 'moderate' | 'challenging';
  destinations: string;
  duration_days: number;
  budget: number;
  travel_months: number[];
  high_altitude_experience: boolean;
  travel_style: 'solo' | 'couple' | 'group';
  interests: string;
  updated_at: string;
};
