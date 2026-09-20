import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Clapperboard,
  Compass,
  Gamepad2,
  Globe2,
  Hash,
  Heart,
  Home,
  Image as ImageIcon,
  Languages,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Newspaper,
  Play,
  Plus,
  Radio,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Users,
  Video,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type Tab =
  | "home"
  | "explore"
  | "reels"
  | "videos"
  | "messages"
  | "communities"
  | "live"
  | "news"
  | "jobs"
  | "notifications"
  | "profile";

type Post = {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  time: string;
  text: string;
  tag: string;
  image: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

type Message = {
  id: number;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread?: number;
  online?: boolean;
};

const nav = [
  { id: "home" as Tab, label: "Home", icon: Home },
  { id: "explore" as Tab, label: "Explore", icon: Compass },
  { id: "reels" as Tab, label: "Reels", icon: Clapperboard },
  { id: "videos" as Tab, label: "Videos", icon: Play },
  { id: "messages" as Tab, label: "Messages", icon: MessageCircle },
  { id: "communities" as Tab, label: "Communities", icon: Users },
  { id: "live" as Tab, label: "Live", icon: Radio },
  { id: "news" as Tab, label: "News", icon: Newspaper },
  { id: "jobs" as Tab, label: "Jobs", icon: BriefcaseBusiness },
];

const initialPosts: Post[] = [
  {
    id: 1,
    name: "Riyash B",
    handle: "@riyashb",
    avatar: "RB",
    time: "2h",
    text: "New places, new perspectives. One platform should let people share all of them.",
    tag: "#AllinOne #Explore",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    likes: 12400,
    comments: 320,
    liked: true,
  },
  {
    id: 2,
    name: "Maya Chen",
    handle: "@mayachen",
    avatar: "MC",
    time: "4h",
    text: "Building a study community tonight. Drop your favorite productivity trick.",
    tag: "#Study #Community #Build",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    likes: 6820,
    comments: 148,
  },
  {
    id: 3,
    name: "Future Lab",
    handle: "@futurelab",
    avatar: "FL",
    time: "7h",
    text: "The future of social is fewer apps, not more tabs.",
    tag: "#AI #Future #Product",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    likes: 9130,
    comments: 401,
  },
];

const messages: Message[] = [
  { id: 1, name: "Adnan", avatar: "AD", preview: "Tomorrow lab iruka?", time: "9:12 PM", unread: 3, online: true },
  { id: 2, name: "Best Friends", avatar: "BF", preview: "Voice message • 0:18", time: "8:47 PM", online: true },
  { id: 3, name: "College Group", avatar: "CG", preview: "Notes.pdf", time: "7:58 PM", unread: 12 },
  { id: 4, name: "Family", avatar: "FA", preview: "Take care ❤️", time: "7:30 PM", unread: 1 },
  { id: 5, name: "Anime World", avatar: "AW", preview: "This episode 🔥", time: "6:41 PM" },
  { id: 6, name: "Project Team", avatar: "PT", preview: "Meeting at 8 PM", time: "5:01 PM" },
];

const stories = ["You", "Travel", "Anime", "Food", "Study", "Music"];

function formatCount(value: number) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(value >= 10_000 ? 0 : 1) + "K";
  return String(value);
}

