import type { Skill } from "./SKill";

export type UserProfile = {
  name: string;
  teachSkills: Skill[];
  learnSkills: Skill[];
  description: string;
};
