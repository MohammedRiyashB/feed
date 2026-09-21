import { useEffect, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, Battery, Bluetooth, Camera, CheckCircle2,
  ChevronRight, CircleGauge, Clock3, Cpu, Droplets, Fingerprint, HeartPulse, Home,
  Info, Layers3, Menu, Microscope, MonitorSmartphone, Play, Radio, RefreshCw, ShieldCheck,
  Thermometer, UserRound, Wifi, X, Zap
} from "lucide-react";

type Screen = "dashboard"|"vitals"|"heart"|"spo2"|"ecg"|"biometric"|"devices"|"research"|"settings";

const modules = [
  ["heart","Heart Rate","Camera PPG / wearable BPM",HeartPulse],
  ["spo2","SpO₂","Blood oxygen monitoring",Droplets],
  ["ecg","ECG Lab","Signal visualization & analysis",Activity],
  ["biometric","Biometrics","Platform fingerprint security",Fingerprint],
  ["devices","Device Hub","Sensors, BLE & IoT devices",Bluetooth],
  ["research","BME Lab","Biomedical tools & learning",Microscope],
] as const;

function title(s: Screen) {
  return ({dashboard:"Clinical Dashboard",vitals:"Vital Monitor",heart:"Heart Rate",spo2:"SpO₂ Monitor",ecg:"ECG Laboratory",biometric:"Biometric Security",devices:"Device Hub",research:"Biomedical Engineering Lab",settings:"System Settings"} as Record<Screen,string>)[s];
}

export default function FeedApp() {
  const [screen,setScreen]=useState<Screen>("dashboard");
  const [menu,setMenu]=useState(false);
  const [simulation,setSimulation]=useState(true);
  const nav:[Screen,string,typeof HeartPulse][]=[
    ["dashboard","Dashboard",Home],["vitals","Vital Monitor",CircleGauge],["heart","Heart Rate",HeartPulse],["spo2","SpO₂",Droplets],
    ["ecg","ECG Lab",Activity],["biometric","Biometrics",Fingerprint],["devices","Device Hub",Bluetooth],["research","BME Lab",Microscope]
  ];
  return <div className="bme-app">
    <header className="bme-mobile-header"><button onClick={()=>setMenu(!menu)}><Menu size={21}/></button><div className="brand-mark"><HeartPulse size={19}/><b>Bio<span>Med</span>Lab</b></div><span className="connection-dot"/></header>
    <aside className={menu?"bme-sidebar mobile-open":"bme-sidebar"}>
      <div className="brand"><div className="brand-icon"><HeartPulse size={22}/></div><div><strong>BioMedLab</strong><small>Biomedical Engineering</small></div></div>
      <div className="sidebar-label">MONITORING</div>
      {nav.slice(0,4).map(([id,label,Icon])=><button className={screen===id?"bme-nav active":"bme-nav"} key={id} onClick={()=>{setScreen(id);setMenu(false)}}><Icon size={19}/><span>{label}</span>{id==="vitals"&&<i>LIVE</i>}</button>)}
      <div className="sidebar-label">LAB & HARDWARE</div>
      {nav.slice(4).map(([id,label,Icon])=><button className={screen===id?"bme-nav active":"bme-nav"} key={id} onClick={()=>{setScreen(id);setMenu(false)}}><Icon size={19}/><span>{label}</span></button>)}
      <div className="sidebar-spacer"/>
      <div className="patient-card"><div className="patient-avatar"><UserRound size={18}/></div><div><strong>Research profile</strong><small>Local session</small></div><CheckCircle2 size={15}/></div>
      <button className="bme-nav" onClick={()=>setScreen("settings")}><Layers3 size={19}/><span>System settings</span></button>
      <div className="sidebar-footer">BioMedLab v1.0 · BME toolkit</div>
    </aside>
    <main className="bme-main">
      <div className="bme-topbar"><div><span className="eyebrow">BIOMEDICAL ENGINEERING PLATFORM</span><h1>{title(screen)}</h1></div><div className="top-actions"><span className="secure-badge"><ShieldCheck size={15}/> Local-first</span><button className={simulation?"mode-btn active":"mode-btn"} onClick={()=>setSimulation(!simulation)}>{simulation?"Simulation ON":"Simulation OFF"}</button></div></div>
      {screen==="dashboard"&&<Dashboard setScreen={setScreen} simulation={simulation}/>}
      {screen==="vitals"&&<Vitals setScreen={setScreen} simulation={simulation}/>}
      {screen==="heart"&&<HeartRate simulation={simulation}/>}
      {screen==="spo2"&&<SpO2 simulation={simulation}/>}
      {screen==="ecg"&&<ECGLab simulation={simulation}/>}
      {screen==="biometric"&&<Biometrics/>}
      {screen==="devices"&&<DeviceHub/>}
      {screen==="research"&&<ResearchLab setScreen={setScreen}/>}
      {screen==="settings"&&<Settings/>}
    </main>
    <div className="bme-mobile-nav">{nav.slice(0,5).map(([id,label,Icon])=><button className={screen===id?"active":""} key={id} onClick={()=>setScreen(id)}><Icon size={18}/><span>{label.split(" ")[0]}</span></button>)}</div>
  </div>;
}

