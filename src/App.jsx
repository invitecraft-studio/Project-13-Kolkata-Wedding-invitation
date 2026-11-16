import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import D from './data.json';

const P = import.meta.glob('./assets/*.{jpg,png}', { eager: true, import: 'default' });
const img = (n) => P[`./assets/${n}.jpg`] || P[`./assets/${n}.png`];
const GOLD = ['#c9a24d', '#f1d98f', '#fff3cf', '#8c1d2b'];
const pop = (o = {}) => confetti({ particleCount: 90, spread: 80, origin: { y: 0.65 }, colors: GOLD, ...o });
const rise = { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-10%' }, transition: { duration: 0.9 } };
const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

function Dust() {
  const c = useRef(null);
  useEffect(() => {
    const cv = c.current, x = cv.getContext('2d'); let w, h, raf;
    const size = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; }; size(); addEventListener('resize', size);
    const ps = Array.from({ length: 55 }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 2, v: 0.15 + Math.random() * 0.5, s: Math.random() * 6, a: Math.random() * 6, pt: i % 4 === 0, c: i % 8 === 0 ? 'rgba(160,30,45,.55)' : 'rgba(240,150,40,.5)' }));
    const tick = () => { x.clearRect(0, 0, w, h);
      for (const p of ps) { p.s += 0.03; p.x += Math.sin(p.s) * 0.5;
        if (p.pt) { p.y += p.v * 1.6; p.a += 0.02; if (p.y > h + 12) { p.y = -12; p.x = Math.random() * w; } x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = 0.8; x.fillStyle = p.c; x.beginPath(); x.ellipse(0, 0, 7, 4, 0, 0, 7); x.fill(); x.restore(); }
        else { p.y -= p.v; if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; } x.globalAlpha = 0.35 + 0.35 * Math.sin(p.s * 2); x.fillStyle = '#f1d98f'; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); } }
      raf = requestAnimationFrame(tick); }; tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={c} className="dust" aria-hidden="true" />;
}

