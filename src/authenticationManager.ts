import { isLoggedIn, login } from "./api";

class AuthenticationManager {
  private isLoggedIn: boolean;
  private loggedInUser: string;

  constructor() {
    this.isLoggedIn = false;
    this.loggedInUser = "";
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  async init() {
    const result = await isLoggedIn();
    if (result.data.isLoggedIn && result.data.username) {
      this.isLoggedIn = true;
      this.loggedInUser = result.data.username;
    }
  }

  async attemptLogIn(username: string, password: string) {
    const result = await login(username, password);
    if (result.data.success) {
      this.isLoggedIn = true;
      this.loggedInUser = username;
    }
  }
}

export const authenticationManager = new AuthenticationManager();