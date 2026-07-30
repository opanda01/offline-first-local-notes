# Offline capture extras — spike (offline constraint)

This document evaluates widget, share intent, on-device OCR, and voice attachments for **Secret** without cloud sync.

## Goals

- Keep the privacy promise: no background network, user-controlled exports only.
- Match high-value Keep patterns where they work fully on-device.

## Android home screen widget

| Aspect | Recommendation |
|--------|------------------|
| Library | `react-native-android-widget` or native `AppWidgetProvider` module |
| MVP scope | Show pinned note title + first checklist items; tap opens Vault |
| Data | Read from MMKV via shared storage id `offline-notes-storage` (requires native bridge or periodic widget snapshot key) |
| Effort | Medium (native Android code + RN config) |

**Next step:** prototype widget that displays `note:__index__` pinned notes only.

## Share intent (“Save to Secret”)

| Aspect | Recommendation |
|--------|------------------|
| Entry | `ACTION_SEND` intent filter on `MainActivity` + `ShareReceiver` |
| Flow | Plain text → open Capture with pre-filled content; no upload |
| iOS | Share extension target (separate Xcode target, higher effort) |
| Effort | Medium on Android; High on iOS |

**Next step:** Android-only share target accepting `text/plain`.

## On-device OCR (Keep “Grab image text”)

| Aspect | Recommendation |
|--------|------------------|
| Library | `@react-native-ml-kit/text-recognition` (on-device models) |
| Storage | Image files under app documents; note stores `attachmentUri` + extracted text in content |
| Privacy | No Google Cloud Vision; models bundled or downloaded once with user consent |
| Effort | Medium–High |

**Next step:** spike ML Kit on one screen: pick image → insert OCR text into note body.

## Voice memo attachment

| Aspect | Recommendation |
|--------|------------------|
| Capture | `react-native-audio-recorder-player` or Expo AV (if migrating) |
| Storage | Audio file on disk; note metadata `{ audioPath, durationMs }` |
| Transcription | Optional phase 2: platform on-device speech APIs (varies by OS/language) |
| Effort | Medium |

**Next step:** record → attach path on note → playback in Edit Note.

## Explicit non-goals (Keep / Gemini)

- Gemini Live, cloud transcription, collaborative editing, and Workspace connectors require Google accounts and network — out of scope for Secret unless a separate opt-in module is defined.

## Suggested implementation order

1. Android share intent (fast user value, fully offline).
2. Pinned-note widget.
3. Voice file attachment (no transcription).
4. On-device OCR.
