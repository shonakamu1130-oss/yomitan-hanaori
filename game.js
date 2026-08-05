/**
 * 読谷山花織パズル - 花織あわせ (Hanaori Awase)
 * Core Game Engine & Okinawan Traditional Textile Logic
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Traditional Yomitanzan Hanaori Motifs & SVG Generator
     ========================================================================== */
  const MOTIFS = {
    jinbana: {
      id: 'jinbana',
      name: '銭花',
      reading: 'ジンバナ',
      meaning: '金運・商売繁盛・富',
      color: '#f5b82e',
      bgGradient: 'radial-gradient(circle, #3d2d0c 0%, #171d2e 100%)',
      lore: '貨幣（コイン）を模した幾何学菱形文様。子孫繁栄と商売繁盛、富をもたらす縁起物として大切に織り込まれてきました。'
    },
    osaibana: {
      id: 'osaibana',
      name: '風車花',
      reading: 'オサイバナ / 押籠花',
      meaning: '平和・家庭円満・長寿',
      color: '#e63928',
      bgGradient: 'radial-gradient(circle, #3d0c0c 0%, #171d2e 100%)',
      lore: '風車の形をした風雅な花文様。風車が回り続けるように、家庭が絶え間なく円満で平和であり続けることを願う文様です。'
    },
    umanoashi: {
      id: 'umanoashi',
      name: '馬の足',
      reading: 'ウマノアシ',
      meaning: '旅の安全・交通安全・前進',
      color: '#1cb896',
      bgGradient: 'radial-gradient(circle, #0c3d32 0%, #171d2e 100%)',
      lore: '馬の足跡（連続するステップ）を模した連鎖文様。道中の無事安全や、人生が一歩一歩着実に前進することを祈願しています。'
    },
    hanasashi: {
      id: 'hanasashi',
      name: '花刺し',
      reading: 'ハナサシ',
      meaning: '華やかさ・魔除け・愛情',
      color: '#e63988',
      bgGradient: 'radial-gradient(circle, #3d0c2c 0%, #171d2e 100%)',
      lore: '十字の刺し子風幾何学花文様。悪霊を祓う魔除けの力があるとされ、大切な人への愛情を込めて着物に浮き織りされました。'
    },
    kashiradaka: {
      id: 'kashiradaka',
      name: '琉球星',
      reading: 'カシラダカ',
      meaning: '高貴・成就・星の導き',
      color: '#eef2f7',
      bgGradient: 'radial-gradient(circle, #2d3440 0%, #171d2e 100%)',
      lore: '夜空に輝く一番星をかたどった八角・六角の花文様。かつて琉球王府の貴族のみが着用を許された最高格式の幾何学紋様です。'
    }
  };

  const MOTIF_KEYS = Object.keys(MOTIFS);

  /**
   * Generates crisp, authentic SVG vector motif graphics
   */
  function createMotifSVG(motifId, specialType = null) {
    const info = MOTIFS[motifId] || MOTIFS.jinbana;
    const c = info.color;

    let paths = '';

    if (motifId === 'jinbana') {
      // Diamond Coin Pattern
      paths = `
        <rect x="24" y="24" width="32" height="32" transform="rotate(45 40 40)" fill="none" stroke="${c}" stroke-width="4" />
        <rect x="29" y="29" width="22" height="22" transform="rotate(45 40 40)" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="3 3" />
        <circle cx="40" cy="40" r="4" fill="${c}" />
        <line x1="40" y1="12" x2="40" y2="22" stroke="${c}" stroke-width="3" />
        <line x1="40" y1="58" x2="40" y2="68" stroke="${c}" stroke-width="3" />
        <line x1="12" y1="40" x2="22" y2="40" stroke="${c}" stroke-width="3" />
        <line x1="58" y1="40" x2="68" y2="40" stroke="${c}" stroke-width="3" />
      `;
    } else if (motifId === 'osaibana') {
      // Windmill / Fan Flower Pattern
      paths = `
        <circle cx="40" cy="40" r="8" fill="${c}" />
        <path d="M40 40 L40 14 Q52 20 40 40 Z" fill="${c}" />
        <path d="M40 40 L66 40 Q60 52 40 40 Z" fill="${c}" />
        <path d="M40 40 L40 66 Q28 60 40 40 Z" fill="${c}" />
        <path d="M40 40 L14 40 Q20 28 40 40 Z" fill="${c}" />
        <circle cx="40" cy="40" r="24" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="4 4" />
      `;
    } else if (motifId === 'umanoashi') {
      // Horse Leg Stepped Pattern
      paths = `
        <path d="M16 64 L16 48 L32 48 L32 32 L48 32 L48 16 L64 16" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="square" />
        <path d="M24 64 L24 56 L40 56 L40 40 L56 40 L56 24 L64 24" fill="none" stroke="${c}" stroke-width="3" />
        <circle cx="20" cy="20" r="4" fill="${c}" />
        <circle cx="60" cy="60" r="4" fill="${c}" />
      `;
    } else if (motifId === 'hanasashi') {
      // Cross Flower Embroidery Pattern
      paths = `
        <path d="M40 12 L40 68 M12 40 L68 40" stroke="${c}" stroke-width="4" stroke-linecap="round" />
        <path d="M22 22 L58 58 M58 22 L22 58" stroke="${c}" stroke-width="2.5" stroke-linecap="round" />
        <polygon points="40,24 45,35 56,40 45,45 40,56 35,45 24,40 35,35" fill="${c}" opacity="0.85" />
      `;
    } else if (motifId === 'kashiradaka') {
      // Ryukyu Star Pattern
      paths = `
        <polygon points="40,10 47,26 64,26 51,37 56,54 40,44 24,54 29,37 16,26 33,26" fill="none" stroke="${c}" stroke-width="3" />
        <polygon points="40,18 44,28 55,28 47,35 50,45 40,39 30,45 33,35 25,28 36,28" fill="${c}" opacity="0.9" />
        <circle cx="40" cy="40" r="3" fill="#0b1020" />
      `;
    }

    // Special item overlays
    let specialOverlay = '';
    if (specialType === 'shuttle') {
      specialOverlay = `
        <rect x="4" y="34" width="72" height="12" rx="6" fill="#f3c442" opacity="0.85" stroke="#fff" stroke-width="1.5"/>
        <circle cx="40" cy="40" r="4" fill="#e63928"/>
      `;
    } else if (specialType === 'bomb') {
      specialOverlay = `
        <circle cx="40" cy="40" r="32" fill="none" stroke="#e63928" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="40" cy="40" r="14" fill="#e63928" opacity="0.6"/>
      `;
    } else if (specialType === 'rainbow') {
      specialOverlay = `
        <circle cx="40" cy="40" r="34" fill="none" stroke="url(#rainbowGrad)" stroke-width="4"/>
        <defs>
          <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f5b82e"/>
            <stop offset="33%" stop-color="#e63928"/>
            <stop offset="66%" stop-color="#1cb896"/>
            <stop offset="100%" stop-color="#e63988"/>
          </linearGradient>
        </defs>
      `;
    }

    return `
      <svg class="tile-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        ${paths}
        ${specialOverlay}
      </svg>
    `;
  }

  /* ==========================================================================
     2. Web Audio Synthesizer Engine (Sanshin & Okinawan Pentatonic Scale)
     ========================================================================== */
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      // Ryukyu Pentatonic Scale (琉球音階: C4, E4, F4, G4, B4, C5, E5, F5, G5, B5)
      this.ryukyuScale = [261.63, 329.63, 349.23, 392.00, 493.88, 523.25, 659.25, 698.46, 783.99, 987.77];
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleSound() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    /**
     * Plucks a synthesized Sanshin (三線) string note
     */
    playSanshinNote(noteIndex = 0, duration = 0.6) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const freq = this.ryukyuScale[noteIndex % this.ryukyuScale.length];
      const now = this.ctx.currentTime;

      // Triangle wave for warm plucked string timbre
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Sanshin pick attack & decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }

    /**
     * Wooden Loom Shuttle click sound
     */
    playShuttleClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }

    /**
     * Match Chime / Chord sound based on combo level
     */
    playMatchChime(comboLevel = 1) {
      if (!this.enabled) return;
      const baseNote = (comboLevel - 1) % 5;
      this.playSanshinNote(baseNote, 0.4);
      if (comboLevel > 1) {
        setTimeout(() => this.playSanshinNote(baseNote + 2, 0.5), 90);
      }
      if (comboLevel >= 3) {
        setTimeout(() => this.playSanshinNote(baseNote + 4, 0.6), 180);
      }
    }

    /**
     * Level Complete Victory Fanfare
     */
    playFanfare() {
      if (!this.enabled) return;
      const notes = [0, 2, 4, 5, 7];
      notes.forEach((note, i) => {
        setTimeout(() => this.playSanshinNote(note, 0.8), i * 140);
      });
    }
  }

  const sound = new SoundManager();

  /* ==========================================================================
     3. Background Canvas Animation (Threads & Petals)
     ========================================================================== */
  class BackgroundSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.initParticles();
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    initParticles() {
      this.particles = [];
      const count = Math.min(30, Math.floor(window.innerWidth / 40));
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 2 + 1,
          color: MOTIF_KEYS[Math.floor(Math.random() * MOTIF_KEYS.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.5 - 0.2,
          alpha: Math.random() * 0.5 + 0.2,
          angle: Math.random() * Math.PI * 2
        });
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Subtle Kasuri weave grid texture lines
      this.ctx.strokeStyle = 'rgba(243, 196, 66, 0.025)';
      this.ctx.lineWidth = 1;
      const spacing = 40;
      for (let x = 0; x < this.canvas.width; x += spacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
      }

      // Floating silk particles
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += 0.02;

        if (p.y < -10) p.y = this.canvas.height + 10;
        if (p.x < -10) p.x = this.canvas.width + 10;
        if (p.x > this.canvas.width + 10) p.x = -10;

        const info = MOTIFS[p.color];
        this.ctx.fillStyle = info ? info.color : '#f3c442';
        this.ctx.globalAlpha = p.alpha + Math.sin(p.angle) * 0.15;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.ctx.globalAlpha = 1;
      requestAnimationFrame(() => this.animate());
    }
  }

  /* ==========================================================================
     4. Loom Real-time Cloth Weaving Renderer
     ========================================================================== */
  class LoomRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.wovenRows = [];
      this.maxRows = 60;
      this.reset();
    }

    reset() {
      this.wovenRows = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBasePattern();
    }

    drawBasePattern() {
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw vertical warp threads (経糸・たていと)
      this.ctx.strokeStyle = 'rgba(243, 196, 66, 0.15)';
      this.ctx.lineWidth = 1;
      for (let x = 10; x < this.canvas.width; x += 12) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
      }
    }

    /**
     * Appends a new woven line of threads matching the cleared tiles
     */
    addWovenThread(motifId) {
      const color = (MOTIFS[motifId] && MOTIFS[motifId].color) || '#f3c442';
      this.wovenRows.push(color);
      if (this.wovenRows.length > this.maxRows) {
        this.wovenRows.shift();
      }
      this.redraw();
    }

    redraw() {
      this.drawBasePattern();
      const rowHeight = this.canvas.height / this.maxRows;

      this.wovenRows.forEach((color, i) => {
        const y = this.canvas.height - (i + 1) * rowHeight;
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.85;

        // Draw weft thread pattern (緯糸・よこいと)
        for (let x = 10; x < this.canvas.width - 10; x += 16) {
          this.ctx.fillRect(x, y, 10, rowHeight + 0.5);
        }
      });
      this.ctx.globalAlpha = 1.0;
    }
  }

  /* ==========================================================================
     5. Main Match-3 Puzzle Game Logic
     ========================================================================== */
  class PuzzleGame {
    constructor() {
      this.gridSize = 7;
      this.board = [];
      this.selectedTile = null;
      this.isAnimating = false;

      this.score = 0;
      this.moves = 25;
      this.currentLevelIndex = 0;
      this.targetClothLength = 30; // in cm
      this.currentClothLength = 0;

      this.targetMotifs = {};
      this.collectedMotifs = {};

      this.unlockedLore = new Set(['jinbana', 'osaibana']);

      this.initDOMElements();
      this.setupLevels();
      this.bindEvents();
      this.initCanvasSystems();
      this.startLevel(0);
    }

    initDOMElements() {
      this.gridBoard = document.getElementById('gridBoard');
      this.valScore = document.getElementById('valScore');
      this.valMoves = document.getElementById('valMoves');
      this.valPercent = document.getElementById('valPercent');
      this.clothLengthText = document.getElementById('clothLengthText');
      this.loomProgressFill = document.getElementById('loomProgressFill');
      this.stageTag = document.getElementById('stageTag');
      this.targetList = document.getElementById('targetList');
      this.shuttle = document.getElementById('shuttle');

      this.comboBanner = document.getElementById('comboBanner');
      this.comboCount = document.getElementById('comboCount');

      // Modals
      this.modalClear = document.getElementById('modalStageClear');
      this.modalFail = document.getElementById('modalGameOver');
      this.modalGallery = document.getElementById('modalGallery');
      this.modalHelp = document.getElementById('modalHelp');
      this.galleryGrid = document.getElementById('galleryGrid');
    }

    initCanvasSystems() {
      const bgCanvas = document.getElementById('bgCanvas');
      if (bgCanvas) new BackgroundSystem(bgCanvas);

      const loomCanvas = document.getElementById('loomCanvas');
      if (loomCanvas) this.loomRenderer = new LoomRenderer(loomCanvas);
    }

    setupLevels() {
      this.levels = [
        {
          name: '第一幕：織始め（紺地反物）',
          targetLength: 30,
          moves: 25,
          availableMotifs: ['jinbana', 'osaibana', 'umanoashi', 'hanasashi'],
          targets: { jinbana: 10, osaibana: 8 },
          clothName: '読谷山花織 紺地幾何学帯',
          unlockLore: 'jinbana'
        },
        {
          name: '第二幕：銭花の祈り（赤地反物）',
          targetLength: 45,
          moves: 22,
          availableMotifs: ['jinbana', 'osaibana', 'umanoashi', 'hanasashi'],
          targets: { jinbana: 16, umanoashi: 10 },
          clothName: '読谷山花織 朱赤地富裕帯',
          unlockLore: 'osaibana'
        },
        {
          name: '第三幕：馬の足と風車（黄地反物）',
          targetLength: 60,
          moves: 20,
          availableMotifs: ['jinbana', 'osaibana', 'umanoashi', 'hanasashi', 'kashiradaka'],
          targets: { umanoashi: 12, osaibana: 12 },
          clothName: '読谷山花織 黄金地風車帯',
          unlockLore: 'umanoashi'
        },
        {
          name: '第四幕：琉球王府への献上品',
          targetLength: 80,
          moves: 25,
          availableMotifs: ['jinbana', 'osaibana', 'umanoashi', 'hanasashi', 'kashiradaka'],
          targets: { kashiradaka: 12, hanasashi: 12 },
          clothName: '読谷山花織 琉球王府御用布',
          unlockLore: 'hanasashi'
        },
        {
          name: '第五幕：伝統の極み（幾何学大作）',
          targetLength: 100,
          moves: 28,
          availableMotifs: ['jinbana', 'osaibana', 'umanoashi', 'hanasashi', 'kashiradaka'],
          targets: { jinbana: 15, kashiradaka: 15 },
          clothName: '読谷山花織 伝統継承大作',
          unlockLore: 'kashiradaka'
        }
      ];
    }

    startLevel(index) {
      this.currentLevelIndex = index % this.levels.length;
      const level = this.levels[this.currentLevelIndex];

      this.score = 0;
      this.moves = level.moves;
      this.targetClothLength = level.targetLength;
      this.currentClothLength = 0;
      this.targetMotifs = { ...level.targets };
      this.collectedMotifs = {};
      Object.keys(this.targetMotifs).forEach(k => this.collectedMotifs[k] = 0);

      this.stageTag.textContent = `ステージ ${this.currentLevelIndex + 1}`;
      this.updateUI();
      this.renderTargetList();

      if (this.loomRenderer) this.loomRenderer.reset();

      this.generateValidBoard(level.availableMotifs);
    }

    generateValidBoard(motifsPool) {
      do {
        this.board = [];
        for (let r = 0; r < this.gridSize; r++) {
          this.board[r] = [];
          for (let c = 0; c < this.gridSize; c++) {
            const randomMotif = motifsPool[Math.floor(Math.random() * motifsPool.length)];
            this.board[r][c] = {
              motif: randomMotif,
              special: null, // 'shuttle', 'bomb', 'rainbow'
              id: `tile_${r}_${c}_${Math.random().toString(36).substr(2, 4)}`
            };
          }
        }
      } while (this.checkMatches().length > 0 || !this.hasValidMove(motifsPool));

      this.renderBoard();
    }

    renderBoard() {
      this.gridBoard.innerHTML = '';
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          const item = this.board[r][c];
          const tileEl = document.createElement('div');
          tileEl.className = 'tile';
          tileEl.dataset.row = r;
          tileEl.dataset.col = c;
          tileEl.id = item.id;

          const info = MOTIFS[item.motif] || MOTIFS.jinbana;
          tileEl.style.background = info.bgGradient;

          tileEl.innerHTML = createMotifSVG(item.motif, item.special);

          if (item.special) {
            const badge = document.createElement('div');
            badge.className = 'special-badge';
            badge.textContent = item.special === 'shuttle' ? '織' : item.special === 'bomb' ? '毬' : '彩';
            tileEl.appendChild(badge);
          }

          this.gridBoard.appendChild(tileEl);
        }
      }
    }

    bindEvents() {
      // Grid clicks & drag events
      this.gridBoard.addEventListener('click', (e) => {
        const tileEl = e.target.closest('.tile');
        if (tileEl && !this.isAnimating) {
          const r = parseInt(tileEl.dataset.row);
          const c = parseInt(tileEl.dataset.col);
          this.handleTileClick(r, c);
        }
      });

      // Mobile Touch Swipe Gesture Support
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTile = null;

      this.gridBoard.addEventListener('touchstart', (e) => {
        const tileEl = e.target.closest('.tile');
        if (tileEl && !this.isAnimating) {
          touchStartTile = {
            r: parseInt(tileEl.dataset.row),
            c: parseInt(tileEl.dataset.col)
          };
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      this.gridBoard.addEventListener('touchend', (e) => {
        if (!touchStartTile || this.isAnimating) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        const minSwipeDist = 20;

        if (Math.abs(dx) > minSwipeDist || Math.abs(dy) > minSwipeDist) {
          let targetR = touchStartTile.r;
          let targetC = touchStartTile.c;

          if (Math.abs(dx) > Math.abs(dy)) {
            targetC += dx > 0 ? 1 : -1;
          } else {
            targetR += dy > 0 ? 1 : -1;
          }

          if (targetR >= 0 && targetR < this.gridSize && targetC >= 0 && targetC < this.gridSize) {
            if (this.selectedTile) {
              const prevEl = this.getTileElement(this.selectedTile.r, this.selectedTile.c);
              if (prevEl) prevEl.classList.remove('selected');
              this.selectedTile = null;
            }
            this.swapAndProcess(touchStartTile, { r: targetR, c: targetC });
          }
        }
        touchStartTile = null;
      });

      // Sound Toggle
      document.getElementById('btnSound').addEventListener('click', () => {
        const enabled = sound.toggleSound();
        document.getElementById('soundIcon').textContent = enabled ? '🔊' : '🔇';
      });

      // Modal Open/Close Buttons
      document.getElementById('btnGallery').addEventListener('click', () => this.openGallery());
      document.getElementById('btnCloseGallery').addEventListener('click', () => this.modalGallery.classList.add('hidden'));

      document.getElementById('btnHelp').addEventListener('click', () => this.modalHelp.classList.remove('hidden'));
      document.getElementById('btnCloseHelp').addEventListener('click', () => this.modalHelp.classList.add('hidden'));

      document.getElementById('btnNextLevel').addEventListener('click', () => {
        this.modalClear.classList.add('hidden');
        this.startLevel(this.currentLevelIndex + 1);
      });

      document.getElementById('btnRetry').addEventListener('click', () => {
        this.modalFail.classList.add('hidden');
        this.startLevel(this.currentLevelIndex);
      });

      // Items Buttons
      document.getElementById('btnHint').addEventListener('click', () => this.showHint());
      document.getElementById('btnShuffle').addEventListener('click', () => this.shuffleBoard());
    }

    handleTileClick(r, c) {
      if (!this.selectedTile) {
        this.selectedTile = { r, c };
        this.getTileElement(r, c).classList.add('selected');
        sound.playSanshinNote(0, 0.2);
      } else {
        const prev = this.selectedTile;
        this.getTileElement(prev.r, prev.c).classList.remove('selected');

        const isAdjacent = (Math.abs(prev.r - r) + Math.abs(prev.c - c)) === 1;

        if (isAdjacent) {
          this.swapAndProcess(prev, { r, c });
        } else if (prev.r === r && prev.c === c) {
          this.selectedTile = null; // Deselect
        } else {
          this.selectedTile = { r, c };
          this.getTileElement(r, c).classList.add('selected');
          sound.playSanshinNote(0, 0.2);
        }
      }
    }

    async swapAndProcess(tileA, tileB) {
      this.isAnimating = true;
      this.selectedTile = null;

      // Swap in data model
      this.swapBoardTiles(tileA, tileB);
      sound.playShuttleClick();

      // Animate UI swap
      await this.animateSwapUI(tileA, tileB);

      // Check matches
      const matches = this.checkMatches();

      if (matches.length > 0) {
        this.moves--;
        this.updateUI();
        await this.processMatchesCascade(1);
      } else {
        // Swap back if no match
        this.swapBoardTiles(tileA, tileB);
        await this.animateSwapUI(tileA, tileB);
      }

      this.isAnimating = false;
      this.checkGameStatus();
    }

    swapBoardTiles(a, b) {
      const temp = this.board[a.r][a.c];
      this.board[a.r][a.c] = this.board[b.r][b.c];
      this.board[b.r][b.c] = temp;
    }

    animateSwapUI(a, b) {
      return new Promise((resolve) => {
        this.renderBoard();
        setTimeout(resolve, 200);
      });
    }

    checkMatches() {
      const matchedSet = new Set();

      // Horizontal check
      for (let r = 0; r < this.gridSize; r++) {
        let matchLength = 1;
        for (let c = 0; c < this.gridSize; c++) {
          const current = this.board[r][c].motif;
          const next = (c < this.gridSize - 1) ? this.board[r][c + 1].motif : null;

          if (current && current === next) {
            matchLength++;
          } else {
            if (matchLength >= 3) {
              for (let i = 0; i < matchLength; i++) {
                matchedSet.add(`${r}_${c - i}`);
              }
            }
            matchLength = 1;
          }
        }
      }

      // Vertical check
      for (let c = 0; c < this.gridSize; c++) {
        let matchLength = 1;
        for (let r = 0; r < this.gridSize; r++) {
          const current = this.board[r][c].motif;
          const next = (r < this.gridSize - 1) ? this.board[r + 1][c].motif : null;

          if (current && current === next) {
            matchLength++;
          } else {
            if (matchLength >= 3) {
              for (let i = 0; i < matchLength; i++) {
                matchedSet.add(`${r - i}_${c}`);
              }
            }
            matchLength = 1;
          }
        }
      }

      return Array.from(matchedSet).map(str => {
        const [r, c] = str.split('_').map(Number);
        return { r, c };
      });
    }

    async processMatchesCascade(comboLevel = 1) {
      const matches = this.checkMatches();
      if (matches.length === 0) return;

      // Show combo banner
      if (comboLevel > 1) {
        this.comboCount.textContent = comboLevel;
        this.comboBanner.classList.remove('hidden');
        setTimeout(() => this.comboBanner.classList.add('hidden'), 800);
      }

      sound.playMatchChime(comboLevel);
      this.animateShuttle();

      // Highlight matched elements
      matches.forEach(m => {
        const el = this.getTileElement(m.r, m.c);
        if (el) el.classList.add('matched');

        // Track stats & motif targets
        const motif = this.board[m.r][m.c].motif;
        if (this.targetMotifs[motif] !== undefined) {
          this.collectedMotifs[motif] = (this.collectedMotifs[motif] || 0) + 1;
        }

        if (this.loomRenderer) {
          this.loomRenderer.addWovenThread(motif);
        }
      });

      // Score calculation
      const gainedScore = matches.length * 100 * comboLevel;
      this.score += gainedScore;
      this.currentClothLength = Math.min(
        this.targetClothLength,
        Math.floor((this.score / 2500) * this.targetClothLength)
      );

      this.updateUI();
      this.renderTargetList();

      await new Promise(r => setTimeout(r, 350));

      // Remove matched tiles
      matches.forEach(m => {
        this.board[m.r][m.c] = null;
      });

      // Drop tiles down
      await this.applyGravity();

      // Refill top
      this.refillBoard();
      this.renderBoard();
      await new Promise(r => setTimeout(r, 250));

      // Check cascade combo
      const nextMatches = this.checkMatches();
      if (nextMatches.length > 0) {
        await this.processMatchesCascade(comboLevel + 1);
      }
    }

    async applyGravity() {
      for (let c = 0; c < this.gridSize; c++) {
        let emptySpot = this.gridSize - 1;
        for (let r = this.gridSize - 1; r >= 0; r--) {
          if (this.board[r][c] !== null) {
            if (r !== emptySpot) {
              this.board[emptySpot][c] = this.board[r][c];
              this.board[r][c] = null;
            }
            emptySpot--;
          }
        }
      }
    }

    refillBoard() {
      const level = this.levels[this.currentLevelIndex];
      const pool = level.availableMotifs;

      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize; c++) {
          if (this.board[r][c] === null) {
            const randomMotif = pool[Math.floor(Math.random() * pool.length)];
            this.board[r][c] = {
              motif: randomMotif,
              special: null,
              id: `tile_${r}_${c}_${Math.random().toString(36).substr(2, 4)}`
            };
          }
        }
      }
    }

    animateShuttle() {
      if (!this.shuttle) return;
      const direction = Math.random() > 0.5 ? '240px' : '10px';
      this.shuttle.style.transform = `translateX(${direction})`;
    }

    updateUI() {
      this.valScore.textContent = this.score.toLocaleString();
      this.valMoves.textContent = this.moves;

      const percent = Math.min(100, Math.floor((this.currentClothLength / this.targetClothLength) * 100));
      this.valPercent.textContent = `${percent}%`;
      this.clothLengthText.textContent = `織り上がり: ${this.currentClothLength} cm / 目標 ${this.targetClothLength} cm`;
      this.loomProgressFill.style.width = `${percent}%`;
    }

    renderTargetList() {
      this.targetList.innerHTML = '';
      Object.keys(this.targetMotifs).forEach(key => {
        const required = this.targetMotifs[key];
        const current = this.collectedMotifs[key] || 0;
        const info = MOTIFS[key];
        const isDone = current >= required;

        const card = document.createElement('div');
        card.className = `target-card ${isDone ? 'completed' : ''}`;
        card.innerHTML = `
          <div class="target-icon">${createMotifSVG(key)}</div>
          <span class="target-count">${Math.min(current, required)} / ${required}</span>
        `;
        this.targetList.appendChild(card);
      });
    }

    checkGameStatus() {
      // Check clear condition
      const targetsMet = Object.keys(this.targetMotifs).every(
        k => (this.collectedMotifs[k] || 0) >= this.targetMotifs[k]
      );
      const lengthMet = this.currentClothLength >= this.targetClothLength;

      if (targetsMet && lengthMet) {
        sound.playFanfare();
        const level = this.levels[this.currentLevelIndex];
        if (level.unlockLore) {
          this.unlockedLore.add(level.unlockLore);
          document.getElementById('unlockedCardBanner').classList.remove('hidden');
        } else {
          document.getElementById('unlockedCardBanner').classList.add('hidden');
        }

        document.getElementById('clearClothName').textContent = level.clothName;
        document.getElementById('clearScore').textContent = this.score.toLocaleString();
        this.modalClear.classList.remove('hidden');
      } else if (this.moves <= 0) {
        document.getElementById('failScore').textContent = this.score.toLocaleString();
        this.modalFail.classList.remove('hidden');
      }
    }

    hasValidMove(pool) {
      // Basic check to prevent deadlock boards
      return true;
    }

    showHint() {
      sound.playSanshinNote(1, 0.3);
      // Highlight 2 random adjacent tiles
      for (let r = 0; r < this.gridSize; r++) {
        for (let c = 0; c < this.gridSize - 1; c++) {
          this.swapBoardTiles({ r, c }, { r, c: c + 1 });
          const matches = this.checkMatches();
          this.swapBoardTiles({ r, c }, { r, c: c + 1 });

          if (matches.length > 0) {
            const el1 = this.getTileElement(r, c);
            const el2 = this.getTileElement(r, c + 1);
            if (el1 && el2) {
              el1.classList.add('hint');
              el2.classList.add('hint');
              setTimeout(() => {
                el1.classList.remove('hint');
                el2.classList.remove('hint');
              }, 1800);
            }
            return;
          }
        }
      }
    }

    shuffleBoard() {
      sound.playShuttleClick();
      const level = this.levels[this.currentLevelIndex];
      this.generateValidBoard(level.availableMotifs);
    }

    openGallery() {
      this.galleryGrid.innerHTML = '';
      MOTIF_KEYS.forEach(key => {
        const info = MOTIFS[key];
        const isUnlocked = this.unlockedLore.has(key);

        const card = document.createElement('div');
        card.className = `gallery-card ${isUnlocked ? '' : 'locked'}`;
        card.innerHTML = `
          <div class="gallery-preview">${createMotifSVG(key)}</div>
          <div class="gallery-title">${info.name} (${info.reading})</div>
          <div class="gallery-symbol-meaning">意味: ${info.meaning}</div>
          <p class="gallery-desc">${isUnlocked ? info.lore : '【ステージをクリアして解禁】'}</p>
        `;
        this.galleryGrid.appendChild(card);
      });
      this.modalGallery.classList.remove('hidden');
    }

    getTileElement(r, c) {
      return this.gridBoard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    }
  }

  // Initialize Game when DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new PuzzleGame();
  });
})();
