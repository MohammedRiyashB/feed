import {
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  Home,
  Image as ImageIcon,
  List,
  Mail,
  Menu,
  MoreHorizontal,
  PenLine,
  Search,
  Settings,
  Share2,
  Sparkles,
  UserRound,
  Users,
  Video,
  Heart,
  MessageCircle,
  Repeat2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Tab = "home" | "following" | "discover" | "messages" | "notifications" | "profile";

type Post = {
  id: number;
  name: string;
  handle: string;
  time: string;
  text: string;
  tag?: string;
  replies: number;
  reposts: number;
  likes: number;
  liked?: boolean;
  reposted?: boolean;
  media?: "sunset" | "code" | "city" | "none";
  avatar: string;
  verified?: boolean;
};

const starterPosts: Post[] = [
  {
    id: 1,
    name: "Riyash B",
    handle: "@riyashb",
    time: "2h",
    text: "Building a place where conversations, creators, communities and ideas can live together. Simple, fast and open.",
    tag: "#AllinOne",
    replies: 42,
    reposts: 126,
    likes: 1840,
    liked: true,
    media: "sunset",
    avatar: "RB",
    verified: true,
  },
  {
    id: 2,
    name: "Maya Chen",
    handle: "@mayachen",
    time: "4h",
    text: "The best social products make it effortless to move from a thought to a conversation.",
    tag: "#ProductDesign",
    replies: 18,
    reposts: 63,
    likes: 712,
    media: "code",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Future Lab",
    handle: "@futurelab",
    time: "6h",
    text: "AI is becoming a creative tool for everyone. What are you building with it?",
    tag: "#AI",
    replies: 91,
    reposts: 204,
    likes: 3240,
    media: "city",
    avatar: "FL",
    verified: true,
  },
];

const people = [
  ["Adnan", "@adnan", "AD"],
  ["Maya Chen", "@mayachen", "MC"],
  ["Future Lab", "@futurelab", "FL"],
];

const navItems = [
  ["home", "Home", Home],
  ["discover", "Explore", Search],
  ["notifications", "Notifications", Bell],
  ["messages", "Messages", Mail],
  ["profile", "Profile", UserRound],
] as const;

function Avatar({ value, verified = false }: { value: string; verified?: boolean }) {
  return (
    <span className="avatar">
      {value}
      {verified && <span className="verified"><Check size={10} strokeWidth={3} /></span>}
    </span>
  );
}

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [posts, setPosts] = useState(starterPosts);
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [following, setFollowing] = useState<string[]>([]);
  const [dark, setDark] = useState(true);

  const visiblePosts = useMemo(() => {
    let result = posts;
    if (tab === "following") result = posts.filter((p) => p.id !== 3);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) => (p.name + p.handle + p.text + (p.tag ?? "")).toLowerCase().includes(q));
    }
    return result;
  }, [posts, tab, query]);

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 1800);
  };

  const toggleLike = (id: number) => {
    setPosts((current) =>
      current.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p),
    );
  };

  const toggleRepost = (id: number) => {
    setPosts((current) =>
      current.map((p) => p.id === id ? { ...p, reposted: !p.reposted, reposts: p.reposts + (p.reposted ? -1 : 1) } : p),
    );
  };

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    setPosts((current) => [{
      id: Date.now(),
      name: "Riyash B",
      handle: "@riyashb",
      time: "now",
      text,
      tag: "#NewPost",
      replies: 0,
      reposts: 0,
      likes: 0,
      avatar: "RB",
    }, ...current]);
    setDraft("");
    setComposer(false);
    notify("Post published");
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <header className="mobile-header">
        <button className="icon-btn" onClick={() => notify("Menu") }><Menu size={21} /></button>
        <button className="mobile-logo" onClick={() => setTab("home")}>∞</button>
        <button className="icon-btn" onClick={() => setTab("profile")}><Avatar value="RB" /></button>
      </header>

      <div className="shell">
        <aside className="left-sidebar">
          <button className="logo" onClick={() => setTab("home")}>∞</button>
          <nav>
            {navItems.map(([id, label, Icon]) => (
              <button className={tab === id ? "side-link active" : "side-link"} key={id} onClick={() => setTab(id)}>
                <Icon size={24} strokeWidth={tab === id ? 2.5 : 1.8} />
                <span>{label}</span>
                {id === "notifications" && <b>3</b>}
              </button>
            ))}
            <button className="side-link" onClick={() => setTab("following")}><Users size={24} /><span>Following</span></button>
            <button className="side-link" onClick={() => notify("Bookmarks are ready for the backend")}><Bookmark size={24} /><span>Bookmarks</span></button>
            <button className="side-link" onClick={() => notify("Settings") }><Settings size={24} /><span>Settings</span></button>
          </nav>
          <button className="post-cta" onClick={() => setComposer(true)}><PenLine size={20} /><span>Post</span></button>
          <div className="account-card" onClick={() => setTab("profile")}>
            <Avatar value="RB" />
            <div><strong>Riyash B</strong><span>@riyashb</span></div>
            <MoreHorizontal size={18} />
          </div>
        </aside>

        <main className="feed-column">
          <div className="desktop-feed-header">
            <div className="feed-title"><strong>{tab === "profile" ? "Profile" : tab === "messages" ? "Messages" : tab === "notifications" ? "Notifications" : "Home"}</strong><button onClick={() => setDark((v) => !v)}><Sparkles size={17} /></button></div>
            {tab === "home" || tab === "following" ? (
              <div className="feed-tabs">
                <button className={tab === "home" ? "selected" : ""} onClick={() => setTab("home")}>For you</button>
                <button className={tab === "following" ? "selected" : ""} onClick={() => setTab("following")}>Following</button>
              </div>
            ) : null}
          </div>

          {tab === "home" || tab === "following" ? (
            <>
              <ComposerInline onOpen={() => setComposer(true)} />
              <div className="feed">
                {visiblePosts.map((post) => (
                  <PostCard key={post.id} post={post} onLike={toggleLike} onRepost={toggleRepost} onNotify={notify} />
                ))}
                {visiblePosts.length === 0 && <EmptyState />}
              </div>
            </>
          ) : null}

          {tab === "discover" && <Discover query={query} setQuery={setQuery} />}
          {tab === "messages" && <Messages notify={notify} />}
          {tab === "notifications" && <Notifications />}
          {tab === "profile" && <Profile onPost={() => setComposer(true)} posts={posts} />}

          <div className="mobile-tabs">
            <button className={tab === "home" ? "selected" : ""} onClick={() => setTab("home")}>For you</button>
            <button className={tab === "following" ? "selected" : ""} onClick={() => setTab("following")}>Following</button>
          </div>
        </main>

        <aside className="right-sidebar">
          <div className="search-box">
            <Search size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
          </div>
          <section className="right-card">
            <h2>What's happening</h2>
            {["AI & Technology", "Student Life", "Football", "Movies", "Design"].map((x, i) => (
              <button className="trend" key={x} onClick={() => { setQuery(x); setTab("discover"); }}>
                <span><small>Trending in India</small><strong>{x}</strong><small>{(i + 2) * 1.2}K posts</small></span>
                <MoreHorizontal size={16} />
              </button>
            ))}
            <button className="show-more">Show more</button>
          </section>
          <section className="right-card">
            <h2>Who to follow</h2>
            {people.map(([name, handle, avatar]) => {
              const isFollowing = following.includes(handle);
              return (
                <div className="person" key={handle}>
                  <Avatar value={avatar} />
                  <div><strong>{name}</strong><span>{handle}</span></div>
                  <button className={isFollowing ? "following-btn" : "follow-btn"} onClick={() => setFollowing((v) => isFollowing ? v.filter((x) => x !== handle) : [...v, handle])}>{isFollowing ? "Following" : "Follow"}</button>
                </div>
              );
            })}
          </section>
          <footer className="footer-links">Terms · Privacy · Cookies · Accessibility · © 2026 AllinOne</footer>
        </aside>
      </div>

      <button className="mobile-compose" onClick={() => setComposer(true)}><PenLine size={21} /></button>

      {composer && (
        <div className="overlay" onClick={() => setComposer(false)}>
          <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
            <div className="compose-head"><button onClick={() => setComposer(false)}><X size={19} /></button><strong>New post</strong><button className="modal-post" disabled={!draft.trim()} onClick={publish}>Post</button></div>
            <div className="compose-body">
              <Avatar value="RB" />
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus placeholder="What is happening?!" maxLength={500} />
            </div>
            <div className="compose-bottom"><div><button><ImageIcon size={19} /></button><button><Video size={19} /></button><button><Sparkles size={19} /></button></div><span>{500 - draft.length}</span></div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function ComposerInline({ onOpen }: { onOpen: () => void }) {
  return <div className="inline-composer">
    <Avatar value="RB" />
    <button onClick={onOpen}>What is happening?!</button>
    <button className="mini-post" onClick={onOpen}>Post</button>
  </div>;
}

function PostCard({ post, onLike, onRepost, onNotify }: { post: Post; onLike: (id: number) => void; onRepost: (id: number) => void; onNotify: (text: string) => void }) {
  return <article className="post">
    <Avatar value={post.avatar} verified={post.verified} />
    <div className="post-main">
      <div className="post-author"><strong>{post.name}</strong>{post.verified && <span className="blue-check"><Check size={11} strokeWidth={3}/></span>}<span>{post.handle}</span><span>·</span><span>{post.time}</span><button><MoreHorizontal size={17}/></button></div>
      <p>{post.text} {post.tag && <a>{post.tag}</a>}</p>
      {post.media !== "none" && post.media && <div className={`post-media ${post.media}`}><span>{post.media === "sunset" ? "A new perspective" : post.media === "code" ? "BUILD · CREATE · SHARE" : "THE WORLD IS CONNECTED"}</span></div>}
      <div className="post-actions">
        <button onClick={() => onNotify("Reply composer")}><MessageCircle/><span>{post.replies}</span></button>
        <button className={post.reposted ? "reposted" : ""} onClick={() => onRepost(post.id)}><Repeat2/><span>{post.reposts}</span></button>
        <button className={post.liked ? "liked" : ""} onClick={() => onLike(post.id)}><Heart fill={post.liked ? "currentColor" : "none"}/><span>{post.likes}</span></button>
        <button onClick={() => onNotify("Post saved")}><Bookmark/></button>
        <button onClick={() => onNotify("Share options")}><Share2/></button>
      </div>
    </div>
  </article>;
}

function Discover({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return <div className="page-panel"><div className="mobile-search search-box"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" /></div><div className="discover-hero"><span>EXPLORE</span><h1>Find what's next.</h1><p>People, conversations, creators and communities.</p></div>{["Technology", "Sports", "Entertainment", "Education", "AI", "Creators"].map((x, i) => <button className="discover-row" key={x}><span><small>Trending</small><strong>#{x}</strong><small>{(i + 3) * 1.7}K posts</small></span><MoreHorizontal size={17}/></button>)}</div>;
}

function Messages({ notify }: { notify: (text: string) => void }) {
  const [text, setText] = useState("");
  return <div className="page-panel messages"><div className="messages-head"><h2>Messages</h2><button onClick={() => notify("New message")}><PenLine size={18}/></button></div>{["Adnan", "Maya Chen", "College Group", "Future Lab"].map((name, i) => <button className="message-row" key={name} onClick={() => notify("Opening " + name)}><Avatar value={name.slice(0,2).toUpperCase()}/><span><strong>{name}</strong><small>{["Tomorrow lab iruka?", "See this new design!", "Notes.pdf", "New video is live"][i]}</small></span><time>{i + 1}h</time></button>)}<div className="message-note">Connect this view to your real-time backend when the data layer is enabled.</div><div className="message-input"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Start a message" onKeyDown={(e) => e.key === "Enter" && (notify("Message sent"), setText(""))}/><button onClick={() => { if (text.trim()) notify("Message sent"); setText(""); }}>Send</button></div></div>;
}

function Notifications() {
  return <div className="page-panel"><h2>Notifications</h2>{["Maya liked your post", "Adnan mentioned you", "Future Lab posted", "You have 3 new followers"].map((x, i) => <div className="notification" key={x}><Avatar value={["MC","AD","FL","3+"][i]}/><div><strong>{x}</strong><span>{i + 1}h ago</span></div></div>)}</div>;
}

function Profile({ onPost, posts }: { onPost: () => void; posts: Post[] }) {
  return <div className="profile"><div className="profile-banner"/><div className="profile-main"><Avatar value="RB" /><div className="profile-buttons"><button onClick={onPost}>Post</button><button><Settings size={17}/></button></div><h1>Riyash B <span className="blue-check"><Check size={11}/></span></h1><span className="handle">@riyashb</span><p>Builder · Student · Creator</p><div className="profile-meta">4.8K followers · 612 following</div></div><div className="profile-tabs"><button>Posts</button><button>Replies</button><button>Media</button></div>{posts.slice(0,2).map((p) => <PostCard key={p.id} post={p} onLike={() => {}} onRepost={() => {}} onNotify={() => {}} />)}</div>;
}

function EmptyState() {
  return <div className="empty"><h2>No posts found</h2><p>Try another search or switch back to For you.</p></div>;
}

export default App;