function Gate({ onOpen }) {
  const [open, setOpen] = useState(false);
  const go = () => { if (open) return; setOpen(true); pop({ origin: { y: 0.5 }, particleCount: 140, spread: 130 }); setTimeout(onOpen, 2300); };
  const door = (side) => (
    <motion.div className={'door ' + side} style={{ backgroundImage: `url(${img(1)})` }}
      animate={open ? { x: side === 'l' ? '-102%' : '102%' } : { x: 0 }} transition={{ duration: 2.1, ease: [0.7, 0, 0.2, 1], delay: 0.15 }} />
  );
  return (
    <motion.div className="gate" onClick={go} role="button" tabIndex={0} aria-label="Tap to open the doors" onKeyDown={(e) => e.key === 'Enter' && go()} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <div className="behind"><img src={img(2)} alt="" /></div>
      {door('l')}{door('r')}
      <motion.img className="lamps" src={img(11)} alt="" animate={open ? { y: -300, opacity: 0 } : { rotate: [-1.5, 1.5, -1.5] }} transition={open ? { duration: 1.4 } : { repeat: Infinity, duration: 5, ease: 'easeInOut' }} />
      <motion.div className="gt" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.6 }}>
        <small className="bn">{D.bengali}</small>
        <h1><span>{D.bride}</span><i>❖</i><span>{D.groom}</span></h1>
        <p>are getting married</p>
        <motion.span className="hint" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2.4 }}>Tap to open the doors</motion.span>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const dt = new Date(D.date), tz = { timeZone: 'Asia/Kolkata' };
  const wd = dt.toLocaleDateString('en-IN', { ...tz, weekday: 'long' }), dd = dt.toLocaleDateString('en-IN', { ...tz, day: '2-digit' }), my = dt.toLocaleDateString('en-IN', { ...tz, month: 'long', year: 'numeric' });
  const reveal = (d) => ({ initial: { opacity: 0, y: 50, filter: 'blur(14px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { delay: d, duration: 1.5 } });
  return (
    <header className="hero">
      <div className="hbg" style={{ backgroundImage: `url(${img(2)})` }} />
      <motion.img className="mandala" src={img(6)} alt="" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 140, ease: 'linear' }} />
      <motion.img className="halo" src={img(6)} alt="" animate={{ rotate: -360, scale: [1, 1.06, 1] }} transition={{ rotate: { repeat: Infinity, duration: 90, ease: 'linear' }, scale: { repeat: Infinity, duration: 6 } }} />
      <motion.img className="vine vl" src={img(9)} alt="" animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }} />
      <motion.img className="vine vr" style={{ scaleX: -1 }} src={img(9)} alt="" animate={{ rotate: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }} />
      <motion.img className="hl" src={img(11)} alt="" initial={{ y: -260 }} animate={{ y: 0, rotate: [-2, 2, -2] }} transition={{ y: { duration: 1.8, delay: 0.3, type: 'spring', damping: 11 }, rotate: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }} />
      <motion.img className="pea pl" src={img(10)} alt="" initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0, y: [0, -8, 0] }} transition={{ opacity: { delay: 1, duration: 1.6 }, x: { delay: 1, duration: 1.6 }, y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' } }} />
      <motion.img className="pea pr" style={{ scaleX: -1 }} src={img(10)} alt="" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0, y: [0, -8, 0] }} transition={{ opacity: { delay: 1, duration: 1.6 }, x: { delay: 1, duration: 1.6 }, y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' } }} />
      <div className="hc">
        <motion.small className="bn" {...reveal(0.5)}>{D.bengali}</motion.small>
        <motion.p className="eyebrow" {...reveal(0.7)}>Save the date · The wedding of</motion.p>
        <h1 className="names"><motion.em {...reveal(1)}>{D.bride}</motion.em><motion.i initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.6, type: 'spring' }}>&amp;</motion.i><motion.em {...reveal(1.9)}>{D.groom}</motion.em></h1>
        <motion.div className="db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1.2 }}>
          <span>{wd}</span><b>{dd}</b><span>{my}</span>
        </motion.div>
        <motion.div className="gl" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 3, duration: 1.4 }} />
        <motion.p className="where" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 1 }}>{D.city}</motion.p>
      </div>
      <motion.span className="scrl" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>scroll ↓</motion.span>
    </header>
  );
}

function Countdown() {
  const [n, setN] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(i); }, []);
  const t0 = new Date(D.date).getTime(), s = Math.max(0, Math.floor((t0 - n) / 1000)), done = n >= t0 && n < t0 + 864e5, C = 276.46;
  const box = [['days', Math.floor(s / 86400), 60], ['hours', Math.floor((s % 86400) / 3600), 24], ['minutes', Math.floor((s % 3600) / 60), 60], ['seconds', s % 60, 60]];
  return (
    <section className="cdw" style={{ backgroundImage: `linear-gradient(rgba(26,14,8,.8),rgba(26,14,8,.92)),url(${img(13)})` }}>
      <motion.h3 className="h lt" {...rise}>Until we say “I do”</motion.h3>
      {done ? <p className="td">Today is the day ✨</p> : (
        <motion.div className="rgs" {...rise}>
          {box.map(([l, v, m]) => (
            <div className="rg" key={l}>
              <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" className="tr" /><circle cx="50" cy="50" r="44" className="pr" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - Math.min(v, m) / m) }} /></svg>
              <b>{String(v).padStart(2, '0')}</b><small>{l}</small>
            </div>))}
        </motion.div>)}
      <p className="sub">{D.dateText} · {D.city}</p>
    </section>
  );
}

