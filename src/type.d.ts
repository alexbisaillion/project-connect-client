interface IUser {
  _id: string
  name: string
  address: string
  projects: string[],
  invitations: string[],
  username: string;
  age: number;
  region: string;
  currentEmployment: Employment;
  pastEmployment: Employment[];
  education: string;
  industry: string;
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
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