function Dashboard({setScreen,simulation}:{setScreen:(s:Screen)=>void;simulation:boolean}) {
  return <div className="dashboard">
    <section className="hero-panel"><div><span className="eyebrow">BME · REAL-TIME INSTRUMENTATION</span><h2>Measure. Visualize. Understand.</h2><p>A biomedical engineering workspace for physiological signals, sensors, biometrics and device experiments.</p><div className="hero-actions"><button className="primary" onClick={()=>setScreen("vitals")}><Play size={16}/> Open vital monitor</button><button className="secondary" onClick={()=>setScreen("devices")}><Bluetooth size={16}/> Connect device</button></div></div><div className="heart-hero"><HeartPulse size={50}/><strong>72</strong><span>BPM · reference</span><div className="mini-wave">{Array.from({length:32},(_,i)=><i key={i} style={{height:(12+Math.abs(Math.sin(i*.8))*22+(i%7===3?18:0))+"px"}}/>)}</div></div></section>
    <div className="status-strip"><span><span className="live-dot"/> System ready</span><span><Wifi size={14}/> Sensor gateway</span><span><Battery size={14}/> Device power</span><span><Clock3 size={14}/> Session active</span></div>
    <section className="section-head"><div><span className="eyebrow">PHYSIOLOGICAL DATA</span><h2>Vital signs</h2></div><button onClick={()=>setScreen("vitals")}>Open monitor <ArrowRight size={15}/></button></section>
    <div className="vital-grid"><VitalCard label="Heart Rate" value="72" unit="BPM" icon={HeartPulse}/><VitalCard label="SpO₂" value="98" unit="%" icon={Droplets}/><VitalCard label="Temperature" value="36.7" unit="°C" icon={Thermometer}/><VitalCard label="Respiratory Rate" value="16" unit="breaths/min" icon={Activity}/></div>
    <section className="section-head"><div><span className="eyebrow">INSTRUMENTATION</span><h2>Biomedical modules</h2></div></section>
    <div className="module-grid">{modules.map(([id,name,desc,Icon])=><button className="module-card" key={id} onClick={()=>setScreen(id)}><div className="module-icon"><Icon size={21}/></div><div><strong>{name}</strong><span>{desc}</span></div><ChevronRight size={17}/></button>)}</div>
    <Notice text={simulation?"Simulation mode is enabled. Values are illustrative and are not medical measurements.":"Connect compatible sensors before using live acquisition."}/>
  </div>;
}

function VitalCard({label,value,unit,icon:Icon}:{label:string;value:string;unit:string;icon:typeof HeartPulse}) {
  return <div className="vital-card"><div className="vital-top"><span>{label}</span><Icon size={18}/></div><div className="vital-value">{value}<small>{unit}</small></div><div className="vital-status"><span className="live-dot"/>Reference signal</div></div>;
}

