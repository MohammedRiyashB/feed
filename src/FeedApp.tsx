import { useEffect, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, Battery, Bluetooth, Camera, CheckCircle2,
  ChevronRight, CircleGauge, Clock3, Cpu, Droplets, Fingerprint, HeartPulse, Home,
  Layers3, Menu, Microscope, MonitorSmartphone, Play, Radio, RefreshCw, ShieldCheck,
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
      <div className="bme-topbar"><div><span className="eyebrow">BIOMEDICAL ENGINEERING PLATFORM</span><h1>{title(screen)}</h1></div><div className="top-actions"><span className="secure-badge"><ShieldCheck size={15}/> Secure context</span></div></div>
      {screen==="dashboard"&&<Dashboard setScreen={setScreen}/>}
      {screen==="vitals"&&<Vitals setScreen={setScreen}/>}
      {screen==="heart"&&<HeartRate/>}
      {screen==="spo2"&&<SpO2/>}
      {screen==="ecg"&&<ECGLab/>}
      {screen==="biometric"&&<Biometrics/>}
      {screen==="devices"&&<DeviceHub/>}
      {screen==="research"&&<ResearchLab setScreen={setScreen}/>}
      {screen==="settings"&&<Settings/>}
    </main>
    <div className="bme-mobile-nav">{nav.slice(0,5).map(([id,label,Icon])=><button className={screen===id?"active":""} key={id} onClick={()=>setScreen(id)}><Icon size={18}/><span>{label.split(" ")[0]}</span></button>)}</div>
  </div>;
}

function Dashboard({setScreen}:{setScreen:(s:Screen)=>void}) {
  return <div className="dashboard">
    <section className="hero-panel"><div><span className="eyebrow">BME · REAL-TIME INSTRUMENTATION</span><h2>Measure. Visualize. Understand.</h2><p>A biomedical engineering workspace for physiological signals, sensors, biometrics and device experiments.</p><div className="hero-actions"><button className="primary" onClick={()=>setScreen("vitals")}><Play size={16}/> Open vital monitor</button><button className="secondary" onClick={()=>setScreen("devices")}><Bluetooth size={16}/> Connect device</button></div></div><div className="heart-hero"><HeartPulse size={50}/><strong>72</strong><span>BPM · reference</span><div className="mini-wave">{Array.from({length:32},(_,i)=><i key={i} style={{height:(12+Math.abs(Math.sin(i*.8))*22+(i%7===3?18:0))+"px"}}/>)}</div></div></section>
    <div className="status-strip"><span><span className="live-dot"/> System ready</span><span><Wifi size={14}/> Sensor gateway</span><span><Battery size={14}/> Device power</span><span><Clock3 size={14}/> Session active</span></div>
    <section className="section-head"><div><span className="eyebrow">PHYSIOLOGICAL DATA</span><h2>Vital signs</h2></div><button onClick={()=>setScreen("vitals")}>Open monitor <ArrowRight size={15}/></button></section>
    <div className="vital-grid"><VitalCard label="Heart Rate" value="—" unit="BPM" icon={HeartPulse}/><VitalCard label="SpO₂" value="—" unit="%" icon={Droplets}/><VitalCard label="Temperature" value="—" unit="°C" icon={Thermometer}/><VitalCard label="Respiratory Rate" value="—" unit="breaths/min" icon={Activity}/></div>
    <section className="section-head"><div><span className="eyebrow">INSTRUMENTATION</span><h2>Biomedical modules</h2></div></section>
    <div className="module-grid">{modules.map(([id,name,desc,Icon])=><button className="module-card" key={id} onClick={()=>setScreen(id)}><div className="module-icon"><Icon size={21}/></div><div><strong>{name}</strong><span>{desc}</span></div><ChevronRight size={17}/></button>)}</div>
    <Notice text="No simulated patient data is displayed. Live measurements require a compatible sensor or acquisition device."/>
  </div>;
}