function Invite() {
  const ref = useRef(null), on = useInView(ref, { once: true, amount: 0.05 });
  const it = { hidden: { opacity: 0, y: 16, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8 } } };
  const sp = [[-4, 8], [100, 14], [-6, 48], [102, 55], [2, 90], [96, 94], [50, -3]];
  return (
    <section className="inv" ref={ref}>
      <motion.div className="sw" animate={on ? { y: [0, -8, 0] } : {}} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 3 }}>
        {sp.map(([l, t], i) => <i className="spk" key={i} style={{ left: l + '%', top: t + '%', animationDelay: i * 0.45 + 's' }}>✦</i>)}
        <motion.div className="seal" initial={{ scale: 0.6, opacity: 0 }} animate={on ? { scale: [0.6, 1.1, 1, 1.25, 0], opacity: [0, 1, 1, 1, 0], rotate: [0, 0, 0, 12, 60] } : {}} transition={{ duration: 1.5, times: [0, 0.25, 0.55, 0.75, 1] }}>
          <span>{D.bride[0]}{D.groom[0]}</span>
        </motion.div>
        <motion.div className="scroll" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={on ? { clipPath: 'inset(0 0 0% 0)' } : {}} transition={{ duration: 1.4, delay: 1.1, ease: [0.5, 0, 0.2, 1] }} style={{ backgroundImage: `url(${img(8)})` }}>
          <motion.div className="si" initial="hidden" animate={on ? 'show' : 'hidden'} variants={{ show: { transition: { staggerChildren: 0.18, delayChildren: 1.6 } } }}>
            <motion.small className="bn" variants={it}>{D.bengali}</motion.small>
            <motion.p className="k" variants={it}>Together with their families</motion.p>
            <motion.p className="par" variants={it}>{D.brideParents}<br />&amp;<br />{D.groomParents}</motion.p>
            <motion.p className="k" variants={it}>request the honour of your presence at the wedding of</motion.p>
            <motion.h2 variants={it}>{D.bride}<span>weds</span>{D.groom}</motion.h2>
            <motion.p className="par" variants={it}>{D.invite}</motion.p>
            <motion.p className="dt" variants={it}>{D.dateText}</motion.p><motion.p className="k" variants={it}>{D.city}</motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
function Story() {
  const N = D.story.length, [k, setK] = useState(0), [dir, setDir] = useState(1), cur = D.story[k];
  const go = (d) => { setDir(d); setK((v) => (v + d + N) % N); pop({ particleCount: 22, spread: 70, origin: { y: 0.5 }, scalar: 0.7, colors: GOLD }); };
  return (
    <section className="story">
      <motion.img className="smand" src={img(6)} alt="" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 160, ease: 'linear' }} />
      <motion.h3 className="h" {...rise}>Our story</motion.h3><p className="sub">Tap the photo to turn the page</p>
      <div className="book">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div className="pg" key={k} custom={dir} onClick={() => go(1)} onPanEnd={(e, p) => { if (p.offset.x < -50) go(1); else if (p.offset.x > 50) go(-1); }} role="button" tabIndex={0} aria-label="Next memory" onKeyDown={(e) => e.key === 'Enter' && go(1)}
            initial={(d) => ({ rotateY: d * 80, opacity: 0, scale: 0.94, transformOrigin: d > 0 ? 'right center' : 'left center' })}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={(d) => ({ rotateY: -d * 80, opacity: 0, scale: 0.94, transformOrigin: d > 0 ? 'left center' : 'right center' })}
            transition={{ duration: 0.55, ease: [0.6, 0, 0.3, 1] }}>
            <img src={img(cur.img)} alt={cur.t} draggable="false" />
            <motion.span className="tapme" animate={{ scale: [1, 1.12, 1], opacity: [0.95, 0.5, 0.95] }} transition={{ repeat: Infinity, duration: 1.8 }}>tap ❖</motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait"><motion.div className="ct" key={k} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
        <small>Chapter {ROM[k]} of {ROM[N - 1]}</small><h4>{cur.t}</h4><p>{cur.x}</p>
      </motion.div></AnimatePresence>
      <div className="nav"><button onClick={() => go(-1)} aria-label="Previous">‹</button>
        <div className="dots">{D.story.map((_, i) => <button key={i} className={i === k ? 'on' : ''} onClick={() => { setDir(i > k ? 1 : -1); setK(i); }} aria-label={'Chapter ' + (i + 1)} />)}</div>
        <button onClick={() => go(1)} aria-label="Next">›</button></div>
    </section>
  );
}

