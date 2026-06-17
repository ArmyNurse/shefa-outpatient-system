export interface ScheduleEntry {
  day: string;
  time: string;
}

export interface Doctor {
  name: string;
  schedule: ScheduleEntry[];
  notes: string;
}

export interface NotesEntry {
  doctor: string;
  specialty: string;
  times: string[];
  note: string;
}

export interface NotesConfig {
  title: string;
  bookingNotes: string;
  enabled: boolean;
  entries: NotesEntry[];
}

export interface Specialty {
  id: string;
  specialty: string;
  bookingNotes?: string;
  doctors: Doctor[];
}
