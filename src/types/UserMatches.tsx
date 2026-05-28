import type { Skill } from "./SKill";

export type User = {
  id: number;
  name: string;
  avatar?: string;
  description?: string;
  teachSkills: Skill[];
  learnSkills: Skill[];
};