function Rings() {
  const [j, setJ] = useState(false), [t, setT] = useState(''), [ls, setLs] = useState([]);
  const send = (e) => { e.preventDefault(); setLs((v) => [...v, { id: Date.now(), t: t.trim() || 'Happy married life', x: 8 + Math.random() * 70 }]); setT(''); pop({ particleCount: 40, origin: { y: 0.92 }, scalar: 0.7 }); };
  return (
    <section className="rings">
      <motion.img className="mand2" src={img(6)} alt="" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 180, ease: 'linear' }} />
      {[8, 22, 40, 58, 76, 90].map((x, i) => <i className="amb" key={i} style={{ left: x + '%', animationDelay: i * 2.3 + 's', animationDuration: 12 + (i % 3) * 3 + 's' }} />)}
      {ls.map((l) => (
        <motion.div key={l.id} className="sl" style={{ left: l.x + '%' }} initial={{ y: 0, opacity: 0 }} animate={{ y: '-105svh', x: [0, 18, -14, 10], opacity: [0, 1, 1, 0] }} transition={{ duration: 10, ease: 'easeOut' }} onAnimationComplete={() => setLs((v) => v.filter((q) => q.id !== l.id))}>
          <i /><span>{l.t}</span>
        </motion.div>))}
      <h3 className="h lt">Two rings, one promise</h3>
      <p className="sub">{j ? 'The promise is sealed.' : 'Tap the rings to seal it'}</p>
      <div className="med">
        <div className="orb" /><div className="orb o2" />
        <motion.button className="rb" onClick={() => { setJ(true); pop({ particleCount: 170, spread: 120 }); }} whileTap={{ scale: 0.93 }} animate={j ? { scale: [1, 1.18, 1.06], rotate: [0, 14, 0] } : { scale: [1, 1.05, 1] }} transition={j ? { duration: 0.9 } : { repeat: Infinity, duration: 2.4 }} aria-label="Seal the promise">
          <img src={img(12)} alt="Gold wedding rings" />
        </motion.button>
        {j && [0, 1, 2].map((i) => <motion.span key={i} className="rp" initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 2, delay: i * 0.45, repeat: Infinity }} />)}
      </div>
      <AnimatePresence mode="wait"><motion.p key={j} className="vow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        {j ? 'Two lives, joined for every sunrise to come.' : 'A circle has no end, and neither will our love.'}
      </motion.p></AnimatePresence>
      {j && <motion.form className="bl" onSubmit={send} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <p>Send us a blessing and watch it float into the night sky</p>
        <div><input value={t} maxLength={28} onChange={(e) => setT(e.target.value)} placeholder="Your wish for the couple" aria-label="Blessing" /><button className="btn" type="submit">Release 🏮</button></div>
      </motion.form>}
    </section>
  );
}