function Avatar({ label, size = "md", online = false }: { label: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
  return (
    <span className={`avatar avatar-${size}`}>
      {label.slice(0, 2).toUpperCase()}
      {online && <i className="online-dot" />}
    </span>
  );
}

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [dark, setDark] = useState(true);
  const [selectedChat, setSelectedChat] = useState(messages[0]);
  const [chatLog, setChatLog] = useState<string[]>(["Tomorrow lab iruka?", "Yes, 10 AM. I'll send the notes."]);
  const [newPostText, setNewPostText] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const visiblePosts = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter((p) => (p.text + p.name + p.handle + p.tag).toLowerCase().includes(q));
  }, [posts, query]);

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 1800);
  };

  const go = (next: Tab) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (id: number) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
          : post,
      ),
    );
  };

  const publishPost = () => {
    if (!newPostText.trim()) {
      notify("Write something before publishing.");
      return;
    }
    setPosts((current) => [
      {
        id: Date.now(),
        name: "Riyash B",
        handle: "@riyashb",
        avatar: "RB",
        time: "now",
        text: newPostText.trim(),
        tag: "#NewPost",
        image: imagePreview || "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
        likes: 0,
        comments: 0,
      },
      ...current,
    ]);
    setNewPostText("");
    setImagePreview("");
    setComposerOpen(false);
    notify("Post published.");
  };

  const sendMessage = () => {
    const clean = message.trim();
    if (!clean) return;
    setChatLog((log) => [...log, clean]);
    setMessage("");
    notify("Message sent.");
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand" onClick={() => go("home")}>
          <span className="brand-mark">∞</span>
          <div>
            <strong>AllinOne</strong>
            <small>Every world. One app.</small>
          </div>
        </div>

        <div className="sidebar-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything"
            onKeyDown={(e) => e.key === "Enter" && go("explore")}
          />
        </div>

        <nav className="side-nav">
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={tab === id ? "nav-item active" : "nav-item"} onClick={() => go(id)}>
              <Icon size={20} />
              <span>{label}</span>
              {id === "messages" && <b>12</b>}
            </button>
          ))}
          <button className="nav-item" onClick={() => go("notifications")}>
            <Bell size={20} />
            <span>Notifications</span>
            <b>4</b>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="create-button" onClick={() => setComposerOpen(true)}>
            <Plus size={20} />
            <span>Create anything</span>
          </button>
          <div className="profile-mini">
            <Avatar label="RB" />
            <div>
              <strong>Riyash B</strong>
              <span>Online</span>
            </div>
            <Settings size={18} />
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => notify("Use the bottom navigation on mobile.")}>
            <Menu size={22} />
          </button>
          <div className="mobile-brand"><span className="brand-mark">∞</span> AllinOne</div>
          <div className="top-search">
            <Search size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people, posts, videos, jobs..." />
            <kbd>/</kbd>
          </div>
          <div className="top-actions">
            <button onClick={() => setDark((value) => !value)} aria-label="Toggle theme"><Sparkles size={18} /></button>
            <button onClick={() => go("notifications")}><Bell size={18} /><span className="notification-dot" /></button>
            <button className="top-avatar" onClick={() => go("profile")}><Avatar label="RB" size="sm" /></button>
          </div>
        </header>

        <div className="content">
          {tab === "home" && (
            <HomeTab
              posts={visiblePosts}
              onLike={toggleLike}
              onCreate={() => setComposerOpen(true)}
              onNavigate={go}
            />
          )}

          {tab === "explore" && <ExploreTab onNavigate={go} />}
          {tab === "reels" && <ReelsTab />}
          {tab === "videos" && <VideosTab />}
          {tab === "messages" && (
            <MessagesTab
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              message={message}
              setMessage={setMessage}
              chatLog={chatLog}
              onSend={sendMessage}
            />
          )}
          {tab === "communities" && <CommunitiesTab onNavigate={go} />}
          {tab === "live" && <LiveTab />}
          {tab === "news" && <NewsTab />}
          {tab === "jobs" && <JobsTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "profile" && <ProfileTab onCreate={() => setComposerOpen(true)} />}
        </div>
      </main>

      <div className="mobile-nav">
        <button className={tab === "home" ? "active" : ""} onClick={() => go("home")}><Home size={20} /><span>Home</span></button>
        <button className={tab === "explore" ? "active" : ""} onClick={() => go("explore")}><Compass size={20} /><span>Explore</span></button>
        <button className="mobile-create" onClick={() => setComposerOpen(true)}><Plus size={24} /></button>
        <button className={tab === "messages" ? "active" : ""} onClick={() => go("messages")}><MessageCircle size={20} /><span>Chats</span></button>
        <button className={tab === "profile" ? "active" : ""} onClick={() => go("profile")}><Avatar label="RB" size="sm" /><span>Profile</span></button>
      </div>

      {composerOpen && (
        <div className="modal-backdrop" onClick={() => setComposerOpen(false)}>
          <div className="composer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">CREATE</span>
                <h2>Share something</h2>
              </div>
              <button onClick={() => setComposerOpen(false)}><X size={20} /></button>
            </div>
            <div className="composer-user"><Avatar label="RB" /><div><strong>Riyash B</strong><span>Public · Everyone</span></div><ChevronDown size={17} /></div>
            <textarea
              autoFocus
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's on your mind?"
            />
            {imagePreview && <img className="preview-image" src={imagePreview} alt="preview" />}
            <div className="composer-tools">
              <label className="tool-button">
                <ImageIcon size={19} />
                Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </label>
              <button className="tool-button" onClick={() => notify("Video upload is ready for backend storage integration.")}><Video size={19} /> Video</button>
              <button className="tool-button" onClick={() => notify("Poll builder coming in the next backend milestone.")}><Hash size={19} /> Poll</button>
              <button className="publish-button" onClick={publishPost}>Publish <Send size={16} /></button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><Zap size={16} />{toast}</div>}
    </div>
  );
}

