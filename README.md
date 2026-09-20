# AllinOne Social

> **All Your Worlds. One App.**
>
> A modern social platform that brings social posts, stories, reels, long-form video, messaging, communities, live rooms, news and professional opportunities into one connected experience.

## Current milestone

This repository contains a responsive React + TypeScript + Vite MVP with:

- Home feed with posts, likes, comments/share actions and stories
- Create-post modal with local image preview
- Explore/discovery
- Reels / short-video experience
- Long-form video library
- Messaging UI with local demo state
- Communities
- Live rooms
- News
- Jobs / professional opportunities
- Notifications
- Profile
- Global search
- Dark/light presentation mode
- Desktop sidebar and mobile bottom navigation
- Local interactions and toast feedback

The current milestone is intentionally **demo-first**: it runs without external credentials and keeps local interactions in the browser. Production services can be connected in the next milestone without redesigning the UI.

## Stack

- React 19
- TypeScript
- Vite
- Lucide React
- Custom responsive CSS

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Production architecture target

The UI is designed so the next backend layer can provide:

1. Firebase Authentication for accounts and sessions
2. Firestore for profiles, posts, comments, follows, chats, communities and notifications
3. Firebase Storage for photos and videos
4. Realtime Database or Socket.IO for presence and low-latency chat
5. Cloud Functions / server workers for moderation, notifications and media processing
6. A dedicated video pipeline/CDN for large uploads, transcoding and playback
7. Search indexing for people, content, communities and jobs

Environment placeholders are provided in `.env.example`.

## Product direction

The goal is not to reproduce another company's branding or interface pixel-for-pixel. AllinOne uses familiar social primitives while combining them into one original product experience.

## CI

GitHub Actions runs TypeScript checks and a production Vite build on pushes and pull requests.

## Roadmap

### Phase 1 — Product shell
- Responsive social shell
- Navigation and major sections
- Demo feed, chat and content interactions

### Phase 2 — Identity and data
- Authentication
- User profiles
- Firestore data model
- Follow/follower graph
- Server-side validation and security rules

### Phase 3 — Real communications
- Persistent chat
- Read receipts
- Presence
- Typing indicators
- Group messaging
- Voice/video calling

### Phase 4 — Media
- Upload service
- Image optimization
- Video transcoding
- Reels/Shorts player
- Live streaming

### Phase 5 — Communities and work
- Roles and permissions
- Events
- Channels
- Jobs and applications
- Creator/professional profiles

### Phase 6 — Trust and scale
- Content moderation
- Reporting/blocking
- Rate limits
- Abuse prevention
- Observability
- Caching and CDN strategy

## License

No license has been selected yet. Choose one before public distribution of the production system.
