/**
 * Note Entity — Helper Functions
 * @module entities/note
 */

import type {Note, NoteSortOptions, ChecklistItem, NoteType} from '../model/types';

/**
 * Generates a pseudo-UUID v4.
 */
export function generateNoteId(): string {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const NOTE_COLOR_PALETTE = [
  '#F28B82',
  '#FBBC04',
  '#FFF475',
  '#CCFF90',
  '#A7FFEB',
  '#CBF0F8',
  '#AECBFA',
  '#D7AEFB',
  '#FDCFE8',
  '#E6C9A8',
  '#E8EAED',
] as const;

/** Parses #label tokens from free text (Google Keep style). */
export function extractLabelsFromText(text: string): string[] {
  const matches = text.match(/#([a-zA-Z0-9_-]+)/g) ?? [];
  const labels = matches.map(token => token.slice(1).toLowerCase());
  return Array.from(new Set(labels));
}

export function syncChecklistContent(items: ChecklistItem[]): string {
  return items
    .map(item => {
      const prefix = item.checked ? '[x]' : '[ ]';
      const indent = '  '.repeat(item.indentLevel ?? 0);
      return `${indent}${prefix} ${item.text}`;
    })
    .join('\n')
    .trim();
}

export function parseChecklistFromContent(content: string): ChecklistItem[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const items: ChecklistItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(\s*)\[( |x|X)\]\s*(.+)$/);
    if (!match) continue;
    const indentSpaces = match[1].length;
    items.push({
      id: generateNoteId(),
      text: match[3].trim(),
      checked: match[2].toLowerCase() === 'x',
      indentLevel: Math.floor(indentSpaces / 2),
    });
  }
  return items;
}

/** Ensures legacy notes have defaults for new fields. */
export function normalizeNote(note: Note): Note {
  const noteType: NoteType = note.noteType ?? 'text';
  const checklistItems =
    note.checklistItems ??
    (noteType === 'checklist' ? parseChecklistFromContent(note.content) : undefined);

  return {
    ...note,
    noteType,
    checklistItems,
    labels: note.labels ?? extractLabelsFromText(`${note.title}\n${note.content}`),
  };
}

/**
 * Extracts a title from the first line of content.
 * Falls back to "Untitled Note" if empty.
 * Truncates to 50 chars max.
 */
export function extractTitle(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) {
    return 'Untitled Note';
  }

  const firstLine = trimmed.split('\n')[0].trim();
  if (firstLine.length > 50) {
    return firstLine.substring(0, 50) + '...';
  }

  return firstLine;
}

/**
 * Sorts an array of notes in-place or returns a new array.
 */
export function sortNotes(
  notes: Note[],
  options?: NoteSortOptions,
): Note[] {
  const {field, direction} = options || {field: 'createdAt', direction: 'desc'};

  return [...notes].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = a.createdAt - b.createdAt;
        break;
      case 'updatedAt':
        comparison = a.updatedAt - b.updatedAt;
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Very simple relative time formatter.
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: diffInDays > 365 ? 'numeric' : undefined,
  });
}

/**
 * Creates a preview of the content for note list cards.
 */
export function getContentPreview(note: Pick<Note, 'content' | 'noteType' | 'checklistItems'>, maxLength = 100): string {
  if (note.noteType === 'checklist' && note.checklistItems?.length) {
    const summary = note.checklistItems
      .map(item => `${item.checked ? '✓' : '○'} ${item.text}`)
      .join(' · ');
    if (summary.length <= maxLength) return summary;
    return summary.substring(0, maxLength).trim() + '...';
  }

  const cleanContent = note.content.replace(/\n/g, ' ').trim();
  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength).trim() + '...';
}

/**
 * Counts words in content.
 */
export function getWordCount(content: string): number {
  const trimmed = content.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
