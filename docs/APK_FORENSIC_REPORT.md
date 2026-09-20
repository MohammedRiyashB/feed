# Feed — Deep X + Threads APK Forensic UI/UX Analysis

## Analysis scope

The uploaded APKs were inspected as Android application packages rather than treated as screenshots.

The inspection covered the archive structure, Android manifest, resource names, drawable/menu/layout inventories, fonts, JavaScript, JSON, protobufs, shaders, Kotlin metadata, DEX headers, DEX string tables, class descriptors, package topology, feature-oriented class names, and the application information architecture exposed by those artifacts.

The APKs were also locally extracted and structurally validated.

A full Android runtime/emulator is not available in this environment, so the APKs were not launched as installed applications. Runtime-only server experiments, remote configuration, account-specific screens and A/B tests cannot be recovered solely from a static APK.

## X APK findings

Observed package: `com.twitter.android`.

Observed version: `12.15.2-release.0`.

Observed SDK target: 35; minimum SDK: 28; compile SDK: 36.

The archive contains approximately 6,800 extracted entries in the uploaded artifact, including:

- 1,900 layout XML resources
- 2,886 drawable resources
- 70 menu resources
- 67 XML system/configuration resources
- 17 DEX files
- 74 protobuf definitions
- 74 JSON resources
- 40 embedded Java source files from included libraries
- 23 GLSL shader files
- 5 JavaScript files
- 18 font files
- 10 TFLite model files
- 18 OGG audio resources

The DEX set contains a very large Android/Kotlin/Jetpack/Compose dependency surface plus Twitter/X application packages.

### X product systems directly exposed in resources/classes

Home and timelines:
- home timeline
- following timeline
- timeline modules
- timeline refresh/cache
- timeline feedback
- timeline ads
- timeline dynamic chrome
- list timelines
- community timelines
- live-event timelines
- thread/reply context timelines

Discovery:
- Explore
- Trends
- trend locations
- topic landing pages
- search field
- search deep links
- search settings
- media search
- user search
- advanced search
- trending domains/topics

Publishing:
- post/tweet composer
- self-thread composer
- reply context
- quote/repost flows
- drafts
- GIF search
- media attachment processing
- camera/photo editor
- polls
- articles/long-form
- location/audience controls
- inline composer variants

Post interaction:
- likes
- reposts
- replies
- quote posts
- pinned replies
- post detail
- bookmark actions
- bookmark folders
- post action sheets
- mute/block/report flows
- feedback/ranking controls

Profiles:
- profile screen
- profile editing
- profile media
- followers/following
- account switching
- profile settings
- verified/profile badges
- profile deep links

Messaging:
- DM inbox
- DM composition
- DM search
- message requests
- group conversations
- group creation
- thread actions
- message media
- unread state
- mute/block/report actions

Communities:
- community home
- community detail
- community topics/subtopics
- member management
- community composer
- community settings
- community discovery

Live:
- Spaces/live audio
- room creation
- scheduled rooms
- speakers/listeners
- audio reactions
- room cards
- live-event landing pages
- live-event composer and timelines

Account/system:
- account information
- account security
- password/2FA/authenticator
- active sessions
- privacy and safety
- mute/block
- sensitive media
- audience/tagging
- accessibility
- display/sound
- languages
- notifications
- search settings
- data sharing
- location
- about/help
- monetization
- subscriptions/premium
- creator/business tooling

### X visual/resource language

The resource names show a dense component system rather than a small collection of screens. Examples include:
- topic megaphone and filter icons
- avatar borders
- tweet connectors
- microphone/Spaces icons
- shop modules
- people/group icons
- history/search icons
- community items
- gallery and image viewer toolbars
- bookmark-folder options
- DM composer actions
- notification menus
- media playback modules

The X artifact also contains dedicated accessibility and display resources, plus multiple camera/media processing resources and GPU shader assets.

## Threads APK findings

Observed package: `com.instagram.barcelona`.

Observed version: `443.0.0.0.75`.

Observed SDK target: 36; minimum SDK: 28; compile SDK: 37.

The archive contains approximately 7,540 extracted entries in the uploaded artifact, including:

- 12 primary DEX files
- 4,218 XML resources
- 2,251 asset files
- 112 JSON assets
- 87 localized string resource files (`.frsc`)
- 53 Kotlin Native metadata files (`.knm`)
- 269 IGLU graphics/filter scripts
- 32 GLSL shaders
- 22 protobuf definitions
- 29 WEBP files
- 200 PNG files
- 21 M4A files
- 2 MP4 files
- 11 font files
- 2 JavaScript files
- Kotlin builtins and cross-platform library metadata

There are no conventional `res/layout` and `res/drawable` inventories like X. The class/resource topology instead strongly exposes Jetpack Compose / Meta Compose style UI construction.

### Threads UI architecture

