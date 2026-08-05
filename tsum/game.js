/**
 * 読谷山花織ツムツム (Yomitan Hanaori Tsum Tsum Mobile Puzzle)
 * Core Game Engine: Custom 2D Physics, Real Textile Image Rendering, Touch Thread Dragging, Synthesizer Audio & Web Canvas Renderer
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Motif Definitions & Image Preloader
     ========================================================================== */
  const MOTIFS = {
    jinbana: {
      id: 'jinbana',
      name: '銭花',
      reading: 'ジンバナ',
      meaning: '金運・商売繁盛・富',
      color: '#f5b82e',
      darkColor: '#b37e09',
      bgColor: '#3d2d0c',
      imgSrc: 'images/jinbana.png',
      img: null,
      lore: '貨幣（コイン）を模した幾何学菱形文様。子孫繁栄と商売繁盛、富をもたらす縁起物です。'
    },
    osaibana: {
      id: 'osaibana',
      name: '風車花',
      reading: 'オサイバナ',
      meaning: '平和・家庭円満・長寿',
      color: '#e63928',
      darkColor: '#961d12',
      bgColor: '#3d0c0c',
      imgSrc: 'images/osaibana.png',
      img: null,
      lore: '風車の形をした風雅な花文様。家庭が絶え間なく円満で平和であり続けることを祈願しています。'
    },
    umanoashi: {
      id: 'umanoashi',
      name: '馬の足',
      reading: 'ウマノアシ',
      meaning: '旅の安全・交通安全・前進',
      color: '#1cb896',
      darkColor: '#0e6955',
      bgColor: '#0c3d32',
      imgSrc: 'images/umanoashi.png',
      img: null,
      lore: '馬の足跡を模した連鎖ステップ文様。道中の無事安全と、一歩一歩の着実な前進を祈願します。'
    },
    hanasashi: {
      id: 'hanasashi',
      name: '花刺し',
      reading: 'ハナサシ',
      meaning: '華やかさ・魔除け・愛情',
      color: '#e63988',
      darkColor: '#961c54',
      bgColor: '#3d0c2c',
      imgSrc: 'images/hanasashi.png',
      img: null,
      lore: '十字の刺し子風幾何学花文様。悪霊を祓う魔除けと愛情が込められています。'
    },
    kashiradaka: {
      id: 'kashiradaka',
      name: '琉球星',
      reading: 'カシラダカ',
      meaning: '高貴・成就・星の導き',
      color: '#eef2f7',
      darkColor: '#94a3b8',
      bgColor: '#2d3440',
      imgSrc: 'images/kashiradaka.png',
      img: null,
      lore: '夜空に輝く一番星をかたどった八角花文様。琉球王府の貴族が愛用した最高格式の紋様です。'
    }
  };

  const MOTIF_KEYS = Object.keys(MOTIFS);

  // Preload authentic Yomitan Hanaori textile images
  MOTIF_KEYS.forEach(key => {
    const m = MOTIFS[key];
    const image = new Image();
    image.src = m.imgSrc;
    m.img = image;
  });

  /* ==========================================================================
     2. Web Audio Synthesizer (Zero Audio File Dependency)
     ========================================================================== */
  class SoundSynth {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(index) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Pentatonic / Major Scale Pitch: C4 = 261.63Hz
        const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
        const semitones = scale[Math.min(index, scale.length - 1)];
        const freq = 261.63 * Math.pow(2, semitones / 12);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      } catch (e) {}
    }

    playPop(isBig = false) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const baseFreq = isBig ? 180 : 350;
        const endFreq = isBig ? 60 : 120;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    playBomb() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
      } catch (e) {}
    }

    playFeverSound() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);

          gain.gain.setValueAtTime(0.3, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
      } catch (e) {}
    }

    playSkillSound() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.4);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      } catch (e) {}
    }
  }

  const audio = new SoundSynth();

  /* ==========================================================================
     3. Tsum Physics Engine & Game Mechanics
     ========================================================================== */
  class GameEngine {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.bgCanvas = document.getElementById('bgCanvas');
      this.bgCtx = this.bgCanvas.getContext('2d');

      // State
      this.state = 'START'; // START, PLAYING, PAUSED, OVER
      this.tsums = [];
      this.particles = [];
      this.floatingTexts = [];
      this.chain = [];
      this.score = 0;
      this.timeLeft = 60;
      this.feverGauge = 0;
      this.isFever = false;
      this.feverTimer = 0;
      this.feverCount = 0;
      this.skillGauge = 0;
      this.maxSkill = 100;
      this.combo = 0;
      this.maxChain = 0;
      this.totalCleared = 0;
      this.highScore = parseInt(localStorage.getItem('hanaori_high_score') || '0', 10);

      // Gyro Tilt Gravity
      this.gravityX = 0;
      this.gravityY = 0.4;

      // Container Dimensions
      this.width = 360;
      this.height = 500;
      this.baseRadius = 26; // Normal Tsum radius

      // Touch / Mouse Tracking
      this.isPointerDown = false;
      this.pointerPos = { x: 0, y: 0 };

      // High Performance Loop
      this.lastTime = performance.now();
      this.spawnTimer = 0;
      this.timerInterval = null;

      this.initCanvas();
      this.bindEvents();
      this.renderMotifPreviews();
      this.updateHUD();
    }

    initCanvas() {
      const resize = () => {
        const wrapper = this.canvas.parentElement;
        this.width = wrapper.clientWidth || 360;
        this.height = wrapper.clientHeight || 500;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.bgCanvas.width = window.innerWidth;
        this.bgCanvas.height = window.innerHeight;
        this.drawAmbientBg();
      };

      window.addEventListener('resize', resize);
      resize();
    }

    drawAmbientBg() {
      const w = this.bgCanvas.width;
      const h = this.bgCanvas.height;
      const ctx = this.bgCtx;

      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, '#162842');
      grad.addColorStop(1, '#0d1726');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Soft woven background grid pattern
      ctx.strokeStyle = 'rgba(245, 184, 46, 0.04)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    bindEvents() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      const onStart = (e) => {
        if (this.state !== 'PLAYING') return;
        audio.init();
        this.isPointerDown = true;
        this.pointerPos = getPos(e);
        this.tryAddToChain(this.pointerPos);
      };

      const onMove = (e) => {
        if (!this.isPointerDown || this.state !== 'PLAYING') return;
        this.pointerPos = getPos(e);
        this.tryAddToChain(this.pointerPos);
      };

      const onEnd = () => {
        if (!this.isPointerDown) return;
        this.isPointerDown = false;
        this.finishChain();
      };

      this.canvas.addEventListener('touchstart', onStart, { passive: false });
      this.canvas.addEventListener('touchmove', onMove, { passive: false });
      this.canvas.addEventListener('touchend', onEnd);
      this.canvas.addEventListener('touchcancel', onEnd);

      this.canvas.addEventListener('mousedown', onStart);
      this.canvas.addEventListener('mousemove', onMove);
      this.canvas.addEventListener('mouseup', onEnd);
      this.canvas.addEventListener('mouseleave', onEnd);

      // Gyro tilt for physical sliding
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
          if (e.gamma !== null) {
            this.gravityX = Math.max(-0.4, Math.min(0.4, (e.gamma / 30) * 0.4));
          }
        });
      }

      // Buttons
      document.getElementById('btnStart').addEventListener('click', () => this.startGame());
      document.getElementById('btnRetry').addEventListener('click', () => this.startGame());
      document.getElementById('btnPause').addEventListener('click', () => this.pauseGame());
      document.getElementById('btnResume').addEventListener('click', () => this.resumeGame());
      document.getElementById('btnRestartFromPause').addEventListener('click', () => this.startGame());

      document.getElementById('btnSound').addEventListener('click', () => {
        audio.enabled = !audio.enabled;
        document.getElementById('soundIcon').textContent = audio.enabled ? '🔊' : '🔇';
      });

      document.getElementById('btnSkill').addEventListener('click', () => this.triggerSkill());

      // Modals Setup
      const setupModal = (btnId, modalId, closeId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const open = () => {
          modal.classList.remove('hidden');
          modal.classList.add('active');
        };
        const close = () => {
          modal.classList.remove('active');
          modal.classList.add('hidden');
        };

        const b = document.getElementById(btnId);
        if (b) b.addEventListener('click', open);
        const c = document.getElementById(closeId);
        if (c) c.addEventListener('click', close);

        // Click backdrop to close
        modal.addEventListener('click', (e) => {
          if (e.target === modal) close();
        });
      };

      setupModal('btnGallery', 'galleryModal', 'btnCloseGallery');
      setupModal('btnOpenGalleryStart', 'galleryModal', 'btnCloseGallery');
      setupModal('btnHelp', 'helpModal', 'btnCloseHelp');
      setupModal('btnOpenHelpStart', 'helpModal', 'btnCloseHelp');

      this.populateGallery();
      this.renderSkillIcon();
    }

    renderMotifPreviews() {
      const container = document.getElementById('motifsPreviewRow');
      if (!container) return;
      container.innerHTML = '';
      MOTIF_KEYS.forEach(key => {
        const m = MOTIFS[key];
        const item = document.createElement('div');
        item.className = 'motif-circle-item';
        item.style.backgroundImage = `url(${m.imgSrc})`;
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center';
        container.appendChild(item);
      });
    }

    populateGallery() {
      const list = document.getElementById('galleryList');
      if (!list) return;
      list.innerHTML = '';
      MOTIF_KEYS.forEach(key => {
        const m = MOTIFS[key];
        const card = document.createElement('div');
        card.className = 'gallery-item-card';
        card.innerHTML = `
          <div class="gallery-item-svg" style="background-image: url(${m.imgSrc}); background-size: cover; background-position: center;">
          </div>
          <div class="gallery-item-info">
            <div class="gallery-item-name">${m.name} (${m.reading})</div>
            <div class="gallery-item-meaning">✨ 願意: ${m.meaning}</div>
            <div class="gallery-item-desc">${m.lore}</div>
          </div>
        `;
        list.appendChild(card);
      });
    }

    renderSkillIcon() {
      const avatar = document.querySelector('.skill-avatar');
      if (avatar) {
        avatar.style.backgroundImage = `url(images/kashiradaka.png)`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
      }
    }

    startGame() {
      audio.init();
      this.state = 'PLAYING';
      this.tsums = [];
      this.particles = [];
      this.floatingTexts = [];
      this.chain = [];
      this.score = 0;
      this.timeLeft = 60;
      this.feverGauge = 0;
      this.isFever = false;
      this.feverTimer = 0;
      this.feverCount = 0;
      this.skillGauge = 0;
      this.combo = 0;
      this.maxChain = 0;
      this.totalCleared = 0;

      const startModal = document.getElementById('startOverlay');
      startModal.classList.remove('active');
      startModal.classList.add('hidden');

      const resModal = document.getElementById('resultOverlay');
      resModal.classList.remove('active');
      resModal.classList.add('hidden');

      const pauseModal = document.getElementById('pauseOverlay');
      pauseModal.classList.remove('active');
      pauseModal.classList.add('hidden');

      // Initial fill of Tsums
      for (let i = 0; i < 40; i++) {
        this.spawnTsum(true);
      }

      if (this.timerInterval) clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => this.tickTimer(), 1000);

      this.updateHUD();
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    pauseGame() {
      if (this.state !== 'PLAYING') return;
      this.state = 'PAUSED';
      const p = document.getElementById('pauseOverlay');
      p.classList.remove('hidden');
      p.classList.add('active');
    }

    resumeGame() {
      if (this.state !== 'PAUSED') return;
      this.state = 'PLAYING';
      const p = document.getElementById('pauseOverlay');
      p.classList.remove('active');
      p.classList.add('hidden');
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    tickTimer() {
      if (this.state !== 'PLAYING') return;
      this.timeLeft--;
      document.getElementById('valTime').textContent = this.timeLeft;

      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }

    endGame() {
      this.state = 'OVER';
      if (this.timerInterval) clearInterval(this.timerInterval);

      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('hanaori_high_score', this.highScore.toString());
      }

      document.getElementById('resScore').textContent = this.score.toLocaleString();
      document.getElementById('resMaxChain').textContent = this.maxChain;
      document.getElementById('resClearedCount').textContent = this.totalCleared;
      document.getElementById('resFeverCount').textContent = this.feverCount;

      let stars = '⭐';
      if (this.score >= 50000) stars = '⭐⭐';
      if (this.score >= 120000) stars = '⭐⭐⭐';
      document.getElementById('resultStars').textContent = stars;

      this.drawResultCloth();
      const res = document.getElementById('resultOverlay');
      res.classList.remove('hidden');
      res.classList.add('active');
    }

    drawResultCloth() {
      const canvas = document.getElementById('resultClothCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0d1726';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const keys = MOTIF_KEYS;
      for (let x = 10; x < canvas.width; x += 50) {
        const k = keys[Math.floor((x / 50) % keys.length)];
        const m = MOTIFS[k];
        if (m && m.img && m.img.complete) {
          ctx.drawImage(m.img, x, 10, 40, 70);
        }
      }
    }

    spawnTsum(initial = false) {
      const radius = this.baseRadius;
      const key = MOTIF_KEYS[Math.floor(Math.random() * MOTIF_KEYS.length)];

      const x = Math.random() * (this.width - radius * 2) + radius;
      const y = initial
        ? Math.random() * (this.height * 0.6) + radius
        : -radius * 2 - Math.random() * 50;

      this.tsums.push({
        id: Math.random().toString(36).substring(2, 9),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: initial ? 0 : Math.random() * 2,
        radius: radius,
        motifKey: key,
        special: null,
        rotation: Math.random() * Math.PI * 2,
        rvel: (Math.random() - 0.5) * 0.03
      });
    }

    updatePhysics() {
      const gravityX = this.gravityX;
      const gravityY = this.gravityY;
      const floorY = this.height - 20;

      if (this.tsums.length < 42 && Math.random() < 0.2) {
        this.spawnTsum();
      }

      for (let i = 0; i < this.tsums.length; i++) {
        const t = this.tsums[i];

        t.vx += gravityX;
        t.vy += gravityY;

        t.vx *= 0.98;
        t.vy *= 0.98;

        t.x += t.vx;
        t.y += t.vy;
        t.rotation += t.rvel;

        const leftWall = t.radius + 8;
        const rightWall = this.width - t.radius - 8;

        if (t.x < leftWall) {
          t.x = leftWall;
          t.vx *= -0.3;
        } else if (t.x > rightWall) {
          t.x = rightWall;
          t.vx *= -0.3;
        }

        if (t.y > floorY - t.radius) {
          t.y = floorY - t.radius;
          t.vy *= -0.2;
          t.vx *= 0.85;
        }
      }

      for (let iter = 0; iter < 3; iter++) {
        for (let i = 0; i < this.tsums.length; i++) {
          for (let j = i + 1; j < this.tsums.length; j++) {
            const a = this.tsums[i];
            const b = this.tsums[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const distSq = dx * dx + dy * dy;
            const minDist = a.radius + b.radius;

            if (distSq < minDist * minDist && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const overlap = minDist - dist;

              const nx = dx / dist;
              const ny = dy / dist;

              const separation = overlap * 0.5;
              a.x -= nx * separation;
              a.y -= ny * separation;
              b.x += nx * separation;
              b.y += ny * separation;

              const rvx = b.vx - a.vx;
              const rvy = b.vy - a.vy;

              const velAlongNormal = rvx * nx + rvy * ny;

              if (velAlongNormal < 0) {
                const impulse = -1.2 * velAlongNormal * 0.5;
                a.vx -= nx * impulse;
                a.vy -= ny * impulse;
                b.vx += nx * impulse;
                b.vy += ny * impulse;
              }
            }
          }
        }
      }
    }

    tryAddToChain(pos) {
      let candidate = null;
      let minDist = 999;

      for (let i = 0; i < this.tsums.length; i++) {
        const t = this.tsums[i];
        const dx = t.x - pos.x;
        const dy = t.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < t.radius * 1.5 && dist < minDist) {
          minDist = dist;
          candidate = t;
        }
      }

      if (!candidate) return;

      if (this.chain.length === 0) {
        this.chain.push(candidate);
        audio.playTone(0);
        this.createSparks(candidate.x, candidate.y, candidate.motifKey, 5);
        return;
      }

      const last = this.chain[this.chain.length - 1];
      if (candidate.id === last.id) return;

      if (this.chain.length > 1 && candidate.id === this.chain[this.chain.length - 2].id) {
        this.chain.pop();
        audio.playTone(this.chain.length - 1);
        return;
      }

      if (!this.chain.some(item => item.id === candidate.id)) {
        if (candidate.motifKey === last.motifKey || candidate.special === 'bomb') {
          const dx = candidate.x - last.x;
          const dy = candidate.y - last.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < (last.radius + candidate.radius) * 2.3) {
            this.chain.push(candidate);
            audio.playTone(this.chain.length - 1);
            this.createSparks(candidate.x, candidate.y, candidate.motifKey, 6);

            if (navigator.vibrate) navigator.vibrate(12);
          }
        }
      }
    }

    finishChain() {
      if (this.chain.length >= 3) {
        const count = this.chain.length;
        const lastTsum = this.chain[this.chain.length - 1];
        const motifKey = lastTsum.motifKey;

        this.totalCleared += count;
        if (count > this.maxChain) this.maxChain = count;

        const feverMult = this.isFever ? 3 : 1;
        const earnedScore = count * 120 * (1 + (count - 3) * 0.3) * feverMult;
        this.score += Math.floor(earnedScore);

        this.addFloatingText(`+${Math.floor(earnedScore)}`, lastTsum.x, lastTsum.y, '#f5b82e');

        this.combo++;
        this.showCombo(this.combo);

        this.chargeFever(count * 4.5);
        this.chargeSkill(count * 5);

        this.chain.forEach(t => {
          this.createSparks(t.x, t.y, t.motifKey, t.special === 'big' ? 24 : 12);
          audio.playPop(t.special === 'big');

          if (t.special === 'bomb') {
            this.explodeBomb(t);
          }

          const idx = this.tsums.findIndex(item => item.id === t.id);
          if (idx !== -1) this.tsums.splice(idx, 1);
        });

        if (count >= 7) {
          this.spawnBombTsum(lastTsum.x, lastTsum.y);
        } else if (count >= 10) {
          this.spawnBigTsum(lastTsum.x, lastTsum.y, motifKey);
        }
      } else {
        this.combo = 0;
        this.hideCombo();
      }

      this.chain = [];
      this.updateHUD();
    }

    explodeBomb(bombTsum) {
      audio.playBomb();
      this.createSparks(bombTsum.x, bombTsum.y, 'jinbana', 30);

      const radius = 90;
      const toRemove = [];

      for (let i = 0; i < this.tsums.length; i++) {
        const t = this.tsums[i];
        const dx = t.x - bombTsum.x;
        const dy = t.y - bombTsum.y;
        if (Math.sqrt(dx * dx + dy * dy) < radius) {
          toRemove.push(t.id);
          this.createSparks(t.x, t.y, t.motifKey, 8);
        }
      }

      toRemove.forEach(id => {
        const idx = this.tsums.findIndex(item => item.id === id);
        if (idx !== -1) this.tsums.splice(idx, 1);
      });

      this.score += 1500;
      this.addFloatingText('+1500 BOMB!', bombTsum.x, bombTsum.y, '#e63928');
    }

    spawnBombTsum(x, y) {
      this.tsums.push({
        id: Math.random().toString(36).substring(2, 9),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -2,
        radius: this.baseRadius * 1.1,
        motifKey: 'jinbana',
        special: 'bomb',
        rotation: 0,
        rvel: 0.1
      });
      this.addFloatingText('💣 BOMB!', x, y - 20, '#f5b82e');
    }

    spawnBigTsum(x, y, motifKey) {
      this.tsums.push({
        id: Math.random().toString(36).substring(2, 9),
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -2,
        radius: this.baseRadius * 1.5,
        motifKey: motifKey,
        special: 'big',
        rotation: 0,
        rvel: 0.02
      });
      this.addFloatingText('✨ BIG!', x, y - 20, '#e63988');
    }

    chargeFever(amount) {
      if (this.isFever) return;
      this.feverGauge = Math.min(100, this.feverGauge + amount);

      if (this.feverGauge >= 100) {
        this.triggerFever();
      }
    }

    triggerFever() {
      this.isFever = true;
      this.feverGauge = 100;
      this.feverTimer = 10;
      this.feverCount++;
      this.timeLeft += 5;

      audio.playFeverSound();

      const banner = document.getElementById('feverBanner');
      banner.classList.remove('hidden');

      const feverInterval = setInterval(() => {
        this.feverTimer--;
        this.feverGauge = (this.feverTimer / 10) * 100;

        if (this.feverTimer <= 0) {
          clearInterval(feverInterval);
          this.isFever = false;
          this.feverGauge = 0;
          banner.classList.add('hidden');
        }
        this.updateHUD();
      }, 1000);
    }

    chargeSkill(amount) {
      this.skillGauge = Math.min(this.maxSkill, this.skillGauge + amount);
      const btn = document.getElementById('btnSkill');
      const fill = document.getElementById('skillFill');

      if (fill) fill.style.width = `${(this.skillGauge / this.maxSkill) * 100}%`;
      if (btn) btn.disabled = this.skillGauge < this.maxSkill;
    }

    triggerSkill() {
      if (this.skillGauge < this.maxSkill || this.state !== 'PLAYING') return;

      audio.playSkillSound();
      this.skillGauge = 0;
      this.chargeSkill(0);

      const centerX = this.width / 2;
      const centerY = this.height / 2;

      let cleared = 0;
      for (let i = this.tsums.length - 1; i >= 0; i--) {
        const t = this.tsums[i];
        const dx = t.x - centerX;
        const dy = t.y - centerY;
        if (Math.sqrt(dx * dx + dy * dy) < 140) {
          this.createSparks(t.x, t.y, t.motifKey, 15);
          this.tsums.splice(i, 1);
          cleared++;
        }
      }

      this.score += cleared * 300;
      this.addFloatingText(`✨ 琉球星一発全消去! +${cleared * 300}`, centerX, centerY, '#f5b82e');

      this.spawnBombTsum(centerX - 40, centerY);
      this.spawnBombTsum(centerX + 40, centerY);
      this.chargeFever(40);
    }

    showCombo(count) {
      const banner = document.getElementById('comboBanner');
      const num = document.getElementById('comboCount');
      if (banner && num) {
        num.textContent = count;
        banner.classList.remove('hidden');
      }
    }

    hideCombo() {
      const banner = document.getElementById('comboBanner');
      if (banner) banner.classList.add('hidden');
    }

    createSparks(x, y, motifKey, count = 10) {
      const color = MOTIFS[motifKey] ? MOTIFS[motifKey].color : '#f5b82e';
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 6 + 3,
          color: color,
          alpha: 1,
          life: 1
        });
      }
    }

    addFloatingText(text, x, y, color = '#ffffff') {
      this.floatingTexts.push({
        text: text,
        x: x,
        y: y,
        vy: -1.5,
        alpha: 1,
        color: color
      });
    }

    updateHUD() {
      document.getElementById('valScore').textContent = this.score.toLocaleString();
      document.getElementById('valHighScore').textContent = this.highScore.toLocaleString();
      document.getElementById('feverFill').style.width = `${this.feverGauge}%`;
    }

    loop(timestamp) {
      if (this.state !== 'PLAYING') return;

      this.updatePhysics();
      this.render();

      requestAnimationFrame((t) => this.loop(t));
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      this.drawBowlContainer(ctx);

      for (let i = 0; i < this.tsums.length; i++) {
        this.drawTsum(ctx, this.tsums[i]);
      }

      this.drawChainThread(ctx);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        p.size *= 0.95;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;

        if (ft.alpha <= 0) {
          this.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = 'bold 1.1rem "Outfit", sans-serif';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }
    }

    drawBowlContainer(ctx) {
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 184, 46, 0.2)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, 40);
      ctx.lineTo(10, this.height - 40);
      ctx.quadraticCurveTo(this.width / 2, this.height + 10, this.width - 10, this.height - 40);
      ctx.lineTo(this.width - 10, 40);
      ctx.stroke();
      ctx.restore();
    }

    drawTsum(ctx, t) {
      const m = MOTIFS[t.motifKey] || MOTIFS.jinbana;
      const isSelected = this.chain.some(item => item.id === t.id);

      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rotation);

      if (t.special === 'bomb') {
        // Bomb Tsum
        const grad = ctx.createRadialGradient(-t.radius * 0.3, -t.radius * 0.3, 2, 0, 0, t.radius);
        grad.addColorStop(0, '#f5b82e');
        grad.addColorStop(1, '#e63928');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💣', 0, 0);
      } else if (m.img && m.img.complete && m.img.naturalWidth !== 0) {
        // Real Yomitan Hanaori Textile Texture Image Rendering
        ctx.beginPath();
        ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
        ctx.clip();

        // Draw textile pattern image centered inside circle
        ctx.drawImage(m.img, -t.radius, -t.radius, t.radius * 2, t.radius * 2);

        // 3D Cushion / Glass Bead Spherical Shading Overlay
        const overlayGrad = ctx.createRadialGradient(-t.radius * 0.35, -t.radius * 0.35, 2, 0, 0, t.radius);
        overlayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        overlayGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        overlayGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.2)');
        overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');

        ctx.fillStyle = overlayGrad;
        ctx.beginPath();
        ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Fallback Vector Rendering
        const grad = ctx.createRadialGradient(-t.radius * 0.3, -t.radius * 0.3, 2, 0, 0, t.radius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, m.color);
        grad.addColorStop(1, m.darkColor);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
        ctx.fill();

        this.drawMotifCanvasPath(ctx, t.motifKey, t.radius * 0.65);
      }

      // Outer Gold / White Border Ring
      ctx.beginPath();
      ctx.arc(0, 0, t.radius, 0, Math.PI * 2);

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4.5;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 14;
        ctx.stroke();
      } else {
        ctx.strokeStyle = m.color || 'rgba(245,184,46,0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
    }

    drawMotifCanvasPath(ctx, motifKey, size) {
      const half = size / 2;
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 2;

      if (motifKey === 'jinbana') {
        ctx.beginPath();
        ctx.moveTo(0, -half);
        ctx.lineTo(half, 0);
        ctx.lineTo(0, half);
        ctx.lineTo(-half, 0);
        ctx.closePath();
        ctx.stroke();
      } else if (motifKey === 'osaibana') {
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (motifKey === 'umanoashi') {
        ctx.beginPath();
        ctx.moveTo(-half, half);
        ctx.lineTo(-half, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, -half);
        ctx.lineTo(half, -half);
        ctx.stroke();
      } else if (motifKey === 'hanasashi') {
        ctx.beginPath();
        ctx.moveTo(-half, 0);
        ctx.lineTo(half, 0);
        ctx.moveTo(0, -half);
        ctx.lineTo(0, half);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, half * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawChainThread(ctx) {
      if (this.chain.length < 2) return;

      ctx.save();
      ctx.strokeStyle = '#f5b82e';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(245, 184, 46, 0.9)';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      for (let i = 0; i < this.chain.length; i++) {
        const t = this.chain[i];
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      }

      if (this.isPointerDown) {
        ctx.lineTo(this.pointerPos.x, this.pointerPos.y);
      }

      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 0;
      ctx.stroke();

      ctx.restore();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    new GameEngine();
  });
})();