function Vitals({setScreen,simulation}:{setScreen:(s:Screen)=>void;simulation:boolean}) {
  return <div className="monitor-page"><div className="monitor-header"><div><span className="eyebrow">MULTI-PARAMETER MONITOR</span><h2>Physiological signal overview</h2></div><button className="primary" onClick={()=>setScreen("heart")}><Camera size={16}/> Start camera PPG</button></div><div className="big-vitals"><VitalCard label="Heart Rate" value="72" unit="BPM" icon={HeartPulse}/><VitalCard label="SpO₂" value="98" unit="%" icon={Droplets}/><VitalCard label="Temperature" value="36.7" unit="°C" icon={Thermometer}/></div><div className="signal-panel"><div className="signal-head"><div><strong>ECG-style signal workspace</strong><span>Educational waveform visualization</span></div><span className="signal-live"><span className="live-dot"/> LIVE</span></div><SignalWave/><div className="signal-metrics"><span>Sampling <b>250 Hz</b></span><span>Gain <b>10 mm/mV</b></span><span>Lead <b>II</b></span><span>Filter <b>0.5–40 Hz</b></span></div></div><Notice text={simulation?"Waveform and values are simulated reference data.":"Live acquisition requires a compatible calibrated sensor."}/></div>;
}

function HeartRate({simulation}:{simulation:boolean}) {
  const videoRef=useRef<HTMLVideoElement>(null),canvasRef=useRef<HTMLCanvasElement>(null);
  const [running,setRunning]=useState(false),[bpm,setBpm]=useState(72),[samples,setSamples]=useState<number[]>([]);
  useEffect(()=>{if(!running)return;let stream:MediaStream|undefined,raf=0,last=0,values:number[]=[];navigator.mediaDevices?.getUserMedia({video:{facingMode:"environment"},audio:false}).then(s=>{stream=s;if(videoRef.current){videoRef.current.srcObject=s;void videoRef.current.play()}}).catch(()=>setRunning(false));const tick=(t:number)=>{if(t-last>120&&videoRef.current?.readyState&&canvasRef.current){const v=videoRef.current,c=canvasRef.current,x=c.getContext("2d");if(x){c.width=32;c.height=24;x.drawImage(v,0,0,32,24);const d=x.getImageData(0,0,32,24).data;let red=0;for(let i=0;i<d.length;i+=4)red+=d[i];red/=d.length/4;values.push(red);if(values.length>80)values.shift();setSamples(values.slice(-55));if(values.length>=35){const mean=values.reduce((a,b)=>a+b,0)/values.length;let crossings=0;for(let i=1;i<values.length;i++)if(values[i-1]<mean&&values[i]>=mean)crossings++;const estimate=Math.round(Math.max(45,Math.min(160,crossings*60/(values.length*.12))));if(Number.isFinite(estimate))setBpm(estimate)}}last=t}raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(raf);stream?.getTracks().forEach(t=>t.stop())}},[running]);
  return <div className="lab-page"><LabIntro icon={HeartPulse} title="Heart-rate acquisition" subtitle="Educational camera-PPG experiment. Place a fingertip over the camera when the hardware permits optical reflection."/><div className="acquisition-grid"><div className="camera-card">{running?<><video ref={videoRef} muted playsInline/><canvas ref={canvasRef}/><div className="camera-overlay"><Fingerprint size={40}/><b>Cover the camera with your fingertip</b></div></>:<div className="camera-placeholder"><Camera size={45}/><strong>Camera PPG</strong><span>Browser camera permission is required.</span></div>}<button className={running?"danger":"primary"} onClick={()=>setRunning(!running)}>{running?"Stop acquisition":"Start camera acquisition"}</button></div><div className="reading-card"><span className="eyebrow">ESTIMATED HEART RATE</span><div className="reading-number">{bpm}<small>BPM</small></div><HeartPulse size={31}/><div className="sample-bars">{(samples.length?samples:Array.from({length:30},(_,i)=>40+Math.sin(i*.7)*20)).map((v,i)=><i key={i} style={{height:(10+Math.abs(v-50)*1.5)+"px"}}/>)}</div><span className="reading-note">{running?"Experimental camera-derived estimate":"Reference value"}</span></div></div><Notice text={simulation?"Camera PPG is an educational experiment, not a clinical-grade monitor. Motion, lighting and camera hardware affect accuracy.":"Live mode is experimental and should not be used for diagnosis."}/></div>;
}

