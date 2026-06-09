# Personal Assistance - Showcase Genie

I vibe-coded an app to help me practice my Showcase Genie routines. Showcase Genie consists of two showcase choreographies: a Smooth routine danced to A Whole New World and a Rhythm routine danced to Friend Like Me.

Learning a new choreography effectively requires a structured approach. One of the most effective ways to do this is to break the choreography into musical phrases—digestible segments that can be practiced individually before gradually combining multiple phrases into longer sequences. By progressively stitching these phrases together, I can eventually master the entire routine.

This app automated the process of breaking a choreography into musical phrases and added helpful features such as adjustable speed, counts, a metronome, repeat mode, and mirror mode, making practice more effective and efficient.

---
<br />

## Features

- **Two showcases** — *Friend Like Me* (Swing, 4/4) and *A Whole New World* (Waltz, 3/4)
- **Phrase-based drilling** — each showcase split into 11–14 named musical phrases with timestamps and counts
- **Music-locked metronome** — Web Audio API click track that arms/disarms with the play button, phase-aligned to the song's downbeat
- **Live count overlay** — counts 1-2-3-4 (4/4) or 1-2-3 (3/4) in time with the music
- **Variable speed** — ¼×, ½×, ¾×, 1× practice tempos
- **Mirror mode** — flips the video horizontally for follow-along practice
- **Repeat mode** — auto-rewinds the current phrase
<br />

## Tech Stack

- **Frontend:** Static HTML / CSS / JavaScript — no framework
- **Audio:** Web Audio API (metronome)
- **Hosting:** Vercel (static, global edge CDN)
- **Built with:** Perplexity Computer (Claude Sonnet 4.6)
<br />

## Project Structure

```
dance-app/
├── index.html              # Markup, control rows, video element
├── styles.css              # Warm cream + terracotta theme, responsive layout
├── app.js                  # State machine, metronome, count overlay
├── vercel.json             # Vercel static-site config
├── assets/
│   ├── showcases.js        # Phrase data (BPM, timestamps, counts) per showcase
│   └── segments.json       # Segment metadata cache
└── clips/
    ├── friend-like-me/     # 14 phrase MP4s + full showcase
    └── whole-new-world/    # 11 phrase MP4s + full showcase
```
<br />

## Run Locally

```bash
git clone https://github.com/juliafsuzuki/showcase-practice-genie.git
cd showcase-practice-genie
python3 -m http.server 8765
# open http://localhost:8765
```

No build step. No dependencies. Edit files and refresh.
<br />

## Deploy

```bash
vercel deploy --prod
```

The repo includes `vercel.json` configuring static hosting.
<br />

## Access

<img width="916" height="722" alt="image" src="https://github.com/user-attachments/assets/7327b22a-0872-46f0-8bf2-5765faf2f4b8" />

👉 https://showcase-genie.vercel.app/
<br />

## Adding a New Showcase

1. Drop your phrase MP4s into `clips/<showcase-id>/` (numbered, e.g. `01_Intro.mp4`)
2. Append a new entry to `window.SHOWCASES` in `assets/showcases.js` with `id`, `title`, `subtitle`, `bpm`, `countsPerBar`, `duration`, and a `phrases` array of `{name, start, end, counts, file}`
3. Refresh — the showcase dropdown picks it up automatically


## License

Personal project. All choreography and music remain the property of their respective owners.