function VitalCard({label,value,unit,icon:Icon}:{label:string;value:string;unit:string;icon:typeof HeartPulse}) {
  return <div className="vital-card"><div className="vital-top"><span>{label}</span><Icon size={18}/></div><div className="vital-value">{value}<small>{unit}</small></div><div className="vital-status"><span className="live-dot"/>Reference signal</div></div>;
}

function Vitals({setScreen}:{setScreen:(s:Screen)=>void}) {
  return <div className="monitor-page"><div className="monitor-header"><div><span className="eyebrow">MULTI-PARAMETER MONITOR</span><h2>Physiological signal overview</h2></div><button className="primary" onClick={()=>setScreen("heart")}><Camera size={16}/> Start camera PPG</button></div><div className="big-vitals"><VitalCard label="Heart Rate" value="—" unit="BPM" icon={HeartPulse}/><VitalCard label="SpO₂" value="—" unit="%" icon={Droplets}/><VitalCard label="Temperature" value="—" unit="°C" icon={Thermometer}/></div><div className="signal-panel"><div className="signal-head"><div><strong>ECG acquisition workspace</strong><span>Waiting for a real ECG acquisition device</span></div><span className="signal-live">HARDWARE REQUIRED</span></div><div className="hardware-empty"><Activity size={34}/><strong>No ECG signal connected</strong><span>Connect a compatible ECG acquisition board through the Device Hub.</span><button className="secondary" onClick={()=>setScreen("devices")}>Open Device Hub</button></div></div><Notice text="No simulated ECG waveform is shown. A calibrated ECG front-end and validated acquisition path are required for live data."/></div>;
}

function HeartRate() {
  const videoRef=useRef<HTMLVideoElement>(null),canvasRef=useRef<HTMLCanvasElement>(null);
  const [running,setRunning]=useState(false),[bpm,setBpm]=useState(72),[samples,setSamples]=useState<number[]>([]);
  useEffect(()=>{if(!running)return;let stream:MediaStream|undefined,raf=0,last=0,values:number[]=[];navigator.mediaDevices?.getUserMedia({video:{facingMode:"environment"},audio:false}).then(s=>{stream=s;if(videoRef.current){videoRef.current.srcObject=s;void videoRef.current.play()}}).catch(()=>setRunning(false));const tick=(t:number)=>{if(t-last>120&&videoRef.current?.readyState&&canvasRef.current){const v=videoRef.current,c=canvasRef.current,x=c.getContext("2d");if(x){c.width=32;c.height=24;x.drawImage(v,0,0,32,24);const d=x.getImageData(0,0,32,24).data;let red=0;for(let i=0;i<d.length;i+=4)red+=d[i];red/=d.length/4;values.push(red);if(values.length>80)values.shift();setSamples(values.slice(-55));if(values.length>=35){const mean=values.reduce((a,b)=>a+b,0)/values.length;let crossings=0;for(let i=1;i<values.length;i++)if(values[i-1]<mean&&values[i]>=mean)crossings++;const estimate=Math.round(Math.max(45,Math.min(160,crossings*60/(values.length*.12))));if(Number.isFinite(estimate))setBpm(estimate)}}last=t}raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(raf);stream?.getTracks().forEach(t=>t.stop())}},[running]);
  return <div className="lab-page"><LabIntro icon={HeartPulse} title="Heart-rate acquisition" subtitle="Educational camera-PPG experiment. Place a fingertip over the camera when the hardware permits optical reflection."/><div className="acquisition-grid"><div className="camera-card">{running?<><video ref={videoRef} muted playsInline/><canvas ref={canvasRef}/><div className="camera-overlay"><Fingerprint size={40}/><b>Cover the camera with your fingertip</b></div></>:<div className="camera-placeholder"><Camera size={45}/><strong>Camera PPG</strong><span>Browser camera permission is required.</span></div>}<button className={running?"danger":"primary"} onClick={()=>setRunning(!running)}>{running?"Stop acquisition":"Start camera acquisition"}</button></div><div className="reading-card"><span className="eyebrow">ESTIMATED HEART RATE</span><div className="reading-number">{bpm}<small>BPM</small></div><HeartPulse size={31}/><div className="sample-bars">{(samples.length?samples:Array.from({length:30},(_,i)=>40+Math.sin(i*.7)*20)).map((v,i)=><i key={i} style={{height:(10+Math.abs(v-50)*1.5)+"px"}}/>)}</div><span className="reading-note">{running?"Experimental camera-derived estimate":"Reference value"}</span></div></div><Notice text="Camera PPG uses the phone camera in real time. It is an experimental optical measurement and is not a clinical-grade device; lighting, motion and camera hardware affect accuracy."/></div>;
}

