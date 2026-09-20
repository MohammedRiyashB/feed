# Feed — APK UI/UX Analysis

This document records the static analysis performed on the uploaded Android APKs for X and Threads and translates their product patterns into the Feed design system.

## Scope and method

The APKs were inspected as application archives. The analysis covered:
- resource and layout inventories
- drawable/icon naming
- bundled fonts and media assets
- compiled resource string tables
- DEX symbol/class/string inventories
- feature-oriented naming patterns

Static APK analysis does not reproduce every server-driven experiment, account state, recommendation model, remote configuration, or runtime-only screen. The implementation therefore targets the stable interaction model and information architecture exposed by the packages.

## X inventory

The uploaded X APK contains approximately:
- 6,800 archive entries
- 1,900 layout resources
- 2,886 drawable resources
- 5,400+ resource XML files
- 17 primary DEX files
- dedicated Chirp font resources

The resource inventory exposes substantial surfaces around:
- Home timeline / feed
- Explore and search
- For You / Following style timeline navigation
- Post/tweet rendering, replies, quote posts and reposts
- Post composer, polls, media editing, GIFs, location and audience controls
- Profiles, editing, profile sheets and follower/following views
- Direct messages, group creation, message requests and DM search
- Bookmarks and bookmark folders
- Lists and list management
- Communities
- Spaces / live audio rooms, scheduled rooms, speakers, listeners and replay
- Live events and video playback
- Notifications and notification settings
- Privacy and safety controls
- Account and security settings
- Professional settings and monetization
- Subscriptions / premium surfaces
- Articles / long-form content cards
- Media viewer, fullscreen media and playback controls
- Search settings and advanced search filters
- Muted keywords, blocks and reports
- Share sheets and deep-link sharing
- Accessibility and theme/display settings

Notable X-specific design primitives found in resources include the Chirp font family, bookmark folders, list management, Spaces cards, media rails, timeline items, composer toolbars, persistent reply boxes, follow-action controls and extensive settings/search surfaces.

## Threads inventory

The uploaded Threads APK uses a substantially different technical presentation: it has no conventional `res/layout` or `res/drawable` inventory comparable to X and contains a large set of bundled assets plus compiled UI/resource strings. This strongly suggests a modern Compose/native-rendered and Meta shared-infrastructure UI architecture.

The compiled strings and DEX symbols expose surfaces including:
- Home feed
- Following/feed sort changes
- Profile and profile editing
- Activity / notification feed
- Search and tag/topic search
- Post creation and editing
- Reply controls and approval flows
- Likes, reposts/reshares and follow actions
- Direct messages, inbox, message requests and group threads
- Thread mute/unread/folder behaviors
- Communities
- Account switcher / Account Center
- Account privacy
- Security and login/recovery
- Blocked and restricted accounts
- Hidden words / content filtering
- Accessibility settings
- Notification settings
- Links / link history
- Browser settings
- Language settings
- Data and privacy controls
- About/help/reporting surfaces
- Identity confirmation/camera workflows
- Media upload, photos and video handling
- Live/chat-related infrastructure
- Fediverse/ActivityPub-related capabilities
- Creator/professional surfaces and recommendations

## Feed synthesis

Feed combines the strongest structural patterns from both products while keeping an original visual identity.

### Primary navigation

Mobile:
- Home
- Search
- Compose
- Activity
- Profile

Desktop:
- Left navigation rail
- Center timeline
- Right discovery/context rail

### Feed

- For You
- Following
- Custom feeds/lists
- Post composer
- Reply/repost/like/bookmark/share actions
- Quote-post style flow
- Poll/GIF/media affordances
- Post action menu
- Saved/bookmarked content

### Discovery

- Search
- Trending topics
- People discovery
- Media discovery
- Latest/Top/People/Media filters

### Messaging

- Inbox
- Message requests
- Group conversations
- Search
- Thread controls
- Mute, unread, archive concepts

### Profile

- Header/banner
- Avatar
- Bio and links
- Followers/following
- Posts, replies, media, likes
- Follow/unfollow
- Profile actions

### Community / live surfaces

- Communities
- Community discovery
- Live audio rooms
- Scheduled rooms
- Room details and actions

### Settings/system

Feed includes a dedicated settings architecture with:
- Your account
- Security
- Privacy and safety
- Notifications
- Accessibility
- Display
- Content preferences
- Media/data usage
- Language
- Creator/professional tools
- Monetization
- Help and about

### Important implementation principle

The project does not reproduce proprietary logos, brand assets, source code or a pixel-identical copy of either application. It adopts familiar interaction patterns and information architecture and combines them into an original Feed product.
