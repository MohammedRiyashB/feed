import {
  Bell, Bookmark, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Heart, Home,
  Image as ImageIcon, Languages, List as ListIcon, Mail, Menu, MessageCircle,
  Mic2, MoreHorizontal, PenLine, Plus, Radio, Search, Send, Settings, Share2,
  Shield, SlidersHorizontal, Sparkles, UserRound, Users, Video, X, Repeat2, Flag,
  Palette, Accessibility, FileText, Check, KeyRound, LogOut
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  conversationIdFor,
  ensureAuth,
  ensureUserProfile,
  firebaseEnabled,
  publishPost,
  reactToPost,
  sendMessage,
  touchConversation,
  watchAuth,
  watchMessages,
  watchPosts,
  watchUsers,
  type FeedMessage,
  type FeedPost,
  type FeedUser,
} from "./lib/firebase";

type Screen =
  | "home" | "search" | "notifications" | "messages" | "profile"
  | "bookmarks" | "lists" | "communities" | "spaces" | "settings"
  | "account" | "privacy" | "security" | "notifications-settings"
  | "display" | "content" | "accessibility" | "language" | "help"
  | "drafts" | "subscriptions";

type SettingsItem = {
  id: Screen;
  title: string;
  subtitle?: string;
  icon: typeof Settings;
};

type Post = {
  id: string | number;
  name: string;
  handle: string;
  time: string;
  text: string;
  tag?: string;
  replies: number;
  reposts: number;
  likes: number;
  views: number;
  liked?: boolean;
  reposted?: boolean;
  bookmarked?: boolean;
  avatar: string;
  verified?: boolean;
  media?: "sunset" | "city" | "code";
};

const postsSeed: Post[] = [
  {
    id: 1, name: "Riyash B", handle: "@riyashb", time: "2h",
    text: "Building a place where conversations, creators, communities and ideas live together. Simple, fast and open.",
    tag: "#Feed", replies: 42, reposts: 126, likes: 1840, views: 32000,
    liked: true, avatar: "RB", verified: true, media: "sunset",
  },
  {
    id: 2, name: "Maya Chen", handle: "@mayachen", time: "4h",
    text: "The best social products make it effortless to move from a thought to a conversation.",
    tag: "#ProductDesign", replies: 18, reposts: 63, likes: 712, views: 8400,
    avatar: "MC", media: "code",
  },
  {
    id: 3, name: "Future Lab", handle: "@futurelab", time: "6h",
    text: "AI is becoming a creative tool for everyone. What are you building with it?",
    tag: "#AI", replies: 91, reposts: 204, likes: 3240, views: 64000,
    avatar: "FL", verified: true, media: "city",
  },
];

const trends = [
  ["AI & Technology", "24.2K posts"], ["Student Life", "18.7K posts"], ["Football", "14.1K posts"],
  ["Movies", "11.8K posts"], ["Design", "9.4K posts"], ["India", "46.9K posts"],
] as const;

const people = [
  ["Adnan", "@adnan", "AD"], ["Maya Chen", "@mayachen", "MC"], ["Future Lab", "@futurelab", "FL"],
] as const;

function Avatar({ value, verified = false }: { value: string; verified?: boolean }) {
  return (
    <span className="avatar">
      {value}
      {verified && <span className="verified"><Check size={9} /></span>}
    </span>
  );
}