function HomeTab({
  posts,
  onLike,
  onCreate,
  onNavigate,
}: {
  posts: Post[];
  onLike: (id: number) => void;
  onCreate: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  return (
    <div className="page-grid">
      <section>
        <div className="hero-card">
          <div className="hero-copy">
            <span className="eyebrow">YOUR WORLD, ONE PLACE</span>
            <h1>Social. Video. Chat. Work. <span>Everything.</span></h1>
            <p>One connected home for your people, communities, videos, conversations, ideas and opportunities.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => onCreate()}><Plus size={18} /> Create a post</button>
              <button className="secondary-button" onClick={() => onNavigate("explore")}><Compass size={18} /> Explore</button>
            </div>
          </div>
          <div className="hero-glow" />
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-stat">
            <strong>8</strong>
            <span>social modes</span>
          </div>
        </div>

        <div className="section-head">
          <div><span className="eyebrow">STORIES</span><h2>Moments from your world</h2></div>
          <button onClick={() => onNavigate("reels")}>View all <ChevronDown size={15} /></button>
        </div>

        <div className="story-row">
          <button className="story-card add-story" onClick={onCreate}>
            <span><Plus size={22} /></span><small>Your story</small>
          </button>
          {stories.slice(1).map((story, index) => (
            <button className="story-card" key={story} onClick={() => onNavigate("reels")}>
              <div className={`story-photo s${index + 1}`}><Avatar label={story.slice(0, 2)} size="lg" /></div>
              <small>{story}</small>
            </button>
          ))}
        </div>

        <div className="section-head feed-head">
          <div><span className="eyebrow">FOR YOU</span><h2>Latest from your people</h2></div>
          <button className="feed-filter">For you <ChevronDown size={15} /></button>
        </div>

        <div className="feed-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={onLike} />
          ))}
        </div>
      </section>

      <aside className="right-rail">
        <div className="rail-card">
          <div className="rail-title"><span>Trending now</span><TrendingUp size={18} /></div>
          {["#AI", "#StudentLife", "#Football", "#Movies", "#TechNews"].map((tag, i) => (
            <div className="trend-row" key={tag}><span>{tag}</span><small>{(12 - i * 2) + ".4K"} posts</small></div>
          ))}
        </div>
        <div className="rail-card">
          <div className="rail-title"><span>People to connect</span><Users size={18} /></div>
          {["Hasena", "Adnan", "Maya"].map((name) => (
            <div className="suggest-row" key={name}>
              <Avatar label={name.slice(0, 2)} size="sm" online />
              <div><strong>{name}</strong><small>Suggested for you</small></div>
              <button onClick={() => {}} className="follow-button">Follow</button>
            </div>
          ))}
        </div>
        <div className="rail-card community-highlight">
          <span className="eyebrow">COMMUNITY</span>
          <h3>Build something together.</h3>
          <p>Join public communities for gaming, study, creators, tech, local groups and more.</p>
          <button className="primary-button small" onClick={() => onNavigate("communities")}><Users size={16} /> Browse communities</button>
        </div>
      </aside>
    </div>
  );
}

function PostCard({ post, onLike }: { post: Post; onLike: (id: number) => void }) {
  return (
    <article className="post-card">
      <header className="post-head">
        <Avatar label={post.avatar} online />
        <div><strong>{post.name}</strong><small>{post.handle} · {post.time}</small></div>
        <button className="icon-button"><MoreHorizontal size={19} /></button>
      </header>
      <p className="post-text">{post.text}</p>
      <div className="post-tag">{post.tag}</div>
      <img className="post-image" src={post.image} alt="" loading="lazy" />
      <div className="post-stats"><span>{formatCount(post.likes)} likes</span><span>{post.comments} comments</span></div>
      <div className="post-actions">
        <button className={post.liked ? "liked" : ""} onClick={() => onLike(post.id)}><Heart size={19} fill={post.liked ? "currentColor" : "none"} /> Like</button>
        <button><MessageCircle size={19} /> Comment</button>
        <button><Send size={19} /> Share</button>
        <button className="save-action"><ShieldCheck size={18} /> Save</button>
      </div>
    </article>
  );
}

function ExploreTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const tiles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    title: ["Travel", "AI", "Football", "Anime", "Study", "Design", "Gaming", "Movies", "Cars", "Music", "Business", "Nature"][i],
    className: `explore-tile tile-${(i % 6) + 1}`,
  }));
  return (
    <div className="wide-page">
      <div className="page-intro">
        <div><span className="eyebrow">DISCOVER</span><h1>Explore the world</h1><p>Find communities, people, ideas, short videos, long videos and opportunities.</p></div>
        <button className="primary-button" onClick={() => onNavigate("communities")}><Globe2 size={18} /> Browse communities</button>
      </div>
      <div className="topic-pills">{["For you", "Trending", "People", "Creators", "Videos", "Jobs"].map((x, i) => <button key={x} className={i === 0 ? "topic active" : "topic"}>{x}</button>)}</div>
      <div className="explore-grid">{tiles.map((tile) => <button key={tile.id} className={tile.className}><span>{tile.title}</span><small>Explore {tile.title}</small></button>)}</div>
    </div>
  );
}

function ReelsTab() {
  return (
    <div className="wide-page reels-page">
      <div className="page-intro compact"><div><span className="eyebrow">SHORT VIDEO</span><h1>Reels & Shorts</h1><p>Scroll, discover and share what catches your attention.</p></div><button className="secondary-button"><Volume2 size={18} /> Sound on</button></div>
      <div className="reel-grid">
        {[1,2,3,4].map((id) => (
          <article className={`reel-card reel-${id}`} key={id}>
            <div className="reel-overlay"><span className="live-pill">FOR YOU</span><button className="reel-more"><MoreHorizontal size={20} /></button></div>
            <div className="reel-center"><button className="play-ring"><Play size={24} fill="currentColor" /></button></div>
            <div className="reel-bottom"><Avatar label={["MC","RB","AW","FL"][id-1]} online /><div><strong>{["@mayachen","@riyashb","@animeworld","@futurelab"][id-1]}</strong><p>{["Study setup tour ✨","Late night drive 🌙","This scene 🔥","AI changes everything."][id-1]}</p></div><button className="follow-button">Follow</button></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function VideosTab() {
  const videos = [
    ["The complete student productivity system", "32:18", "1.2M views", "Tech & Study"],
    ["Build a community that people love", "18:46", "482K views", "Creator Lab"],
    ["A beginner's guide to AI in 2026", "24:10", "921K views", "Future Lab"],
    ["Top goals of the season", "11:34", "3.4M views", "Sports Hub"],
    ["Travel diary: mountains at sunrise", "42:02", "218K views", "Explore"],
    ["How to build your first web app", "28:52", "752K views", "Code"],
  ];
  return (
    <div className="wide-page">
      <div className="page-intro compact"><div><span className="eyebrow">WATCH</span><h1>Videos</h1><p>Long-form videos, tutorials, documentaries and creator series.</p></div><button className="primary-button"><Plus size={18} /> Upload</button></div>
      <div className="video-grid">{videos.map((v, i) => <article className="video-card" key={v[0]}><div className={`video-thumb v${i+1}`}><span className="duration">{v[1]}</span><button><Play size={20} fill="currentColor" /></button></div><div className="video-info"><div className="channel"><Avatar label={v[3].slice(0,2)} size="sm" /><div><strong>{v[0]}</strong><small>{v[3]} · {v[2]}</small></div></div><MoreHorizontal size={18} /></div></article>)}</div>
    </div>
  );
}

function MessagesTab({
  selectedChat,
  setSelectedChat,
  message,
  setMessage,
  chatLog,
  onSend,
}: {
  selectedChat: Message;
  setSelectedChat: (message: Message) => void;
  message: string;
  setMessage: (value: string) => void;
  chatLog: string[];
  onSend: () => void;
}) {
  return (
    <div className="chat-shell">
      <div className="chat-list">
        <div className="chat-title"><div><span className="eyebrow">MESSAGES</span><h1>Chats</h1></div><button className="icon-button"><Plus size={19} /></button></div>
        <div className="chat-search"><Search size={17} /><input placeholder="Search chats" /></div>
        {messages.map((item) => <button className={item.id === selectedChat.id ? "chat-row active" : "chat-row"} key={item.id} onClick={() => setSelectedChat(item)}><Avatar label={item.avatar} size="md" online={item.online} /><div className="chat-row-copy"><strong>{item.name}</strong><span>{item.preview}</span></div><div className="chat-row-meta"><small>{item.time}</small>{item.unread && <b>{item.unread}</b>}</div></button>)}
      </div>
      <div className="chat-panel">
        <header className="chat-header"><Avatar label={selectedChat.avatar} online /><div><strong>{selectedChat.name}</strong><small>{selectedChat.online ? "online now" : "last seen recently"}</small></div><div className="chat-header-actions"><button><Video size={19} /></button><button><PhoneIcon /></button><button><MoreHorizontal size={19} /></button></div></header>
        <div className="chat-messages"><div className="chat-day">TODAY</div>{chatLog.map((line, i) => <div key={`${line}-${i}`} className={i % 2 === 0 ? "bubble incoming" : "bubble outgoing"}>{line}<small>{i % 2 === 0 ? "9:12 PM" : "9:13 PM"}</small></div>)}</div>
        <div className="message-box"><button><Plus size={18} /></button><input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="Write a message..." /><button><ImageIcon size={18} /></button><button className="send-circle" onClick={onSend}><Send size={17} /></button></div>
      </div>
    </div>
  );
}

function PhoneIcon() { return <span className="phone-icon">⌕</span>; }

function CommunitiesTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const groups = ["AI Builders", "MIET BME 2026", "Anime World", "Football Hub", "Creators India", "Gaming Squad", "Travel India", "Study Together"];
  return <div className="wide-page"><div className="page-intro"><div><span className="eyebrow">COMMUNITIES</span><h1>Find your people</h1><p>Public communities with text, voice, events, files and live rooms.</p></div><button className="primary-button" onClick={() => onNavigate("messages")}><MessageCircle size={18}/> Open chats</button></div><div className="community-grid">{groups.map((g,i)=><article className="community-card" key={g}><div className={`community-cover c${(i%6)+1}`}><span>{["AI","BME","AW","FC","CR","GS","TR","ST"][i]}</span></div><div className="community-body"><h3>{g}</h3><p>{[12800,920,7800,18400,4100,2500,11400,6200][i].toLocaleString()} members</p><div className="member-stack"><Avatar label="A" size="sm"/><Avatar label="B" size="sm"/><Avatar label="C" size="sm"/><span>+2k</span></div><button className="secondary-button small">Join community</button></div></article>)}</div></div>;
}

function LiveTab() {
  return <div className="wide-page"><div className="page-intro"><div><span className="eyebrow">LIVE</span><h1>Live now</h1><p>Watch live creators, events, gaming rooms and community conversations.</p></div><button className="primary-button"><Radio size={18}/> Go live</button></div><div className="live-grid">{["Creator Studio","Football Watch Party","AI Q&A","Late Night Music","Study With Me","Gaming Arena"].map((x,i)=><article className={`live-card live-${i+1}`} key={x}><span className="live-pill"><Radio size={13}/> LIVE</span><div className="live-info"><Avatar label={x.slice(0,2)} size="sm" online/><div><strong>{x}</strong><small>{[18400,9200,6400,3100,2700,18800][i].toLocaleString()} watching</small></div></div></article>)}</div></div>;
}

function NewsTab() {
  const news = [
    ["AI & Tech", "New models are changing how people build products.", "12 min ago"],
    ["World", "Global technology and business stories are moving quickly.", "28 min ago"],
    ["Sports", "The week's biggest sporting moments and reactions.", "1h ago"],
    ["Campus", "Students are building more public communities online.", "2h ago"],
  ];
  return <div className="wide-page"><div className="page-intro compact"><div><span className="eyebrow">NEWS</span><h1>What’s happening</h1><p>Fast-moving public conversations, explained without the noise.</p></div><button className="secondary-button"><Languages size={18}/> Topics</button></div><div className="news-layout"><section className="news-main">{news.map((n,i)=><article className="news-card" key={n[0]}><div className={`news-image n${i+1}`}><span>{n[0]}</span></div><div className="news-copy"><span className="eyebrow">{n[0]}</span><h2>{n[1]}</h2><p>Read the story, join the conversation, save it, or share it with your community.</p><small>{n[2]} · 4 min read</small></div></article>)}</section><aside className="rail-card"><div className="rail-title"><span>Live topics</span><TrendingUp size={18}/></div>{["AI","India","Football","Movies","Startups","Campus"].map((x,i)=><div className="trend-row" key={x}><span>#{x}</span><small>{(9-i*.8).toFixed(1)}K conversations</small></div>)}</aside></div></div>;
}

function JobsTab() {
  const jobs = [
    ["Frontend Engineer", "Nova Labs", "Remote · Full-time", "₹8L–₹16L"],
    ["Biomedical AI Intern", "HealthSphere", "Chennai · Internship", "₹20K–₹35K"],
    ["Product Designer", "Orbit", "Bengaluru · Full-time", "₹10L–₹18L"],
    ["Community Manager", "AllinOne", "Remote · Full-time", "₹6L–₹12L"],
    ["Backend Engineer", "Future Lab", "Hyderabad · Hybrid", "₹12L–₹20L"],
  ];
  return <div className="wide-page"><div className="page-intro"><div><span className="eyebrow">WORK</span><h1>Jobs & opportunities</h1><p>Connect professional identity, communities and hiring in the same place.</p></div><button className="primary-button"><BriefcaseBusiness size={18}/> Post a job</button></div><div className="job-list">{jobs.map((j)=><article className="job-card" key={j[0]}><div className="company-mark">{j[1].slice(0,1)}</div><div className="job-copy"><div><h3>{j[0]}</h3><strong>{j[1]}</strong></div><p>{j[2]}</p><span>{j[3]}</span></div><button className="secondary-button small">View job</button></article>)}</div></div>;
}

function NotificationsTab() {
  const items = [
    ["Maya liked your post", "2 minutes ago", "MC"],
    ["Adnan mentioned you in College Group", "18 minutes ago", "AD"],
    ["Future Lab posted a new video", "1 hour ago", "FL"],
    ["You have 12 unread messages", "2 hours ago", "12"],
  ];
  return <div className="narrow-page"><div className="page-intro compact"><div><span className="eyebrow">ACTIVITY</span><h1>Notifications</h1><p>Everything important in one timeline.</p></div><button className="secondary-button small">Mark all read</button></div><div className="notification-list">{items.map((item)=><button className="notification-row" key={item[0]}><Avatar label={item[2]} size="md"/><div><strong>{item[0]}</strong><small>{item[1]}</small></div><ChevronDown size={16}/></button>)}</div></div>;
}

function ProfileTab({ onCreate }: { onCreate: () => void }) {
  return <div className="profile-page"><div className="profile-cover"><div className="cover-art" /><div className="profile-head"><Avatar label="RB" size="lg"/><div><h1>Riyash B</h1><p>@riyashb · Builder · Student · Creator</p><div className="profile-tags"><span>AI</span><span>Web</span><span>Biomedical</span><span>Football</span></div></div><div className="profile-actions"><button className="secondary-button">Edit profile</button><button className="primary-button" onClick={onCreate}><Plus size={17}/> Create</button></div></div></div><div className="profile-stats"><div><strong>128</strong><small>Posts</small></div><div><strong>4.8K</strong><small>Followers</small></div><div><strong>612</strong><small>Following</small></div><div><strong>18</strong><small>Communities</small></div></div><div className="profile-grid"><div className="profile-bio"><span className="eyebrow">ABOUT</span><h2>Building useful things for people.</h2><p>One profile can carry your social life, portfolio, creator work and professional identity.</p><div className="bio-row"><Globe2 size={16}/> India</div><div className="bio-row"><BriefcaseBusiness size={16}/> Biomedical Engineering</div></div><div className="mini-posts">{[1,2,3,4].map((i)=><div className={`mini-post mp${i}`} key={i}><span>{["Photo","Reel","Project","Travel"][i-1]}</span></div>)}</div></div></div>;
}

export default App;
