import { useMemo } from "react";
import type { Specialty, NotesEntry } from "../types";

const MAX_DOCTORS_PER_PAGE = 5;

export interface DisplayPage {
  id: string;
  specialty: string;
  specialtyLabel: string;
  bookingNotes?: string;
  doctors: Specialty["doctors"];
  pageNum: number;
  totalPages: number;
}

export interface NotesDisplayPage {
  id: "notes-page";
  isNotesPage: true;
  title: string;
  bookingNotes?: string;
  entries: NotesEntry[];
}

export type Page = DisplayPage | NotesDisplayPage;

export function useExpandedSchedule(
  schedule: Specialty[],
  notesConfig: { title: string; bookingNotes: string; enabled: boolean; entries: NotesEntry[] }
) {
  return useMemo(() => {
    const pages: Page[] = [];
    for (const s of schedule) {
      const total = s.doctors.length;
      const needed = Math.ceil(total / MAX_DOCTORS_PER_PAGE);
      for (let p = 0; p < needed; p++) {
        const chunk = s.doctors.slice(p * MAX_DOCTORS_PER_PAGE, (p + 1) * MAX_DOCTORS_PER_PAGE);
        pages.push({
          id: `${s.id}-page-${p}`,
          specialty: s.specialty,
          specialtyLabel: needed > 1 ? `${s.specialty} (${p + 1}/${needed})` : s.specialty,
          bookingNotes: s.bookingNotes,
          doctors: chunk,
          pageNum: p + 1,
          totalPages: needed,
        });
      }
    }

    if (notesConfig.enabled && notesConfig.entries.length > 0) {
      pages.push({
        id: "notes-page",
        isNotesPage: true,
        title: notesConfig.title,
        bookingNotes: notesConfig.bookingNotes,
        entries: notesConfig.entries,
      });
    }

    return pages;
  }, [schedule, notesConfig]);
}