export default function FeedApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [posts, setPosts] = useState<Post[]>(postsSeed);
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState("");
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [settingsSearch, setSettingsSearch] = useState("");
  const [following, setFollowing] = useState<string[]>(["@adnan"]);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsubscribe = watchAuth(async (user) => {
      setFirebaseUser(user);
      if (user) {
        await ensureUserProfile(user);
        setBackendReady(true);
      }
    });
    void ensureAuth().catch(() => setBackendReady(false));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!firebaseEnabled) return;
    return watchPosts((remote) => {
      const mapped: Post[] = remote.map((p) => ({
        id: p.id,
        name: p.name,
        handle: p.handle,
        time: formatPostTime(p.createdAt),
        text: p.text,
        replies: p.replies || 0,
        reposts: p.reposts || 0,
        likes: p.likes || 0,
        views: p.views || 0,
        liked: false,
        reposted: false,
        bookmarked: false,
        avatar: initials(p.name),
      }));
      setPosts(mapped);
    });
  }, []);

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter((p) => (p.name + p.handle + p.text + (p.tag ?? "")).toLowerCase().includes(q));
  }, [posts, query]);

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 1800);
  };

  const toggleLike = async (id: string | number) => {
    const current = posts.find((p) => p.id === id);
    if (!current) return;
    const next = !current.liked;
    setPosts((cur) => cur.map((p) => p.id === id ? { ...p, liked: next, likes: p.likes + (next ? 1 : -1) } : p));
    if (firebaseEnabled && typeof id === "string") {
      try { await reactToPost(id, "likes", next ? 1 : -1); } catch { notify("Could not update like"); }
    }
  };

  const toggleRepost = async (id: string | number) => {
    const current = posts.find((p) => p.id === id);
    if (!current) return;
    const next = !current.reposted;
    setPosts((cur) => cur.map((p) => p.id === id ? { ...p, reposted: next, reposts: p.reposts + (next ? 1 : -1) } : p));
    if (firebaseEnabled && typeof id === "string") {
      try { await reactToPost(id, "reposts", next ? 1 : -1); } catch { notify("Could not update repost"); }
    }
  };

  const toggleBookmark = (id: number) => {
    setPosts((cur) => cur.map((p) => p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
  };

  const publish = async () => {
    const text = draft.trim();
    if (!text) return;
    if (firebaseEnabled) {
      if (!firebaseUser) { notify("Connecting to Feed…"); return; }
      try {
        await publishPost(firebaseUser, text);
        setDraft("");
        setComposer(false);
        notify("Posted to Feed");
      } catch (error) {
        notify(error instanceof Error ? error.message : "Could not publish");
      }
      return;
    }
    setPosts((cur) => [{
      id: Date.now(), name: "Riyash B", handle: "@riyashb", time: "now", text,
      tag: "#NewPost", replies: 0, reposts: 0, likes: 0, views: 0, avatar: "RB",
    }, ...cur]);
    setDraft("");
    setComposer(false);
    notify("Demo post created");
  };

  const render = () => {
    switch (screen) {
      case "search": return <SearchScreen query={query} setQuery={setQuery} onOpen={setScreen} />;
      case "notifications": return <NotificationsScreen />;
      case "messages": return <MessagesScreen notify={notify} user={firebaseUser} />;
      case "profile": return <ProfileScreen posts={posts} onPost={() => setComposer(true)} />;
      case "bookmarks": return <BookmarksScreen posts={posts} onLike={toggleLike} onRepost={toggleRepost} onBookmark={toggleBookmark} notify={notify} />;
      case "lists": return <ListsScreen notify={notify} />;
      case "communities": return <CommunitiesScreen notify={notify} />;
      case "spaces": return <SpacesScreen notify={notify} />;
      case "drafts": return <DraftsScreen notify={notify} />;
      case "subscriptions": return <SubscriptionsScreen />;
      case "settings":
        return <SettingsScreen search={settingsSearch} setSearch={setSettingsSearch} onOpen={setScreen} />;
      case "account":
      case "privacy":
      case "security":
      case "notifications-settings":
      case "display":
      case "content":
      case "accessibility":
      case "language":
      case "help":
        return <SettingsDetail screen={screen} onBack={() => setScreen("settings")} notify={notify} />;
      default:
        return (
          <>
            <ComposerInline onOpen={() => setComposer(true)} />
            <FeedTabs screen={screen} setScreen={setScreen} />
            <div className="feed">
              {(screen === "home" ? filteredPosts : filteredPosts.filter((p) => p.id !== 3)).map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onLike={toggleLike}
                  onRepost={toggleRepost}
                  onBookmark={toggleBookmark}
                  notify={notify}
                />
              ))}
              {!filteredPosts.length && <EmptyState />}
            </div>
          </>
        );
    }
  };

  const primaryNav: [Screen, string, typeof Home][] = [
    ["home", "Home", Home],
    ["search", "Search", Search],
    ["notifications", "Notifications", Bell],
    ["messages", "Messages", Mail],
    ["profile", "Profile", UserRound],
  ];

  return (
    <div className={`app ${theme}`}>
      <header className="mobile-header">
        <button className="icon-btn" onClick={() => setMenu((v) => !v)}><Menu size={21} /></button>
        <button className="mobile-logo" onClick={() => setScreen("home")}>∞</button>
        <button className="icon-btn" onClick={() => setScreen("profile")}><Avatar value="RB" /></button>
      </header>

      <div className="shell">
        <aside className="left-sidebar">
          <button className="logo" onClick={() => setScreen("home")}>∞</button>
          <nav>
            {primaryNav.map(([id, label, Icon]) => (
              <button key={id} className={screen === id ? "side-link active" : "side-link"} onClick={() => setScreen(id)}>
                <Icon size={24} /><span>{label}</span>
                {id === "notifications" && <b>3</b>}
              </button>
            ))}
            <button className="side-link" onClick={() => setScreen("bookmarks")}><Bookmark size={24} /><span>Bookmarks</span></button>
            <button className="side-link" onClick={() => setScreen("lists")}><ListIcon size={24} /><span>Lists</span></button>
            <button className="side-link" onClick={() => setScreen("communities")}><Users size={24} /><span>Communities</span></button>
            <button className="side-link" onClick={() => setScreen("spaces")}><Mic2 size={24} /><span>Live audio</span></button>
          </nav>

          <button className="post-cta" onClick={() => setComposer(true)}><PenLine size={20} /><span>Post</span></button>
          <button className="more-nav" onClick={() => setMenu((v) => !v)}><MoreHorizontal size={24} /><span>More</span></button>

          <div className="account-card" onClick={() => setScreen("profile")}>
            <Avatar value="RB" />
            <div><strong>Riyash B</strong><span>@riyashb</span></div>
            <MoreHorizontal size={18} />
          </div>
        </aside>

        <main className="feed-column">
          <div className="desktop-titlebar">
            <div><strong>{screen === "home" ? "Home" : screen[0].toUpperCase() + screen.slice(1).replaceAll("-", " ")}</strong></div>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><Sparkles size={17} /></button>
          </div>
          {render()}
        </main>

        <aside className="right-sidebar">
          <div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Feed" /></div>
          <section className="right-card">
            <h2>What’s happening</h2>
            {trends.map(([title, count]) => (
              <button className="trend" key={title} onClick={() => { setQuery(title); setScreen("search"); }}>
                <span><small>Trending</small><strong>{title}</strong><small>{count}</small></span>
                <MoreHorizontal size={16} />
              </button>
            ))}
            <button className="show-more" onClick={() => setScreen("search")}>Show more</button>
          </section>
          <section className="right-card">
            <h2>Who to follow</h2>
            {people.map(([name, handle, avatar]) => {
              const isFollowing = following.includes(handle);
              return (
                <div className="person" key={handle}>
                  <Avatar value={avatar} />
                  <div><strong>{name}</strong><span>{handle}</span></div>
                  <button className={isFollowing ? "following-btn" : "follow-btn"} onClick={() => setFollowing((v) => isFollowing ? v.filter((x) => x !== handle) : [...v, handle])}>
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </section>
          <footer className="footer-links">{firebaseEnabled && backendReady ? "Live backend connected" : "Demo mode"} · Terms · Privacy · Safety · Accessibility · © 2026 Feed</footer>
        </aside>
      </div>

      <div className="mobile-bottom">
        <button className={screen === "home" ? "selected" : ""} onClick={() => setScreen("home")}><Home size={21} /></button>
        <button className={screen === "search" ? "selected" : ""} onClick={() => setScreen("search")}><Search size={21} /></button>
        <button className="mobile-post-button" onClick={() => setComposer(true)}><Plus size={24} /></button>
        <button className={screen === "notifications" ? "selected" : ""} onClick={() => setScreen("notifications")}><Bell size={21} /></button>
        <button className={screen === "profile" ? "selected" : ""} onClick={() => setScreen("profile")}><Avatar value="RB" /></button>
      </div>

      {menu && (
        <MoreDrawer
          onClose={() => setMenu(false)}
          onOpen={(s) => { setMenu(false); setScreen(s); }}
          theme={theme}
          setTheme={setTheme}
          notify={notify}
        />
      )}

      {composer && (
        <ComposerModal
          draft={draft}
          setDraft={setDraft}
          onClose={() => setComposer(false)}
          onPublish={publish}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function FeedTabs({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  return (
    <div className="feed-tabs">
      <button className={screen === "home" ? "selected" : ""} onClick={() => setScreen("home")}>For you</button>
      <button onClick={() => setScreen("home")}>Following</button>
    </div>
  );
}

function ComposerInline({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="inline-composer">
      <Avatar value="RB" />
      <button onClick={onOpen}>What is happening?!</button>
      <button className="mini-post" onClick={onOpen}>Post</button>
    </div>
  );
}

function PostCard({
  post, onLike, onRepost, onBookmark, notify,
}: {
  post: Post;
  onLike: (id: number) => void;
  onRepost: (id: number) => void;
  onBookmark: (id: number) => void;
  notify: (s: string) => void;
}) {
  return (
    <article className="post">
      <Avatar value={post.avatar} verified={post.verified} />
      <div className="post-main">
        <div className="post-author">
          <strong>{post.name}</strong>
          {post.verified && <span className="blue-check"><Check size={10} /></span>}
          <span>{post.handle}</span><span>·</span><span>{post.time}</span>
          <button onClick={() => notify("Post actions")}><MoreHorizontal size={17} /></button>
        </div>
        <p>{post.text} {post.tag && <a>{post.tag}</a>}</p>
        {post.media && <div className={`post-media ${post.media}`}><span>{post.media === "sunset" ? "A new perspective" : post.media === "code" ? "BUILD · CREATE · SHARE" : "THE WORLD IS CONNECTED"}</span></div>}
        <div className="post-actions">
          <button onClick={() => notify("Reply")}><MessageCircle /><span>{post.replies}</span></button>
          <button className={post.reposted ? "reposted" : ""} onClick={() => onRepost(post.id)}><Repeat2 /><span>{post.reposts}</span></button>
          <button className={post.liked ? "liked" : ""} onClick={() => onLike(post.id)}><Heart fill={post.liked ? "currentColor" : "none"} /><span>{post.likes}</span></button>
          <button className={post.bookmarked ? "bookmarked" : ""} onClick={() => onBookmark(post.id)}><Bookmark fill={post.bookmarked ? "currentColor" : "none"} /></button>
          <button onClick={() => notify("Share options")}><Share2 /></button>
        </div>
        <div className="post-metadata">{post.views.toLocaleString()} views · Anyone can reply</div>
      </div>
    </article>
  );
}

function SearchScreen({ query, setQuery, onOpen }: { query: string; setQuery: (v: string) => void; onOpen: (s: Screen) => void }) {
  return (
    <div className="page-panel">
      <div className="mobile-search search-box"><Search size={18} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" /></div>
      <div className="search-filter-row">{["Top", "Latest", "People", "Media"].map((x, i) => <button className={i === 0 ? "active" : ""} key={x}>{x}</button>)}</div>
      <div className="discover-hero"><span>EXPLORE</span><h1>Find what’s next.</h1><p>People, conversations, creators, topics and live rooms.</p></div>
      {trends.map(([x, c]) => <button className="discover-row" key={x}><span><small>Trending now</small><strong>#{x.replaceAll(" ", "")}</strong><small>{c}</small></span><MoreHorizontal size={17} /></button>)}
      <button className="primary-full" onClick={() => onOpen("communities")}>Explore communities</button>
    </div>
  );
}

function NotificationsScreen() {
  const items = [["Maya liked your post", "2m", "MC"], ["Adnan mentioned you", "18m", "AD"], ["Future Lab posted a new video", "1h", "FL"], ["You have 3 new followers", "2h", "3+"]];
  return (
    <div className="page-panel">
      <div className="segmented">{["All", "Mentions", "Follows"].map((x, i) => <button className={i === 0 ? "active" : ""} key={x}>{x}</button>)}</div>
      {items.map((x) => <div className="notification-row" key={x[0]}><Avatar value={x[2]} /><div><strong>{x[0]}</strong><span>{x[1]}</span></div></div>)}
    </div>
  );
}

function MessagesScreen({ notify, user }: { notify: (s: string) => void; user: User | null }) {
  const [users, setUsers] = useState<FeedUser[]>([]);
  const [selected, setSelected] = useState<FeedUser | null>(null);
  const [messages, setMessages] = useState<FeedMessage[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!firebaseEnabled) return;
    return watchUsers((items) => setUsers(items.filter((x) => x.uid !== user?.uid)));
  }, [user?.uid]);

  useEffect(() => {
    if (!firebaseEnabled || !user || !selected) return;
    const conversationId = conversationIdFor(user.uid, selected.uid);
    void touchConversation(conversationId, [user.uid, selected.uid]).catch(() => {});
    return watchMessages(conversationId, setMessages);
  }, [user, selected]);

  const send = async () => {
    const value = text.trim();
    if (!value || !user || !selected) return;
    try {
      await sendMessage(user, conversationIdFor(user.uid, selected.uid), value);
      setText("");
    } catch {
      notify("Message could not be sent");
    }
  };

  if (!firebaseEnabled) {
    return <div className="page-panel messages"><div className="section-title-row"><div><small>DEMO MODE</small><h2>Messages</h2></div><button onClick={() => notify("Configure Firebase to enable real messaging")}><PenLine size={18} /></button></div><div className="message-note"><Shield size={16} /> Real-time messaging is disabled until the Firebase environment variables are configured.</div></div>;
  }

  return (
    <div className="page-panel messages">
      <div className="section-title-row"><div><small>LIVE INBOX</small><h2>Messages</h2></div><span className="live-status">● Live</span></div>
      {!selected ? (
        <>
          <div className="message-tabs"><button className="active">People</button><button>Requests</button><button>Archived</button></div>
          {users.length === 0 && <div className="empty"><Users size={28} /><h2>No other Feed users yet</h2><p>When another user joins, they will appear here.</p></div>}
          {users.map((person) => <button className="message-row" key={person.uid} onClick={() => setSelected(person)}><Avatar value={initials(person.name)} /><span><strong>{person.name}</strong><small>@{person.handle.replace(/^@/, "")}</small></span><ChevronRight size={16} /></button>)}
        </>
      ) : (
        <>
          <div className="chat-head"><button onClick={() => setSelected(null)}><ChevronLeft size={18} /></button><Avatar value={initials(selected.name)} /><div><strong>{selected.name}</strong><small>@{selected.handle.replace(/^@/, "")}</small></div></div>
          <div className="chat-messages">
            {messages.map((m) => <div className={m.senderId === user?.uid ? "chat-bubble mine" : "chat-bubble"} key={m.id}>{m.text}</div>)}
            {!messages.length && <div className="empty"><MessageCircle size={26} /><p>Start the conversation.</p></div>}
          </div>
          <div className="message-input"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" onKeyDown={(e) => { if (e.key === "Enter") void send(); }} /><button onClick={() => void send()} disabled={!text.trim()}><Send size={18} /></button></div>
        </>
      )}
    </div>
  );
}

function ProfileScreen({ posts, onPost }: { posts: Post[]; onPost: () => void }) {
  return (
    <div className="profile">
      <div className="profile-banner" />
      <div className="profile-main">
        <Avatar value="RB" verified />
        <div className="profile-buttons"><button onClick={onPost}>Post</button><button><Settings size={17} /></button></div>
        <h1>Riyash B <span className="blue-check"><Check size={10} /></span></h1>
        <span className="handle">@riyashb</span>
        <p>Builder · Student · Creator</p>
        <div className="profile-meta">4.8K followers · 612 following</div>
        <div className="profile-actions"><button>Follow</button><button><Mail size={16} /> Message</button></div>
      </div>
      <div className="profile-tabs">{["Posts", "Replies", "Media", "Likes"].map((x, i) => <button className={i === 0 ? "active" : ""} key={x}>{x}</button>)}</div>
      {posts.slice(0, 2).map((p) => <PostCard key={p.id} post={p} onLike={() => {}} onRepost={() => {}} onBookmark={() => {}} notify={() => {}} />)}
    </div>
  );
}

function BookmarksScreen({ posts, onLike, onRepost, onBookmark, notify }: { posts: Post[]; onLike: (id: number) => void; onRepost: (id: number) => void; onBookmark: (id: number) => void; notify: (s: string) => void }) {
  const saved = posts.filter((p) => p.bookmarked || p.id === 1);
  return <div className="page-panel"><div className="section-title-row"><div><small>SAVED</small><h2>Bookmarks</h2></div><button onClick={() => notify("Bookmark folders")}><ListIcon size={18} /></button></div><div className="bookmark-toolbar"><button className="active">All</button><button>Folders</button></div>{saved.map((p) => <PostCard key={p.id} post={p} onLike={onLike} onRepost={onRepost} onBookmark={onBookmark} notify={notify} />)}</div>;
}

function ListsScreen({ notify }: { notify: (s: string) => void }) {
  const lists = [["AI Builders", "12.4K followers"], ["Football", "8.2K followers"], ["Campus Tech", "1.9K followers"]];
  return <div className="page-panel"><div className="section-title-row"><div><small>CURATED</small><h2>Lists</h2></div><button onClick={() => notify("Create a list")}><Plus size={18} /></button></div>{lists.map((x) => <button className="setting-row" key={x[0]}><i className="setting-icon"><ListIcon size={18} /></i><span><strong>{x[0]}</strong><small>{x[1]} · Public list</small></span><ChevronRight size={17} /></button>)}</div>;
}

function CommunitiesScreen({ notify }: { notify: (s: string) => void }) {
  const comm = [["AI Builders", "128K members", "AI"], ["Creators India", "74K members", "CR"], ["Football Hub", "218K members", "FC"], ["Study Together", "62K members", "ST"]];
  return <div className="page-panel"><div className="section-title-row"><div><small>COMMUNITIES</small><h2>Find your people</h2></div><button onClick={() => notify("Create community")}><Plus size={18} /></button></div><div className="community-list">{comm.map((x) => <div className="community-card" key={x[0]}><div className="community-icon">{x[2]}</div><div><strong>{x[0]}</strong><small>{x[1]}</small><p>Posts · members · live rooms</p></div><button onClick={() => notify("Joined " + x[0])}>Join</button></div>)}</div></div>;
}

function SpacesScreen({ notify }: { notify: (s: string) => void }) {
  const rooms = [["Late Night Tech", "1.8K listening", "AI · Tech"], ["Football Watch Party", "6.2K listening", "Sports"], ["Study With Me", "742 listening", "Study"], ["Creator Q&A", "3.1K listening", "Creators"]];
  return <div className="page-panel"><div className="section-title-row"><div><small>LIVE AUDIO</small><h2>Rooms</h2></div><button onClick={() => notify("Create live room")}><Radio size={18} /></button></div><div className="room-grid">{rooms.map((x) => <button className="room-card" key={x[0]} onClick={() => notify("Joining " + x[0])}><span className="live-badge"><Radio size={12} /> LIVE</span><div className="room-art"><Mic2 size={34} /></div><strong>{x[0]}</strong><small>{x[1]} · {x[2]}</small><div className="room-people"><Avatar value="A" /><Avatar value="B" /><Avatar value="C" /><span>+1K</span></div></button>)}</div></div>;
}

function DraftsScreen({ notify }: { notify: (s: string) => void }) {
  return <div className="page-panel"><div className="section-title-row"><div><small>COMPOSER</small><h2>Drafts</h2></div><button onClick={() => notify("New draft")}><Plus size={18} /></button></div><div className="empty"><FileText size={28} /><h2>No drafts yet</h2><p>Unfinished posts will appear here.</p></div></div>;
}

function SubscriptionsScreen() {
  return <div className="page-panel"><div className="discover-hero"><span>CREATOR ECONOMY</span><h1>Subscriptions</h1><p>Support creators, access subscriber-only communities and manage memberships.</p></div><div className="feature-grid">{["Subscriber badge", "Exclusive posts", "Private communities", "Creator perks"].map((x) => <div className="feature-card" key={x}><Sparkles size={19} /><strong>{x}</strong><span>Built into Feed.</span></div>)}</div></div>;
}

const settingsGroups: { title: string; items: SettingsItem[] }[] = [
  {
    title: "Your account",
    items: [
      { id: "account", title: "Account information", subtitle: "Email, username, connected accounts", icon: UserRound },
      { id: "security", title: "Security and account access", subtitle: "Password, 2FA, active sessions", icon: KeyRound },
    ],
  },
  {
    title: "Privacy and safety",
    items: [
      { id: "privacy", title: "Privacy and safety", subtitle: "Audience, blocks, mutes, replies, mentions", icon: Shield },
      { id: "content", title: "Content preferences", subtitle: "Sensitive content, hidden words, media", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Notifications",
    items: [{ id: "notifications-settings", title: "Notifications", subtitle: "Push, email, mentions, messages", icon: Bell }],
  },
  {
    title: "Accessibility and display",
    items: [
      { id: "display", title: "Display", subtitle: "Theme, font size, motion, media", icon: Palette },
      { id: "accessibility", title: "Accessibility", subtitle: "Screen reader, captions and motion", icon: Accessibility },
      { id: "language", title: "Language", subtitle: "App and content languages", icon: Languages },
    ],
  },
  {
    title: "Creator and more",
    items: [
      { id: "subscriptions", title: "Subscriptions", subtitle: "Creator memberships and benefits", icon: Sparkles },
      { id: "help", title: "Help and about", subtitle: "Help center, report, terms and privacy", icon: CircleHelp },
    ],
  },
];

function SettingsScreen({ search, setSearch, onOpen }: { search: string; setSearch: (v: string) => void; onOpen: (s: Screen) => void }) {
  const groups = settingsGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => (i.title + " " + (i.subtitle ?? "")).toLowerCase().includes(search.toLowerCase())) }))
    .filter((g) => g.items.length);
  return (
    <div className="page-panel settings-page">
      <div className="section-title-row"><div><small>SYSTEM</small><h2>Settings</h2></div><button><MoreHorizontal size={18} /></button></div>
      <div className="settings-search"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search settings" /></div>
      {groups.map((g) => <section className="settings-group" key={g.title}><h3>{g.title}</h3>{g.items.map((i) => {
        const Icon = i.icon;
        return <button className="setting-row" key={i.id} onClick={() => onOpen(i.id)}><i className="setting-icon"><Icon size={18} /></i><span><strong>{i.title}</strong><small>{i.subtitle}</small></span><ChevronRight size={17} /></button>;
      })}</section>)}
    </div>
  );
}

function SettingsDetail({ screen, onBack, notify }: { screen: Screen; onBack: () => void; notify: (s: string) => void }) {
  const data: Record<string, { title: string; subtitle: string; rows: [string, string][] }> = {
    account: { title: "Account information", subtitle: "Manage identity and account connections.", rows: [["Username", "@riyashb"], ["Email", "Connected"], ["Phone", "Not added"], ["Connected accounts", "Instagram · Facebook"], ["Account type", "Personal"]] },
    security: { title: "Security and account access", subtitle: "Keep your account protected.", rows: [["Password", "Change password"], ["Two-factor authentication", "Off"], ["Passkeys", "Set up a passkey"], ["Active sessions", "2 devices"], ["Login alerts", "On"]] },
    privacy: { title: "Privacy and safety", subtitle: "Control who can interact with you and your content.", rows: [["Private account", "Off"], ["Mentions", "People you follow"], ["Replies", "Everyone"], ["Tags", "Everyone"], ["Blocked accounts", "0 accounts"], ["Muted accounts", "0 accounts"], ["Restricted accounts", "0 accounts"], ["Hidden words", "Manage hidden words"], ["Discoverability", "Email and phone"]] },
    "notifications-settings": { title: "Notifications", subtitle: "Choose what Feed tells you about.", rows: [["Push notifications", "On"], ["Mentions", "On"], ["Replies", "On"], ["Likes", "On"], ["New followers", "On"], ["Messages", "On"], ["Live rooms", "Off"], ["Email notifications", "On"]] },
    display: { title: "Display", subtitle: "Make Feed comfortable on your device.", rows: [["Theme", "Dark"], ["Font size", "Default"], ["Reduce motion", "Off"], ["Autoplay media", "Wi-Fi and mobile data"], ["Media quality", "Auto"], ["Data saver", "Off"]] },
    content: { title: "Content preferences", subtitle: "Shape your feed and media experience.", rows: [["Sensitive content", "Show when relevant"], ["Hidden words", "Manage"], ["Topics", "AI · Tech · Football · Anime"], ["Languages", "English · Tamil"], ["Muted words", "0 words"], ["Search safety", "Standard"]] },
    accessibility: { title: "Accessibility", subtitle: "Options for readable, accessible experiences.", rows: [["Screen reader labels", "On"], ["Bold text", "Off"], ["Reduce motion", "Off"], ["Auto captions", "On"], ["Alt text reminders", "On"]] },
    language: { title: "Language", subtitle: "Choose how Feed communicates with you.", rows: [["App language", "English"], ["Content languages", "English · Tamil"], ["Translation", "Automatic"], ["Region", "India"]] },
    help: { title: "Help and about", subtitle: "Support, policies and product information.", rows: [["Help Center", "Open help"], ["Report a problem", "Send feedback"], ["Safety Center", "Safety resources"], ["Terms of Service", "View terms"], ["Privacy Policy", "View privacy"], ["About Feed", "Version 0.1.0"]] },
  };
  const x = data[screen] ?? data.help;
  return (
    <div className="page-panel detail-page">
      <button className="back-button" onClick={onBack}><ChevronLeft size={18} /> Settings</button>
      <div className="discover-hero"><span>SYSTEM</span><h1>{x.title}</h1><p>{x.subtitle}</p></div>
      <div className="detail-list">{x.rows.map(([title, value]) => <button className="setting-row" key={title} onClick={() => notify(title)}><span><strong>{title}</strong><small>{value}</small></span><ChevronRight size={17} /></button>)}</div>
      <button className="danger-row" onClick={() => notify("Action unavailable in demo")}><LogOut size={18} /> Sign out / deactivate</button>
    </div>
  );
}

function MoreDrawer({
  onClose, onOpen, theme, setTheme, notify,
}: {
  onClose: () => void;
  onOpen: (s: Screen) => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  notify: (s: string) => void;
}) {
  const items: [Screen, string, typeof Bookmark][] = [
    ["drafts", "Drafts", FileText], ["bookmarks", "Bookmarks", Bookmark], ["lists", "Lists", ListIcon],
    ["communities", "Communities", Users], ["spaces", "Live audio", Mic2],
    ["subscriptions", "Subscriptions", Sparkles], ["settings", "Settings", Settings],
  ];

  return (
    <div className="drawer-layer" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head"><strong>More</strong><button onClick={onClose}><X size={19} /></button></div>
        <div className="drawer-account"><Avatar value="RB" /><div><strong>Riyash B</strong><span>@riyashb</span></div></div>
        {items.map(([id, label, Icon]) => <button className="drawer-row" key={id} onClick={() => onOpen(id)}><Icon size={20} /><span>{label}</span><ChevronRight size={16} /></button>)}
        <div className="drawer-divider" />
        <button className="drawer-row" onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); notify("Theme changed"); }}><Palette size={20} /><span>Toggle theme</span><span className="theme-dot" /></button>
        <button className="drawer-row" onClick={() => notify("Help & support")}><Flag size={20} /><span>Help & support</span></button>
      </aside>
    </div>
  );
}

function ComposerModal({ draft, setDraft, onClose, onPublish }: { draft: string; setDraft: (v: string) => void; onClose: () => void; onPublish: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
        <div className="compose-head"><button onClick={onClose}><X size={19} /></button><strong>New post</strong><button className="modal-post" disabled={!draft.trim()} onClick={onPublish}>Post</button></div>
        <div className="compose-body"><Avatar value="RB" /><textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What is happening?!" autoFocus maxLength={500} /></div>
        <div className="compose-controls"><button><ImageIcon size={18} /></button><button><Video size={18} /></button><button><Mic2 size={18} /></button><button><Sparkles size={18} /></button><button><SlidersHorizontal size={18} /></button><span>{500 - draft.length}</span></div>
        <div className="reply-control"><span>Anyone can reply</span><ChevronDown size={16} /></div>
      </div>
    </div>
  );
}


function initials(name: string) {
  return name.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase() || "FD";
}

function formatPostTime(value: unknown) {
  const date = value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function"
    ? (value as { toDate: () => Date }).toDate()
    : value instanceof Date ? value : null;
  if (!date) return "now";
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function EmptyState() {
  return <div className="empty"><Search size={30} /><h2>No posts found</h2><p>Try a different search.</p></div>;
}