function SpO2({simulation}:{simulation:boolean}) { return <div className="lab-page"><LabIntro icon={Droplets} title="Pulse oximetry" subtitle="Explore the optical principles behind SpO₂ measurement and sensor acquisition."/><div className="spo2-layout"><div className="spo2-reading"><span>SIMULATED READING</span><strong>98<small>%</small></strong><div className="oxygen-ring"><Droplets size={30}/></div><b>Reference value</b></div><div className="info-card"><h3>How a pulse oximeter works</h3><p>Red and infrared light are used to estimate relative absorption associated with oxygenated and deoxygenated hemoglobin.</p><div className="principles"><span><Zap/> Red light</span><span><Radio/> Infrared</span><span><Cpu/> Signal processing</span></div></div></div><Notice text={simulation?"The displayed SpO₂ value is simulated.":"Connect a compatible calibrated pulse-oximeter sensor for acquisition."}/></div>; }

function ECGLab({simulation}:{simulation:boolean}) { return <div className="lab-page"><LabIntro icon={Activity} title="ECG signal laboratory" subtitle="Visualize an educational ECG waveform and inspect acquisition parameters."/><div className="ecg-panel"><div className="ecg-toolbar"><span><span className="live-dot"/> Signal running</span><button><RefreshCw size={15}/> Recalibrate</button></div><SignalWave/><div className="ecg-grid"><Metric label="Sampling rate" value="250 Hz"/><Metric label="Lead" value="Lead II"/><Metric label="Gain" value="10 mm/mV"/><Metric label="Filter" value="0.5–40 Hz"/></div></div><Notice text={simulation?"Educational ECG waveform. It is not a patient's ECG and must not be used for diagnosis.":"Connect an approved acquisition device before interpreting real signals."}/></div>; }

function SignalWave(){const points=Array.from({length:160},(_,i)=>{const p=(i/160*12)%1.2;let y=0;if(p>.44&&p<.52)y=-.14*Math.sin((p-.44)/.08*Math.PI);if(p>.53&&p<.57)y=.9*Math.sin((p-.53)/.04*Math.PI);if(p>.57&&p<.62)y=-.28*Math.sin((p-.57)/.05*Math.PI);if(p>.72&&p<.92)y=-.18*Math.sin((p-.72)/.2*Math.PI);return (i/159*100)+","+(50-y*30)}).join(" ");return <div className="wave"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={points}/></svg></div>}