function ics(e) {
  const d = e.d.replace(/-/g, '');
  const body = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${e.t} · ${D.bride} & ${D.groom}\nDTSTART;VALUE=DATE:${d}\nLOCATION:${e.venue}\nDESCRIPTION:${e.time}\nEND:VEVENT\nEND:VCALENDAR`;
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = e.t + '.ics'; a.click();
}

function Events() {
  return (
    <section className="ev">
      <motion.h3 className="h lt" {...rise}>The celebrations</motion.h3>
      <div className="line" />
      {D.events.map((e, i) => (
        <motion.article key={i} className="evc" style={{ backgroundImage: `linear-gradient(180deg,rgba(26,14,8,.35),rgba(26,14,8,.88)),url(${img(e.img)})` }} initial={{ opacity: 0, x: i % 2 ? 90 : -90, rotate: i % 2 ? 3 : -3 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 1.1 }}>
          <img className="orn" src={img(9)} alt="" />
          <small>{fmt(e.d)}</small><h4>{e.t}</h4><p>{e.x}</p>
          <p className="meta">{e.time} · {e.venue}</p>
          <div className="btns">
            <a className="btn" href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.venue)} target="_blank" rel="noreferrer">Directions</a>
            <button className="btn ghost" onClick={() => ics(e)}>Add to calendar</button>
          </div>
        </motion.article>
      ))}
    </section>
  );
}

function Venue() {
  return (
    <section className="venue" style={{ backgroundImage: `linear-gradient(rgba(26,14,8,.55),rgba(26,14,8,.8)),url(${img(7)})` }}>
      <motion.div {...rise}>
        <h3 className="h lt">Find us in Kolkata</h3>
        <div className="map"><iframe title="Map" loading="lazy" src={'https://maps.google.com/maps?q=' + encodeURIComponent(D.events[1].venue) + '&output=embed'} /></div>
      </motion.div>
    </section>
  );
}

function Rsvp() {
  const [f, setF] = useState({ name: '', guests: '1', yes: true });
  const send = (e) => {
    e.preventDefault(); pop({ particleCount: 120 });
    const m = `${f.yes ? 'Joyfully accepts' : 'Regretfully declines'} the wedding of ${D.bride} & ${D.groom}.\nName: ${f.name}\nGuests: ${f.guests}`;
    window.open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent(m)}`, '_blank');
  };
  return (
    <section className="rsvp" style={{ backgroundImage: `linear-gradient(rgba(48,8,14,.82),rgba(20,10,6,.94)),url(${img(7)})` }}>
      <motion.img className="lampsx" src={img(11)} alt="" animate={{ rotate: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} />
      <motion.form className="card2" onSubmit={send} style={{ transformPerspective: 1100 }} initial={{ opacity: 0, rotateX: -75, y: 70 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ duration: 1.3, ease: [0.2, 0.7, 0.2, 1] }}>
        {['tl', 'tr', 'bl', 'br'].map((c) => <img key={c} className={'cv ' + c} src={img(9)} alt="" />)}
        <small className="bn">{D.bengali}</small>
        <h3>R.S.V.P.</h3><p className="rl">Kindly favour us with your reply</p>
        <label>Your name<input required placeholder="Write your name here" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>Number of guests<select value={f.guests} onChange={(e) => setF({ ...f, guests: e.target.value })}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n > 1 ? 'guests' : 'guest'}</option>)}</select></label>
        <div className="tg"><button type="button" className={f.yes ? 'on' : ''} onClick={() => setF({ ...f, yes: true })}>Joyfully<br />Accept</button><button type="button" className={!f.yes ? 'on' : ''} onClick={() => setF({ ...f, yes: false })}>Regretfully<br />Decline</button></div>
        <motion.button className="wax" type="submit" whileTap={{ scale: 0.88, rotate: -10 }} animate={{ boxShadow: ['0 0 0 0 rgba(201,162,77,.5)', '0 0 0 16px rgba(201,162,77,0)'] }} transition={{ repeat: Infinity, duration: 2 }}><span>Seal<br />&amp; Send</span></motion.button>
      </motion.form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <img src={img(6)} alt="" className="fm" />
      <h2>{D.bride} <span>&amp;</span> {D.groom}</h2>
      <p>{D.closing}</p><p className="tag">{D.hashtag}</p>
      <a className="cr" href="https://instagram.com/invitecraftlove" target="_blank" rel="noreferrer">Invitation by InviteCraft · @invitecraftlove</a>
    </footer>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll(); const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  useEffect(() => { document.body.style.overflow = open ? '' : 'hidden'; }, [open]);
  return (
    <>
      <AnimatePresence>{!open && <Gate onOpen={() => setOpen(true)} />}</AnimatePresence>
      {open && <><motion.div className="bar" style={{ scaleX: sp }} /><Dust /><Hero /><Countdown /><Invite /><Story /><Rings /><Events /><Venue /><Rsvp /><Footer /></>}
    </>
  );
}
