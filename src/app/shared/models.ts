export interface LoginUser {
  username: string;
  password: string;
}

export interface RegisterUser {
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  password: string;
}

export interface UserData {
  access_token: string;
  refresh_token: string;
}
