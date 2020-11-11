interface IUser {
  _id: string
  name: string
  projects: string[],
  invitations: string[],
  username: string;
  age: number;
  region: string;
  currentEmployment: Employment;
  pastEmployment: Employment[];
  education: string;
  industry: string;
  skills: Skill[];
  programmingLanguages: Skill[];
  frameworks: Skill[];
  bio: string;
  __v: number
}

interface IProject {
  _id: string
  name: string;
  creator: string;
  users: string[];
  invitees: string[];
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  startDate: string;
  isInProgress: boolean;
  completionDate?: string;
  description: string;
  __v: number
}

interface IIsLoggedIn {
  isLoggedIn: boolean;
  username: string;
}

interface ILogin {
  success: boolean;
  message?: string;
}

type Employment = {
  position: string;
  company: string;
}

type SuccessResponse = {
  success: boolean;
}

type Skill = {
  _id: string;
  name: string;
  votes: number;
}

type ProjectScore = {
  project: IProject;
  score: number;
}

type UserScore = {
  user: IUser;
  score: number;
}