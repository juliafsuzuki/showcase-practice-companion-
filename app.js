// Friend Like Me — Showcase Practice App
(function () {
  const P = window.PHRASES;
  const BEAT = window.BEAT_SEC; // ~0.604s

  // DOM
  const player = document.getElementById('player');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const restartBtn = document.getElementById('restartBtn');
  const loopBtn = document.getElementById('loopBtn');
  const countBtn = document.getElementById('countBtn');
  const mirrorBtn = document.getElementById('mirrorBtn');
  const speedPills = document.getElementById('speedPills');
  const phraseList = document.getElementById('phraseList');
  const phraseEyebrow = document.getElementById('phraseEyebrow');
  const phraseTitle = document.getElementById('phraseTitle');
  const phraseFocus = document.getElementById('phraseFocus');
  const statCounts = document.getElementById('statCounts');
  const statLen = document.getElementById('statLen');
  const countOverlay = document.getElementById('countOverlay');
  const countNum = document.getElementById('countNum');
  const listProgress = document.getElementById('listProgress');
  const passesEl = document.getElementById('passes');
  const resetPassesBtn = document.getElementById('resetPasses');
  const fullBtn = document.getElementById('fullBtn');
  const fullModal = document.getElementById('fullModal');
  const fullVideo = document.getElementById('fullVideo');
  const closeFull = document.getElementById('closeFull');

  // State (in-memory only — no storage APIs)
  const state = {
    idx: 0,
    loop: true,
    showCounts: true,
    mirror: false,
    speed: 1,
    passes: P.map(() => [false, false, false, false]),
  };

  // ----- Phrase list -----
  function renderList() {
    phraseList.innerHTML = '';
    P.forEach((p, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'phrase-item';
      btn.setAttribute('data-testid', `button-phrase-${p.i}`);
      btn.innerHTML = `
        <span class="phrase-num">${String(p.i).padStart(2, '0')}</span>
        <span class="phrase-info">
          <div class="phrase-name">${p.name}</div>
          <div class="phrase-time">${fmtTime(p.start)} – ${fmtTime(p.end)} · ${p.counts} cts</div>
        </span>
        <span class="phrase-check" aria-hidden="true"></span>
      `;
      btn.addEventListener('click', () => loadPhrase(i, true));
      li.appendChild(btn);
      phraseList.appendChild(li);
    });
    updateListActive();
    updateProgress();
  }

  function updateListActive() {
    [...phraseList.children].forEach((li, i) => {
      const btn = li.firstElementChild;
      btn.classList.toggle('active', i === state.idx);
      const allChecked = state.passes[i].every(Boolean);
      btn.classList.toggle('complete', allChecked);
    });
  }

  function updateProgress() {
    const done = state.passes.filter((arr) => arr.every(Boolean)).length;
    listProgress.textContent = `${done} / ${P.length} complete`;
  }

  // ----- Phrase loader -----
  function loadPhrase(i, autoplay) {
    if (i < 0) i = 0;
    if (i >= P.length) i = P.length - 1;
    state.idx = i;
    const p = P[i];
    player.src = p.file;
    player.playbackRate = state.speed;
    player.load();
    phraseEyebrow.textContent = `PHRASE ${p.i} OF ${P.length}`;
    phraseTitle.textContent = p.name;
    phraseFocus.textContent = p.focus;
    statCounts.textContent = p.counts;
    statLen.textContent = (p.end - p.start).toFixed(1) + 's';
    updateListActive();
    // refresh pass checkboxes
    [...passesEl.querySelectorAll('input')].forEach((cb, idx) => {
      cb.checked = state.passes[i][idx];
    });
    if (autoplay) {
      player.play().then(() => setPlayBtn(true)).catch(() => setPlayBtn(false));
    } else {
      setPlayBtn(false);
    }
  }

  // ----- Player controls -----
  function setPlayBtn(playing) {
    playBtn.textContent = playing ? '❚❚' : '▶';
  }
  playBtn.addEventListener('click', () => {
    if (player.paused) player.play(); else player.pause();
  });
  player.addEventListener('play', () => setPlayBtn(true));
  player.addEventListener('pause', () => setPlayBtn(false));
  player.addEventListener('ended', () => {
    if (state.loop) {
      player.currentTime = 0;
      player.play();
    } else {
      setPlayBtn(false);
    }
  });

  prevBtn.addEventListener('click', () => loadPhrase(state.idx - 1, true));
  nextBtn.addEventListener('click', () => loadPhrase(state.idx + 1, true));
  restartBtn.addEventListener('click', () => {
    player.currentTime = 0;
    player.play();
  });

  // Toggles
  function toggle(el, key, onLabel, offLabel) {
    el.addEventListener('click', () => {
      state[key] = !state[key];
      el.setAttribute('aria-pressed', String(state[key]));
      el.textContent = state[key] ? onLabel : offLabel;
      if (key === 'showCounts') countOverlay.classList.toggle('hidden', !state.showCounts);
      if (key === 'mirror') player.classList.toggle('mirrored', state.mirror);
    });
  }
  toggle(loopBtn, 'loop', 'On', 'Off');
  toggle(countBtn, 'showCounts', 'On', 'Off');
  toggle(mirrorBtn, 'mirror', 'On', 'Off');

  // Speed
  speedPills.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    state.speed = parseFloat(t.dataset.speed);
    player.playbackRate = state.speed;
    [...speedPills.children].forEach((b) => b.classList.toggle('active', b === t));
  });

  // ----- Count overlay (beat sync) -----
  let lastBeat = -1;
  player.addEventListener('timeupdate', () => {
    if (!state.showCounts) return;
    // beats elapsed since clip start
    const beatPos = player.currentTime / BEAT;
    const beat = Math.floor(beatPos);
    // 8-count cycling 1..8
    const display = (beat % 8) + 1;
    if (beat !== lastBeat) {
      lastBeat = beat;
      countNum.textContent = display;
      countOverlay.classList.add('beat');
      setTimeout(() => countOverlay.classList.remove('beat'), 110);
    }
  });
  player.addEventListener('seeked', () => { lastBeat = -1; });
  player.addEventListener('loadeddata', () => { lastBeat = -1; countNum.textContent = '1'; });

  // ----- Passes -----
  passesEl.addEventListener('change', (e) => {
    const cb = e.target;
    if (cb.tagName !== 'INPUT') return;
    const passIdx = parseInt(cb.dataset.pass, 10) - 1;
    state.passes[state.idx][passIdx] = cb.checked;
    updateListActive();
    updateProgress();
  });
  resetPassesBtn.addEventListener('click', () => {
    state.passes[state.idx] = [false, false, false, false];
    [...passesEl.querySelectorAll('input')].forEach((cb) => (cb.checked = false));
    updateListActive();
    updateProgress();
  });

  // ----- Full run modal -----
  fullBtn.addEventListener('click', () => {
    fullVideo.src = window.FULL_VIDEO;
    fullModal.hidden = false;
    fullVideo.play().catch(() => {});
  });
  closeFull.addEventListener('click', () => {
    fullVideo.pause();
    fullModal.hidden = true;
  });
  fullModal.addEventListener('click', (e) => {
    if (e.target === fullModal) { fullVideo.pause(); fullModal.hidden = true; }
  });

  // ----- Keyboard shortcuts -----
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); playBtn.click(); }
    else if (e.key === 'ArrowRight' && !e.shiftKey) nextBtn.click();
    else if (e.key === 'ArrowLeft' && !e.shiftKey) prevBtn.click();
    else if (e.key === 'r' || e.key === 'R') restartBtn.click();
    else if (e.key === 'm' || e.key === 'M') mirrorBtn.click();
    else if (e.key === 'l' || e.key === 'L') loopBtn.click();
  });

  // ----- Utils -----
  function fmtTime(s) {
    const m = Math.floor(s / 60);
    const r = (s - m * 60);
    return `${m}:${r.toFixed(1).padStart(4, '0')}`;
  }

  // ----- Init -----
  renderList();
  loadPhrase(0, false);
})();