function SpO2(){ return <div className="lab-page"><LabIntro icon={Droplets} title="Pulse oximetry" subtitle="Live SpO₂ requires a compatible calibrated pulse-oximeter sensor."/><div className="spo2-layout"><div className="spo2-reading"><span>LIVE SENSOR</span><strong>—<small>%</small></strong><div className="oxygen-ring"><Droplets size={30}/></div><b>No sensor connected</b></div><div className="info-card"><h3>Hardware acquisition</h3><p>A pulse oximeter measures red and infrared optical absorption. BioMedLab will display live data only after a compatible sensor is connected through the Device Hub.</p><div className="principles"><span><Zap/> Red light</span><span><Radio/> Infrared</span><span><Cpu/> Signal processing</span></div></div></div><Notice text="No simulated SpO₂ value is displayed." /></div>; }function ECGLab(){ return <div className="lab-page"><LabIntro icon={Activity} title="ECG signal laboratory" subtitle="Live ECG acquisition requires a compatible analog front-end and electrodes."/><div className="ecg-panel"><div className="ecg-toolbar"><span>NO DEVICE CONNECTED</span><button onClick={()=>{}}><RefreshCw size={15}/> Device calibration</button></div><div className="hardware-empty"><Activity size={38}/><strong>Waiting for ECG acquisition hardware</strong><span>Connect an ECG acquisition board from Device Hub to receive a real signal.</span></div><div className="ecg-grid"><Metric label="Sampling rate" value="—"/><Metric label="Lead" value="—"/><Metric label="Gain" value="—"/><Metric label="Filter" value="—"/></div></div><Notice text="No simulated ECG waveform is shown. Live ECG must come from validated acquisition hardware." /></div>; }function Biometrics(){
  const [status,setStatus]=useState("Not registered");
  const [busy,setBusy]=useState(false);
  const [credentialId,setCredentialId]=useState<string|null>(()=>localStorage.getItem("biomedlab.webauthn.credential"));
  const supported=typeof window!=="undefined" && !!window.PublicKeyCredential && !!navigator.credentials;
  const randomBytes=(n:number)=>crypto.getRandomValues(new Uint8Array(n));
  const b64=(bytes:ArrayBuffer)=>{let s="";for(const b of new Uint8Array(bytes))s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");};
  const fromB64=(value:string)=>{const s=value.replace(/-/g,"+").replace(/_/g,"/");const pad=s.length%4?"=".repeat(4-s.length%4):"";const raw=atob(s+pad);const out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;};
  const register=async()=>{
    if(!supported){setStatus("WebAuthn is not supported by this browser");return}
    setBusy(true);setStatus("Place your fingerprint on the phone sensor…");
    try{
      const cred=await navigator.credentials.create({publicKey:{
        challenge:randomBytes(32),
        rp:{name:"BioMedLab",id:location.hostname},
        user:{id:randomBytes(16),name:"biomedlab-user",displayName:"BioMedLab User"},
        pubKeyCredParams:[{alg:-7,type:"public-key"},{alg:-257,type:"public-key"}],
        authenticatorSelection:{authenticatorAttachment:"platform",residentKey:"preferred",userVerification:"required"},
        timeout:60000
      }});
      if(!(cred instanceof PublicKeyCredential))throw new Error("No platform credential returned");
      const id=b64(cred.rawId);
      localStorage.setItem("biomedlab.webauthn.credential",id);
      setCredentialId(id);setStatus("Fingerprint credential registered on this device");
    }catch(e){setStatus(e instanceof DOMException&&e.name==="NotAllowedError"?"Fingerprint verification was cancelled or denied":"Biometric registration failed")}
    finally{setBusy(false)}
  };
  const authenticate=async()=>{
    if(!credentialId){setStatus("Register your device fingerprint first");return}
    setBusy(true);setStatus("Touch the phone fingerprint sensor…");
    try{
      const result=await navigator.credentials.get({publicKey:{
        challenge:randomBytes(32),
        rpId:location.hostname,
        allowCredentials:[{type:"public-key",id:fromB64(credentialId)}],
        userVerification:"required",
        timeout:60000
      }});
      if(!(result instanceof PublicKeyCredential))throw new Error("No assertion returned");
      setStatus("Fingerprint verification completed");
    }catch(e){setStatus(e instanceof DOMException&&e.name==="NotAllowedError"?"Fingerprint verification was cancelled or denied":"Biometric verification failed")}
    finally{setBusy(false)}
  };
  return <div className="lab-page"><LabIntro icon={Fingerprint} title="Phone fingerprint security" subtitle="Use the phone's built-in platform authenticator. BioMedLab never receives the fingerprint image or fingerprint template."/><div className="biometric-card"><div className="fingerprint-large"><Fingerprint size={82}/></div><div><span className="eyebrow">WEBAUTHN · PLATFORM AUTHENTICATOR</span><h2>Real device biometric</h2><p>On a supported Android phone with a fingerprint enrolled, the browser asks the operating system to verify the fingerprint. The website receives a cryptographic credential/assertion, not your biometric data.</p><div className="bio-status"><CheckCircle2 size={17}/>{status}</div><div className="hero-actions"><button className="primary" disabled={busy||!supported} onClick={register}>{credentialId?"Register another fingerprint":"Register fingerprint"}</button><button className="secondary" disabled={busy||!credentialId} onClick={authenticate}>Verify fingerprint</button></div></div></div><Notice text={supported?"This requires HTTPS and a browser with a platform WebAuthn authenticator. The Android OS may use fingerprint, face unlock or device PIN according to the device's security policy.":"WebAuthn is unavailable in this browser."}/></div>
}function DeviceHub(){
  const [device,setDevice]=useState<BluetoothDeviceLike|null>(null);
  const [status,setStatus]=useState("No device connected");
  const connect=async()=>{
    const bluetooth=(navigator as Navigator & {bluetooth?:BluetoothLike}).bluetooth;
    if(!bluetooth){setStatus("Web Bluetooth is not supported");return}
    try{setStatus("Select your BLE sensor…");const d=await bluetooth.requestDevice({acceptAllDevices:true});const g=d.gatt;if(!g)throw new Error("GATT unavailable");await g.connect();setDevice(d);setStatus("BLE device connected");d.addEventListener("gattserverdisconnected",()=>{setDevice(null);setStatus("BLE device disconnected")});}catch(e){setStatus(e instanceof DOMException&&e.name==="NotFoundError"?"Device selection cancelled":"BLE connection failed")}
  };
  const disconnect=()=>{device?.gatt?.disconnect();setDevice(null);setStatus("No device connected")};
  return <div className="lab-page"><LabIntro icon={Bluetooth} title="Biomedical device hub" subtitle="Connect real BLE hardware. Data decoding is device-specific and requires the sensor's GATT service/characteristic specification."/><div className="device-grid"><Device name="BLE Heart Sensor" type="Heart-rate sensor" icon={HeartPulse} connected={!!device} onClick={device?disconnect:connect}/><Device name="Pulse Oximeter" type="SpO₂ / pulse" icon={Droplets} onClick={connect}/><Device name="ECG Acquisition Board" type="Analog front-end" icon={Activity} onClick={connect}/><Device name="Temperature Sensor" type="Digital temperature" icon={Thermometer} onClick={connect}/></div><div className="protocol-card"><Bluetooth size={20}/><div><strong>BLE status</strong><p>{status}</p></div><span>{device?"CONNECTED":"READY"}</span></div><Notice text="The browser can establish a real BLE GATT connection, but each sensor needs its documented service UUID, characteristic UUID and packet format before physiological values can be decoded." /></div>
}
type BluetoothDeviceLike={name?:string;gatt?:{connect:()=>Promise<unknown>;disconnect:()=>void}|null;addEventListener:(type:string,listener:()=>void)=>void};
type BluetoothLike={requestDevice:(options:{acceptAllDevices:boolean})=>Promise<BluetoothDeviceLike>};


function Notice({text}:{text:string}) {
  return <div className="notice"><AlertTriangle size={17}/><span>{text}</span></div>;
}

function LabIntro({icon:Icon,title,subtitle}:{icon:typeof HeartPulse;title:string;subtitle:string}) {
  return <div className="lab-intro"><div className="lab-intro-icon"><Icon size={25}/></div><div><span className="eyebrow">BIOMEDICAL ENGINEERING</span><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

function Metric({label,value}:{label:string;value:string}) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}

function Device({name,type,icon:Icon,connected=false,onClick}:{name:string;type:string;icon:typeof HeartPulse;connected?:boolean;onClick:()=>void}) {
  return <button className="device-card" onClick={onClick}><div className="module-icon"><Icon size={21}/></div><div><strong>{name}</strong><span>{type}</span></div><span className={connected?"device-state connected":"device-state"}>{connected?"CONNECTED":"CONNECT"}</span></button>;
}

function ResearchLab({setScreen}:{setScreen:(s:Screen)=>void}) {
  const topics=[
    ["Signal acquisition","Sampling, filtering, ADCs and noise reduction."],
    ["Physiological systems","Heart, circulation, respiration and biosignal fundamentals."],
    ["Biomedical instrumentation","Sensors, transducers, front-ends and embedded acquisition."],
    ["Digital health","Device interoperability, secure data handling and research workflows."]
  ];
  return <div className="lab-page"><LabIntro icon={Microscope} title="Biomedical engineering lab" subtitle="Reference material and practical instrumentation workflows for BME study and prototyping."/><div className="research-grid">{topics.map(([name,desc])=><article className="info-card" key={name}><div className="module-icon"><Microscope size={19}/></div><h3>{name}</h3><p>{desc}</p></article>)}</div><div className="info-card"><h3>Acquisition workflow</h3><p>Sensor → analog front-end → ADC → signal processing → validated measurement. Connect real hardware through Device Hub before expecting live physiological data.</p><button className="secondary" onClick={()=>setScreen("devices")}>Open Device Hub <ArrowRight size={15}/></button></div></div>;
}

function Settings() {
  return <div className="lab-page"><LabIntro icon={Layers3} title="System settings" subtitle="Local application configuration and measurement safety information."/><div className="settings-grid"><div className="info-card"><h3>Measurement policy</h3><p>BioMedLab does not fabricate patient measurements. Values remain unavailable until a real acquisition source supplies them.</p></div><div className="info-card"><h3>Security</h3><p>Platform biometrics use WebAuthn. The browser receives cryptographic credentials rather than raw fingerprint images or templates.</p></div><div className="info-card"><h3>Browser capabilities</h3><p>Camera PPG, WebAuthn and Web Bluetooth availability depends on the phone, browser, permissions and secure-context requirements.</p></div></div><Notice text="Biomedical measurements shown by this educational application should not be treated as a diagnosis or replacement for validated medical equipment." /></div>;
}
