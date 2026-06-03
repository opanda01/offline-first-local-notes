/**
 * Note Entity — Helper Functions
 * @module entities/note
 */

import type {Note, NoteSortOptions} from '../model/types';

/**
 * Generates a pseudo-UUID v4.
 * Uses Math.random() since this is a local app and collision risk is negligible.
 */
export function generateNoteId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
  const {field, direction} = options || {field: 'updatedAt', direction: 'desc'};

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
export function getContentPreview(content: string, maxLength = 100): string {
  const cleanContent = content.replace(/\n/g, ' ').trim();
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
