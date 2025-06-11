export interface ICalendar {
  id: number;
  name: string;
  color: string;
}
export interface IEvent {
  id?: number;
  date: string;
  time?: string;
  desc: string;
  calendarId: number;
}

export interface IUser {
  name: string;
  email: string;
}

function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}

export function getCalendarsEndpoint(): Promise<ICalendar[]> {
  return fetch('http://localhost:8080/calendars', {
    credentials: 'include',
  }).then((resp) => handleResponse(resp));
}

export function getEventsEndpoint(from: string, to: string): Promise<IEvent[]> {
  return fetch(`http://localhost:8080/events?date_gte=${from}&date_lte=${to}&_sort=date,time`, {
    credentials: 'include',
  }).then((resp) => handleResponse(resp));
}

export function createEventsEndpoint(event: IEvent): Promise<IEvent[]> {
  return fetch(`http://localhost:8080/events`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then((resp) => handleResponse(resp));
}
export function updateEventsEndpoint(event: IEvent): Promise<IEvent[]> {
  return fetch(`http://localhost:8080/events/${event.id}`, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then((resp) => handleResponse(resp));
}

export function deleteEventsEndpoint(eventId: number): Promise<void> {
  return fetch(`http://localhost:8080/events/${eventId}`, {
    credentials: 'include',
    method: 'DELETE',
  }).then((resp) => handleResponse(resp));
}

export function getUserEndpoint(): Promise<IUser> {
  return fetch(`http://localhost:8080/auth/user`, {
    credentials: 'include',
  }).then((resp) => handleResponse(resp));
}

export function signInEndpoint(email: string, password: string): Promise<IUser> {
  return fetch(`http://localhost:8080/auth/login`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((resp) => handleResponse(resp));
}

export function signOutEndpoint(): Promise<void> {
  return fetch(`http://localhost:8080/auth/logout`, {
    credentials: 'include',
    method: 'POST',
  }).then((resp) => handleResponse(resp));
}
