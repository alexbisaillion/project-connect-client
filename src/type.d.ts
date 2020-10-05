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
  __v: number
}

interface IProject {
  _id: string
  name: string;
  users: string[];
  invitees: string[];
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  startDate: string;
  isInProgress: boolean;
  completionDate?: string;
  __v: number
}

interface IIsLoggedIn {
  isLoggedIn: boolean;
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