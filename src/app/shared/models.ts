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
  AVAILABLE = "available",
  BUSY = "busy",
  FULL = "full"
}

export interface CalendarEntry {
  date: string;
  status: CalendarEntryStatus
}

export enum ReservationType {
  BLOCKER = "BLOCKER",
  TRAINING = "TRAINING",
  EMPTY = "EMPTY"
}

export interface ReservationEntry {
  startTime: string;
  endTime: string;
  isFull: boolean;
  belongsToCurrentUser: boolean;
}

export interface Reservation {
  client: {
    username: string;
    fullName: string;
  };
  trainer: {
    username: string;
    fullName: string;
  };
  timeIntervalBegin: string;
  reservationType: ReservationType;
}

export interface PatchUserRequestBody {
  firstName?: string,
  lastName?: string,
  dob?: string,
}
