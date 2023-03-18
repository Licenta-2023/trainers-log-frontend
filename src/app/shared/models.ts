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

export enum CalendarEntryStatus {
  AVAILABLE = "AVAILABLE",
  FULL = "FULL"
}

export interface CalendarEntry {
  date: string;
  status: CalendarEntryStatus
}

export enum ReservationType {
  BLOCKER,
  TRAINING
}

export interface Reservation {
  client: string;
  trainer: string;
  timeIntervalBegin: string;
  reservationType: ReservationType;
}
