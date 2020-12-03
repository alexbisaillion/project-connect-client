import axios, { AxiosResponse } from "axios"
import { authenticationManager } from "./authenticationManager";
axios.defaults.withCredentials = true;

const baseUrl: string = process.env.REACT_APP_BASE_URL || "http://localhost:4000"

export const getUsers = async (): Promise<AxiosResponse<IUser[]>> => {
  try {
    const users: AxiosResponse<IUser[]> = await axios.get(baseUrl + "/users");
    return users;
  } catch (error) {
    throw new Error(error);
  }
}

export const getUsersByUsernames = async (usernames: string[]): Promise<AxiosResponse<IUser[]>> => {
  try {
    const users: AxiosResponse<IUser[]> = await axios.post(baseUrl + "/getUsersByUsernames", {usernames});
    return users;
  } catch (error) {
    throw new Error(error);
  }
}

export const getUser = async (username: string): Promise<AxiosResponse<IUser>> => {
  try {
    const user: AxiosResponse<IUser> = await axios.get(baseUrl + "/user/" + username);
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

export const isLoggedIn = async (): Promise<AxiosResponse<IIsLoggedIn>> => {
  try {
    const isLoggedIn: AxiosResponse<IIsLoggedIn> = await axios.get(baseUrl + "/isLoggedIn");
    return isLoggedIn;
  } catch (error) {
    throw new Error(error);
  }
}

export const login = async (username: string, password: string): Promise<AxiosResponse<ILogin>> => {
  try {
    const res: AxiosResponse<ILogin> = await axios.post(baseUrl + "/login", { username, password });
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export const logout = async (): Promise<AxiosResponse<SuccessResponse>> => {
  try {
    const res: AxiosResponse<SuccessResponse> = await axios.post(baseUrl + "/logout");
    return res;
  } catch (error) {
    throw new Error(error);
  }
}

export const getSkills = async (): Promise<AxiosResponse<string[]>> => {
  try {
    const skills: AxiosResponse<string[]> = await axios.get(baseUrl + "/skills");
    return skills;
  } catch (error) {
    throw new Error(error);
  }
}

export const getProgrammingLanguages = async (): Promise<AxiosResponse<string[]>> => {
  try {
    const programmingLanguages: AxiosResponse<string[]> = await axios.get(baseUrl + "/programmingLanguages");
    return programmingLanguages;
  } catch (error) {
    throw new Error(error);
  }
}

export const getFrameworks = async (): Promise<AxiosResponse<string[]>> => {
  try {
    const frameworks: AxiosResponse<string[]> = await axios.get(baseUrl + "/frameworks");
    return frameworks;
  } catch (error) {
    throw new Error(error);
  }
}

export type RegistrationInfo = {
  username: string;
  password: string;
  name: string;
  age: number;
  region: string;
  education: string;
  industry: string;
  currentEmployment: Employment;
  pastEmployment: Employment[];
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  bio: string;
};
export const register = async (info: RegistrationInfo): Promise<AxiosResponse<SuccessResponse>> => {
  try {
    const result: AxiosResponse<SuccessResponse> = await axios.post(baseUrl + "/addUser", info);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const getProject = async (name: string): Promise<AxiosResponse<IProject>> => {
  try {
    const project: AxiosResponse<IProject> = await axios.get(baseUrl + "/project/" + name);
    return project;
  } catch (error) {
    throw new Error(error);
  }
}

export const getProjectsByNames = async (names: string[]): Promise<AxiosResponse<IProject[]>> => {
  try {
    const projects: AxiosResponse<IProject[]> = await axios.post(baseUrl + "/getProjectsByNames", { names });
    return projects;
  } catch (error) {
    throw new Error(error);
  }
}

export const getProjects = async (): Promise<AxiosResponse<IProject[]>> => {
  try {
    const projects: AxiosResponse<IProject[]> = await axios.get(baseUrl + "/projects");
    return projects;
  } catch (error) {
    throw new Error(error);
  }
}

export type ProjectInfo = {
  name: string;
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  description: string;
}
export const addProject = async (info: ProjectInfo): Promise<AxiosResponse<SuccessResponse>> => {
  try {
    const creator = authenticationManager.getLoggedInUser();
    const result: AxiosResponse<SuccessResponse> = await axios.post(baseUrl + "/addProject", { ...info, creator });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const getProjectRecommendationsForUser = async (username: string): Promise<AxiosResponse<ProjectScore[]>> => {
  try {
    const result: AxiosResponse<ProjectScore[]> = await axios.get(baseUrl + "/getProjectRecommendationsForUser/" + username);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const requestToJoinProject = async (username: string, project: string): Promise<AxiosResponse<IProject>> => {
  try {
    const result: AxiosResponse<IProject> = await axios.post(baseUrl + "/requestToJoinProject", { username, name: project });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const getUserRecommendationsForProject = async (project: string): Promise<AxiosResponse<UserScore[]>> => {
  try {
    const result: AxiosResponse<UserScore[]> = await axios.get(baseUrl + "/getUserRecommendationsForProject/" + project);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const inviteToProject = async (username: string, project: string): Promise<AxiosResponse<IUser>> => {
  try {
    const result: AxiosResponse<IUser> = await axios.post(baseUrl + "/inviteToProject", { username, name: project });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const registerInProject = async (username: string, project: string): Promise<AxiosResponse<IUser>> => {
  try {
    const result: AxiosResponse<IUser> = await axios.post(baseUrl + "/registerInProject", { username, name: project });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const acceptRequest = async (username: string, project: string): Promise<AxiosResponse<IProject>> => {
  try {
    // This returns the project so that the page can be re-rendered.
    const result: AxiosResponse<IProject> = await axios.post(baseUrl + "/acceptRequest", { username, name: project });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const rejectRequest = async (username: string, project: string): Promise<AxiosResponse<IProject>> => {
  try {
    // This returns the project so that the page can be re-rendered.
    const result: AxiosResponse<IProject> = await axios.post(baseUrl + "/rejectRequest", { username, name: project });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const getMostRecentProjects = async (username: string): Promise<AxiosResponse<ProjectScore[]>> => {
  try {
    const result: AxiosResponse<ProjectScore[]> = await axios.post(baseUrl + "/getMostRecentProjects", { username });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export enum Operation {
  NewRequest = "NewRequest",
  AcceptedRequest = "AcceptedRequest",
  RejectedRequest = "RejectedRequest",
  NewInvite = "NewInvite",
  AcceptedInvite = "AcceptedInvite",
  RejectedInvite = "RejectedInvite"
}

export type NotificationItem = {
  _id: string;
  sender: string;
  operation: Operation;
  timestamp: Date;
  project: string;
}
export const dismissNotification = async (username: string, notificationId: string): Promise<AxiosResponse<IUser>> => {
  try {
    const result: AxiosResponse<IUser> = await axios.post(baseUrl + "/dismissNotification", { username, notificationId });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export const voteForSkill = async (targetUsername: string, votingUsername: string, skill: string): Promise<AxiosResponse<IUser>> => {
  try {
    const result: AxiosResponse<IUser> = await axios.post(baseUrl + "/voteForSkill", { targetUsername, votingUsername, skill });
    return result;
  } catch (error) {
    throw new Error(error);
  }
}