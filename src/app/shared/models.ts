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

export interface TrainerFullNameAndUsername {
  fullName: string;
  username: string
}

export interface Trainer {
  user: User;
  startOfDay: string;
  endOfDay: string;
  totalClientsPerReservation: number;
}

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  dob: Date;

}
