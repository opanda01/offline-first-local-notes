import {noteRepository} from '../noteRepository';
import {storage} from '@/shared/lib/mmkv-storage';
import {getWordCount} from '../../lib/noteHelpers';

describe('Note Entity - noteRepository', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('should create and retrieve a note', () => {
    const newNote = noteRepository.create({
      title: 'Test Note',
      content: 'This is a test note.',
      categoryId: 'cat-1',
    });

    expect(newNote.id).toBeDefined();
    expect(newNote.title).toBe('Test Note');
    expect(newNote.content).toBe('This is a test note.');
    
    const retrieved = noteRepository.getById(newNote.id);
    expect(retrieved).toEqual(newNote);
  });

  it('should update an existing note', () => {
    const newNote = noteRepository.create({
      title: 'Old Title',
      content: 'Old Content',
    });

    const updatedNote = noteRepository.update(newNote.id, {
      title: 'New Title',
      isFavorite: true,
    });

    expect(updatedNote?.title).toBe('New Title');
    expect(updatedNote?.content).toBe('Old Content'); // Content should not be overridden if not provided
    expect(updatedNote?.isFavorite).toBe(true);
    
    // Verify it was actually saved
    const retrieved = noteRepository.getById(newNote.id);
    expect(retrieved?.isFavorite).toBe(true);
  });

  it('should list all notes with correct sorting', () => {
    noteRepository.create({title: 'Note B', content: 'content'});
    noteRepository.create({title: 'Note A', content: 'content'});
    
    const notes = noteRepository.getAll({field: 'title', direction: 'asc'});
    
    expect(notes.length).toBe(2);
    expect(notes[0].title).toBe('Note A');
    expect(notes[1].title).toBe('Note B');
  });

  it('should delete a note', () => {
    const newNote = noteRepository.create({title: 'Delete me', content: 'content'});
    
    const result = noteRepository.delete(newNote.id);
    expect(result).toBe(true);
    
    const retrieved = noteRepository.getById(newNote.id);
    expect(retrieved).toBeNull();
  });
});

describe('Note Entity - Helpers', () => {
  it('calculates word count correctly', () => {
    expect(getWordCount('')).toBe(0);
    expect(getWordCount('Hello world')).toBe(2);
    expect(getWordCount('  Extra   spaces  included ')).toBe(3);
  });
});