function Biometrics(){const [status,setStatus]=useState("Ready");const supported=typeof window!=="undefined"&&!!window.PublicKeyCredential;const enroll=async()=>{if(!supported){setStatus("WebAuthn is not supported");return}setStatus("Use your device biometric when prompted…");try{await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:"BioMedLab"},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"research-user",displayName:"BioMedLab User"},pubKeyCredParams:[{alg:-7,type:"public-key"},{alg:-257,type:"public-key"}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required"},timeout:60000}});setStatus("Platform biometric enrolled")}catch{setStatus("Enrollment cancelled or unavailable")}};return <div className="lab-page"><LabIntro icon={Fingerprint} title="Biometric identity" subtitle="Use your device's platform authenticator for biometric-gated access."/><div className="biometric-card"><div className="fingerprint-large"><Fingerprint size={82}/></div><div><span className="eyebrow">WEBAUTHN / PLATFORM AUTHENTICATOR</span><h2>Fingerprint-ready security</h2><p>Supported phones can request fingerprint, face or device PIN verification. The website receives a cryptographic credential, not raw biometric data.</p><div className="bio-status"><CheckCircle2 size={17}/>{status}</div><button className="primary" onClick={enroll}>{supported?"Register device biometric":"Check browser support"}</button></div></div><Notice text="Websites cannot directly read or store raw fingerprint images. WebAuthn delegates biometric verification to the device secure authenticator." /></div>}

function DeviceHub(){const [connected,setConnected]=useState(false);return <div className="lab-page"><LabIntro icon={Bluetooth} title="Biomedical device hub" subtitle="Control surface for BLE sensors, wearables and future IoT acquisition hardware."/><div className="device-grid"><Device name="BLE Heart Sensor" type="Heart-rate sensor" icon={HeartPulse} connected={connected} onClick={()=>setConnected(!connected)}/><Device name="Pulse Oximeter" type="SpO₂ / pulse" icon={Droplets}/><Device name="ECG Acquisition Board" type="Analog front-end" icon={Activity}/><Device name="Temperature Sensor" type="Digital temperature" icon={Thermometer}/></div><div className="protocol-card"><Bluetooth size={20}/><div><strong>BLE integration layer</strong><p>Sensor → packet validation → signal processing → visualization → biomedical context.</p></div><span>READY</span></div></div>}

function Device({name,type,icon:Icon,connected=false,onClick=()=>{}}:{name:string;type:string;icon:typeof HeartPulse;connected?:boolean;onClick?:()=>void}){return <div className="device-card"><div className="device-icon"><Icon size={24}/></div><div><strong>{name}</strong><span>{type}</span></div><div className={connected?"device-state on":"device-state"}><span className="live-dot"/>{connected?"Connected":"Available"}</div><button onClick={onClick}>{connected?"Disconnect":"Connect"}</button></div>}

function ResearchLab({setScreen}:{setScreen:(s:Screen)=>void}){const cards:[string,string,Screen,typeof Cpu][]=[["Biomedical Instrumentation","Sensors, transducers, amplifiers, ADC and acquisition chains.","devices",Cpu],["Cardiovascular Engineering","ECG, PPG, heart-rate and hemodynamic signals.","heart",HeartPulse],["Medical Imaging","Imaging modalities and biomedical image processing.","ecg",MonitorSmartphone],["Biomaterials & Devices","Implants, prosthetics and tissue interfaces.","devices",Layers3],["Biopotential Signals","ECG, EMG, EEG and signal conditioning foundations.","ecg",Activity],["Digital Health","Wearables, IoT telemetry and physiological data systems.","vitals",Wifi]];return <div className="research-page"><div className="research-banner"><span className="eyebrow">B.E. BIOMEDICAL ENGINEERING</span><h2>Engineering for human health.</h2><p>A structured workspace for learning, prototyping and experimenting with biomedical systems.</p></div><div className="research-grid">{cards.map(([name,desc,target,Icon])=><button className="research-card" key={name} onClick={()=>setScreen(target)}><Icon size={22}/><strong>{name}</strong><span>{desc}</span><ArrowRight size={16}/></button>)}</div><div className="curriculum"><span className="eyebrow">ENGINEERING TOOLBOX</span><h2>Core BME workflow</h2><div className="workflow">{["Patient / subject","Sensor / transducer","Signal conditioning","ADC / acquisition","Digital filtering","Feature extraction","Visualization","Clinical context"].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span>{i<7&&<ArrowRight size={13}/>}</div>)}</div></div></div>}

function Settings(){return <div className="settings-page"><div className="settings-card"><span className="eyebrow">PLATFORM</span><h2>BioMedLab settings</h2>{["Units · Metric (SI)","Signal refresh · 250 Hz workspace","Simulation · User controlled","Privacy · Local-first by default","Accessibility · Reduced motion available"].map(x=><div className="setting-line" key={x}><span>{x}</span><ChevronRight size={16}/></div>)}</div><Notice text="BioMedLab is an educational/prototyping interface. Validate sensor hardware, calibration and clinical requirements before real-world use."/></div>}

function LabIntro({icon:Icon,title,subtitle}:{icon:typeof HeartPulse;title:string;subtitle:string}){return <div className="lab-intro"><div className="lab-icon"><Icon size={25}/></div><div><span className="eyebrow">BIOMEDICAL SIGNAL LAB</span><h2>{title}</h2><p>{subtitle}</p></div></div>}
function Metric({label,value}:{label:string;value:string}){return <div><span>{label}</span><strong>{value}</strong></div>}
function Notice({text}:{text:string}){return <div className="notice"><AlertTriangle size={17}/><span>{text}</span></div>}