Key classes expose:
- `BarcelonaActivity`
- `BarcelonaAppScreen`
- `AppScreenNavGraphBuilder`
- `MainFeedScreen`
- `ActivityFeedScreen`
- `NewThreadScreen`
- `SearchScreen`
- `SerpScreen`
- `ProfileScreen`
- `ProfileEditorViewModel`
- `InboxRepository`
- `InboxViewModel`
- messaging search/create-chat screens
- media viewer screens
- permalink screen
- live-chat destinations
- settings and privacy controllers
- blocked-user view model

### Threads product systems directly exposed

Feed:
- primary feed
- feed cache/persistence
- feed ranking
- posts
- reply bubbles
- reply controls
- reposts
- likes
- inline composer
- post attachments
- post actions
- permalink/detail flows
- media viewer
- external media
- snippets

Search/discovery:
- typeahead search
- people search
- content search
- topic/tag search
- trend search
- search filters
- search result verticals
- topic members
- topic posts
- community/media highlights

Activity:
- activity feed
- mentions
- follows/follow requests
- engagement counts
- swipe actions
- notification repositories

Profiles:
- profile feed
- profile editor
- profile picture editing
- bio/link editing
- multiple links
- follower/following graph
- mutual followers
- profile tags
- profile notifications
- profile insights
- public share cards

Messaging:
- inbox
- folders/badges
- thread list
- group creation
- thread details/add members
- message search
- message replies
- live chat
- invite links
- optimistic message operations
- encrypted/secure transport infrastructure

Communities:
- community entity cards
- community flair
- community notes
- community picker
- community discussions

Content/media:
- image/video upload
- camera creation
- media viewer
- external media viewer
- music/audio
- reels/video infrastructure
- filters/IGLU scripts
- shader-based rendering

Safety/account:
- account linking
- account sessions
- privacy disclosures
- blocked users
- security/attestation
- notification controls
- accessibility
- hidden/content controls
- reporting
- data/privacy infrastructure

Cross-platform infrastructure:
- Kotlin Multiplatform metadata
- Compose
- Kotlin coroutines
- Web/JS shared modules
- shader/filter systems
- protobuf
- large localized string set

## Combined Feed product blueprint

Feed should therefore behave as one coherent social operating system rather than a single timeline page.

### Navigation

Desktop:
- Home
- Explore
- Notifications
- Messages
- Bookmarks
- Lists
- Communities
- Live
- Profile
- More/System

Mobile:
- Home
- Search
- Compose
- Activity
- Profile
- swipe/drawer access to secondary systems

### Home

- For You
- Following
- optional Custom Feed/List selector
- sticky mobile header
- post composer
- pull-to-refresh visual state
- unread/new-post marker
- rich post cards
- media cards
- reply/repost/like/bookmark/share toolbar
- post overflow actions
- view counts and reply controls
- thread nesting

### Explore/search

- search field
- typeahead
- Top/Latest/People/Media filters
- trending topics
- people discovery
- topic pages
- community/media highlights
- advanced search entry
- search settings

### Composer

- text
- media
- camera
- video
- GIF
- audio
- poll
- location
- audience/reply controls
- thread continuation
- drafts
- character count
- preview/edit states

### Post details

- full post
- reply tree
- reply composer
- quoted/reposted post
- pinned reply
- media viewer
- post action sheet
- report/mute/block

### Profiles

- header/banner
- avatar
- verification
- bio
- links
- followers/following
- mutuals
- Follow/Following
- Message
- Edit profile
- Posts
- Replies
- Media
- Likes
- profile settings
- profile overflow menu

### Activity

- All
- Mentions
- Likes
- Reposts
- Follows
- Replies
- grouped/time-bucketed notification rows
- unread indicators
- notification settings

### Messaging

- Inbox
- Requests
- Groups
- Archived
- conversation search
- new message
- thread view
- attachments
- reply/quote
- mute
- unread
- group members

### Saved systems

- Bookmarks
- bookmark folders
- Lists
- Drafts
- custom feeds

### Communities/live

- Community discovery
- community details
- community members
- community topics
- community composer
- live audio rooms
- scheduled rooms
- speakers/listeners/reactions
- live chat

### System/settings

- Account
- Security
- Privacy & safety
- Content preferences
- Notifications
- Accessibility
- Display/theme
- Language
- Media/data usage
- Search settings
- Connected accounts
- Creator/professional
- Monetization/subscriptions
- Help/report
- Terms/privacy/about

## Feed implementation principles

1. Keep the navigation model shallow for common actions while retaining a comprehensive secondary system.
2. Make every major state reachable from a visible UI control.
3. Use mobile-first interaction density but scale to a desktop three-column layout.
4. Treat bottom sheets, menus, dialogs, tabs and drawers as first-class surfaces.
5. Separate UI state from eventual API state so a production backend can be connected later.
6. Keep Feed branding original; reuse interaction patterns rather than proprietary source/assets.
7. Optimize for fast initial paint, low asset weight, responsive touch targets and keyboard/focus accessibility.

## Runtime limitation

Static APK inspection can expose the shipped application architecture and many UI/UX systems, but it cannot execute account-specific server responses or reproduce every remotely-configured experiment. The local environment also has no Android emulator, so no APK was launched interactively.
