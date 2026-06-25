import Link from 'next/link';
import {
  Video, Mic, Bot, Sparkles, Music, Upload, Zap,
  Monitor, Smartphone, Megaphone, Layers, Wand2, Rocket,
  Check, Minus, ChevronRight, Play, Github, Twitter, Menu,
  ArrowRight,
} from 'lucide-react';

/* ─── Navbar ──────────────────────────────────────────────── */
function NavBar() {
  return (
    <nav className="glass sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Video className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-zinc-100 text-sm tracking-tight">AI Video Studio</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#formats" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Formats</a>
          <a href="#features" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Features</a>
          <a href="#howitworks" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5">
            Login
          </Link>
          <Link href="/login" className="flex items-center gap-1.5 text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors">
            Start Free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile hamburger (pure CSS peer trick) */}
        <label htmlFor="nav-toggle" className="md:hidden cursor-pointer text-zinc-400 hover:text-zinc-100">
          <Menu className="h-5 w-5" />
        </label>
      </div>

      {/* Mobile menu */}
      <input type="checkbox" id="nav-toggle" className="peer hidden" />
      <div className="peer-checked:flex hidden flex-col gap-1 px-6 pb-4 md:hidden border-t border-zinc-800">
        <a href="#formats"    className="text-sm text-zinc-400 py-2">Formats</a>
        <a href="#features"   className="text-sm text-zinc-400 py-2">Features</a>
        <a href="#howitworks" className="text-sm text-zinc-400 py-2">How it works</a>
        <a href="#pricing"    className="text-sm text-zinc-400 py-2">Pricing</a>
        <Link href="/login" className="mt-2 text-center text-sm font-semibold bg-violet-600 text-white px-4 py-2 rounded-lg">
          Start Free
        </Link>
      </div>
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="hero-glow min-h-[92vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="animate-fade-up">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-700/50 text-violet-300 text-xs font-medium px-3.5 py-1.5 rounded-full mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered · Code-Driven · ₹0 per render
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-zinc-100 leading-[1.08] tracking-tight mb-5">
            Create Professional<br />
            Videos{' '}
            <span className="gradient-text">Without a Studio.</span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl">
            Generate narrated, animated videos with AI voices, talking avatars, and
            background music — all rendered by code, at zero cost per video.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link href="/login" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
              Start Creating Free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#demo" className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 font-medium px-6 py-3 rounded-xl transition-colors text-sm">
              <Play className="h-4 w-4 text-violet-400" /> Watch Demo
            </a>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2">
            {['6 video formats', 'Piper TTS narration', 'SadTalker avatars', 'Remotion + FFmpeg'].map(t => (
              <span key={t} className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — looping video */}
        <div className="animate-float relative flex justify-center lg:justify-end">
          <div className="relative max-w-lg w-full">
            <div className="rounded-2xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-violet-900/50 animate-pulse-ring">
              <video
                src="/videos/showcase.mp4"
                poster="/videos/showcase-poster.png"
                autoPlay muted loop playsInline
                className="w-full block"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 glass border border-zinc-700 rounded-xl px-3 py-2 shadow-xl">
              <p className="text-xs text-violet-400 font-mono font-semibold">₹0 / render</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">20s · Code-generated</p>
            </div>
            {/* Top-left badge */}
            <div className="absolute -top-3 -left-3 bg-green-950 border border-green-700 text-green-400 text-[10px] font-semibold px-2.5 py-1 rounded-full">
              ● LIVE DEMO
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Demo section ─────────────────────────────────────────── */
function DemoSection() {
  return (
    <section id="demo" className="py-24 border-t border-zinc-800/60">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-zinc-400 text-xs px-4 py-1.5 rounded-full mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            100% code-generated · No camera · No editor
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-3">
            See Exactly What Gets Generated
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            This 20-second reel was rendered entirely with Remotion + FFmpeg — no video editor, no camera, no design tools.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl shadow-violet-900/20 ring-1 ring-violet-500/20">
          <video
            src="/videos/showcase.mp4"
            poster="/videos/showcase-poster.png"
            controls
            preload="metadata"
            className="w-full aspect-video bg-zinc-900 block"
          />
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          ShowcaseReel composition · 600 frames @ 30fps · DreamFilm mascot · SVG-drawn character
        </p>
      </div>
    </section>
  );
}

/* ─── Video formats ─────────────────────────────────────────── */
function FormatsSection() {
  const formats = [
    {
      icon: Monitor,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      badge: '1920 × 1080 · Landscape',
      badgeColor: 'bg-blue-950/50 text-blue-400 border-blue-700/40',
      title: 'Long-form Explainer',
      desc: 'Educational and documentary-style videos with narrated scenes, animated mascots, and background music. Perfect for YouTube.',
      specs: ['Up to 10 min', 'DreamFilm · SolarFilm', 'Piper TTS narration', 'Scene-based timing'],
    },
    {
      icon: Smartphone,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      badge: '1080 × 1920 · Portrait',
      badgeColor: 'bg-violet-950/50 text-violet-400 border-violet-700/40',
      title: 'Short-form Reel',
      desc: 'Dynamic portrait videos with per-scene narration, AI-generated images, and talking avatar overlays. Built for Reels and Shorts.',
      specs: ['Dynamic length', 'TTS + Talking Avatar', 'AI image per scene', 'YouTube Shorts / Reels'],
      featured: true,
    },
    {
      icon: Megaphone,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      badge: '1080 × 1920 · 15 seconds',
      badgeColor: 'bg-orange-950/50 text-orange-400 border-orange-700/40',
      title: '15-Second Ad',
      desc: 'Product advertisement with intro, showcase, and call-to-action. Set your brand colors, product image, and tagline.',
      specs: ['Exactly 15 seconds', 'Custom brand color', 'Product + tagline', 'CTA button'],
    },
  ];

  return (
    <section id="formats" className="py-24 border-t border-zinc-800/60 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-3">3 Video Types, One Platform</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Choose the format that fits your content — from long documentaries to 15-second ads.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formats.map(f => (
            <div key={f.title} className={`card-lift bg-zinc-900 border rounded-2xl p-7 flex flex-col ${f.featured ? 'border-violet-500/50 ring-1 ring-violet-500/20' : 'border-zinc-800'}`}>
              {f.featured && (
                <div className="mb-4">
                  <span className="bg-violet-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">Most popular</span>
                </div>
              )}
              <div className={`h-11 w-11 rounded-xl border flex items-center justify-center mb-5 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border mb-4 w-fit ${f.badgeColor}`}>
                {f.badge}
              </span>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5 flex-1">{f.desc}</p>
              <ul className="space-y-1.5 mb-6">
                {f.specs.map(s => (
                  <li key={s} className="flex items-center gap-2 text-xs text-zinc-400">
                    <Check className="h-3.5 w-3.5 text-violet-400 shrink-0" />{s}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm font-semibold border border-zinc-700 hover:border-violet-500 text-zinc-300 hover:text-violet-300 px-4 py-2.5 rounded-xl transition-colors">
                Create This <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ──────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    { icon: Mic,       color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', title: 'AI Narration',      desc: 'Piper TTS converts your script to natural-sounding speech. Runs offline, syncs to frame duration automatically.' },
    { icon: Bot,       color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20',     title: 'Talking Avatars',   desc: 'Upload any face photo — SadTalker animates it to speak your narration with realistic lip sync.' },
    { icon: Sparkles,  color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/20',     title: 'AI Image Gen',      desc: 'Generate scene backgrounds from text prompts using 4 free providers: Pollinations, Gemini, Cloudflare, HuggingFace.' },
    { icon: Music,     color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20',   title: 'Background Music',  desc: 'Pick from 30+ curated free tracks by mood (calm, dramatic, upbeat), or generate custom AI music via Mubert.' },
    { icon: Upload,    color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', title: '1-Click Publish',   desc: 'Connect your YouTube and Instagram accounts via OAuth. Publish your rendered MP4 directly from the studio.' },
    { icon: Zap,       color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: '₹0 Per Render',     desc: 'Remotion renders via headless Chrome, FFmpeg handles audio mixing. No third-party API — every render is free.' },
  ];

  return (
    <section id="features" className="py-24 border-t border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-3">Everything Built In</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">No integrations to stitch together. Every tool you need is included and works out of the box.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="card-lift bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 group">
              <div className={`h-11 w-11 rounded-xl border flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-200 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ──────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { icon: Layers,  n: '01', title: 'Choose & Name',    desc: 'Pick your video format — explainer, short reel, or ad. Give it a title and select a starting template.' },
    { icon: Wand2,   n: '02', title: 'Add AI Content',   desc: 'Write scene narrations, generate AI voices, add images and a talking avatar. The studio previews each scene.' },
    { icon: Rocket,  n: '03', title: 'Render & Publish', desc: 'Hit Render — Remotion builds your MP4 in seconds. Then publish directly to YouTube or Instagram.' },
  ];

  return (
    <section id="howitworks" className="py-24 border-t border-zinc-800/60 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-3">From Idea to Video in 3 Steps</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">The whole pipeline — script, voice, visuals, render, publish — runs inside the studio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-violet-500/40 via-violet-500/60 to-violet-500/40" />

          {steps.map((s, i) => (
            <div key={s.n} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-2xl bg-violet-950/60 border border-violet-700/50 flex items-center justify-center">
                  <s.icon className="h-8 w-8 text-violet-400" />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ───────────────────────────────────────────────── */
function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'Perfect for trying out the platform.',
      cta: 'Get Started Free',
      ctaStyle: 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white',
      features: [
        { text: '5 renders per month',     ok: true },
        { text: 'Short-form Reel only',    ok: true },
        { text: 'AI narration (TTS)',       ok: true },
        { text: 'AI image generation',     ok: true },
        { text: 'Watermark on videos',     ok: false },
        { text: 'All 6 video formats',     ok: false },
        { text: 'YouTube/Instagram publish', ok: false },
        { text: 'Priority render queue',   ok: false },
      ],
    },
    {
      name: 'Pro',
      price: '₹999',
      period: '/month',
      desc: 'For creators publishing regularly.',
      cta: 'Start Pro Trial',
      ctaStyle: 'bg-violet-600 hover:bg-violet-500 text-white',
      featured: true,
      features: [
        { text: '50 renders per month',    ok: true },
        { text: 'All 6 video formats',     ok: true },
        { text: 'AI narration (TTS)',       ok: true },
        { text: 'AI image generation',     ok: true },
        { text: 'No watermark',            ok: true },
        { text: 'YouTube/Instagram publish', ok: true },
        { text: 'Talking avatar (SadTalker)', ok: true },
        { text: 'Priority render queue',   ok: false },
      ],
    },
    {
      name: 'Business',
      price: '₹2,499',
      period: '/month',
      desc: 'For teams and high-volume publishers.',
      cta: 'Contact Us',
      ctaStyle: 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white',
      features: [
        { text: 'Unlimited renders',       ok: true },
        { text: 'All 6 video formats',     ok: true },
        { text: 'AI narration (TTS)',       ok: true },
        { text: 'AI image generation',     ok: true },
        { text: 'No watermark',            ok: true },
        { text: 'YouTube/Instagram publish', ok: true },
        { text: 'Talking avatar (SadTalker)', ok: true },
        { text: 'Priority render queue',   ok: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 border-t border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-3">Start Free, Scale as You Grow</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">No credit card required to get started. Upgrade when you need more renders or formats.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map(p => (
            <div key={p.name} className={`relative bg-zinc-900 border rounded-2xl p-8 ${p.featured ? 'border-violet-500 ring-2 ring-violet-500/25 scale-[1.03] shadow-xl shadow-violet-900/30' : 'border-zinc-800'}`}>
              {p.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-bold text-zinc-100 mb-1">{p.name}</h3>
              <p className="text-xs text-zinc-500 mb-4">{p.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-zinc-100">{p.price}</span>
                <span className="text-sm text-zinc-500 ml-1">{p.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {p.features.map(f => (
                  <li key={f.text} className="flex items-center gap-2.5 text-sm">
                    {f.ok
                      ? <Check className="h-4 w-4 text-green-400 shrink-0" />
                      : <Minus className="h-4 w-4 text-zinc-700 shrink-0" />}
                    <span className={f.ok ? 'text-zinc-300' : 'text-zinc-600'}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`block text-center text-sm font-semibold px-4 py-3 rounded-xl transition-colors ${p.ctaStyle}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24 border-t border-zinc-800/60 bg-zinc-950/50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-zinc-100 mb-4">
          Your first video is{' '}
          <span className="gradient-text">completely free.</span>
        </h2>
        <p className="text-zinc-400 mb-8 text-lg">
          No credit card. No trial period. Just sign up and start creating.
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-2xl transition-colors text-base">
          Create Your First Video <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="text-xs text-zinc-600 mt-4">5 free renders · No watermark on first video · Cancel anytime</p>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Video className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-zinc-100 text-sm">AI Video Studio</span>
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
            Code-driven AI video creation. No camera, no editor — just your script and the engine.
          </p>
        </div>

        {/* Links */}
        {[
          { heading: 'Product',    links: ['Features', 'Formats', 'Pricing', 'Changelog'] },
          { heading: 'Resources',  links: ['Docs', 'API', 'Templates', 'Blog'] },
          { heading: 'Company',    links: ['About', 'Contact', 'Privacy', 'Terms'] },
        ].map(col => (
          <div key={col.heading}>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{col.heading}</p>
            <ul className="space-y-2">
              {col.links.map(l => (
                <li key={l}>
                  <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-zinc-600">© 2026 AI Video Studio. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Twitter className="h-4 w-4" /></a>
          <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Github className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <NavBar />
      <HeroSection />
      <DemoSection />
      <FormatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
