// マス目（グリッド）パズルエディタのコアロジック

import { soundManager } from './audio.js';
import { TRADITIONAL_COLORS, TRADITIONAL_PATTERNS } from './patterns.js';

export class HanaoriGrid {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = options.gridSize || 12; // 8, 12, 16
    this.currentColor = TRADITIONAL_COLORS[0].hex; // デフォルト：琉球朱
    this.currentPattern = null; // null = 単色塗り、オブジェクト = 紋様スタンプ
    this.symmetricMode = true; // 左右対称モード
    this.baseFabricColor = TRADITIONAL_COLORS[6].hex; // 地の布色

    this.history = [];
    this.historyStep = -1;

    this.isDragging = false;
    this.onChangeCallback = null;

    this.initGrid();
    this.bindEvents();
  }

  initGrid() {
    this.grid = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill(this.baseFabricColor)
    );
    this.saveState();
  }

  setGridSize(size) {
    this.gridSize = size;
    this.initGrid();
    this.render();
  }

  saveState() {
    // 履歴をカットオフして最新状態を追加
    this.history = this.history.slice(0, this.historyStep + 1);
    const gridCopy = JSON.parse(JSON.stringify(this.grid));
    this.history.push(gridCopy);
    this.historyStep++;

    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }

  undo() {
    if (this.historyStep > 0) {
      this.historyStep--;
      this.grid = JSON.parse(JSON.stringify(this.history[this.historyStep]));
      soundManager.playTonSound();
      this.render();
      if (this.onChangeCallback) this.onChangeCallback();
    }
  }

  redo() {
    if (this.historyStep < this.history.length - 1) {
      this.historyStep++;
      this.grid = JSON.parse(JSON.stringify(this.history[this.historyStep]));
      soundManager.playTonSound();
      this.render();
      if (this.onChangeCallback) this.onChangeCallback();
    }
  }

  clearGrid() {
    this.grid = Array(this.gridSize).fill(null).map(() => 
      Array(this.gridSize).fill(this.baseFabricColor)
    );
    this.saveState();
    this.render();
  }

  // セル単色セット
  setCellColor(r, c, color, skipSymmetry = false) {
    if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
      this.grid[r][c] = color;
      
      // 左右対称モード処理
      if (this.symmetricMode && !skipSymmetry) {
        const mirrorC = this.gridSize - 1 - c;
        this.setCellColor(r, mirrorC, color, true);
      }
    }
  }

  // 紋様スタンプ配置
  applyPatternStamp(startR, startC, patternObj) {
    const matrix = patternObj.matrix;
    const pSize = patternObj.size;
    const offset = Math.floor(pSize / 2);

    for (let pr = 0; pr < pSize; pr++) {
      for (let pc = 0; pc < pSize; pc++) {
        if (matrix[pr][pc] === 1) {
          const targetR = startR - offset + pr;
          const targetC = startC - offset + pc;
          this.setCellColor(targetR, targetC, this.currentColor);
        }
      }
    }
  }

  // セルクリック/タッチ時の処理
  handlePointerAction(x, y, isStart = false) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    const cellSize = this.canvas.width / this.gridSize;
    const c = Math.floor(canvasX / cellSize);
    const r = Math.floor(canvasY / cellSize);

    if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize) return;

    if (this.currentPattern && isStart) {
      // 紋様スタンプ配置
      this.applyPatternStamp(r, c, this.currentPattern);
      soundManager.playTonSound();
      this.saveState();
      this.render();
    } else if (!this.currentPattern) {
      // 単色塗り
      if (this.grid[r][c] !== this.currentColor) {
        this.setCellColor(r, c, this.currentColor);
        soundManager.playTonSound();
        if (isStart) {
          this.saveState();
        }
        this.render();
      }
    }
  }

  bindEvents() {
    // マウスイベント
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.handlePointerAction(e.clientX, e.clientY, true);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging && !this.currentPattern) {
        this.handlePointerAction(e.clientX, e.clientY, false);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this.currentPattern) {
          this.saveState();
        }
      }
    });

    // タッチイベント（スマホ最適化）
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        this.isDragging = true;
        const touch = e.touches[0];
        this.handlePointerAction(touch.clientX, touch.clientY, true);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (this.isDragging && e.touches.length > 0 && !this.currentPattern) {
        const touch = e.touches[0];
        this.handlePointerAction(touch.clientX, touch.clientY, false);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this.currentPattern) {
          this.saveState();
        }
      }
    });
  }

  // 描画メイン処理
  render() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cellSize = width / this.gridSize;

    this.ctx.clearRect(0, 0, width, height);

    // 背景（地の布）
    this.ctx.fillStyle = this.baseFabricColor;
    this.ctx.fillRect(0, 0, width, height);

    // 各セルの糸と縦横の格子目描画
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const cellColor = this.grid[r][c];
        const x = c * cellSize;
        const y = r * cellSize;

        // セルの色塗りと織り糸のテクスチャ表現（花織の刺繍のような質感）
        this.ctx.fillStyle = cellColor;
        this.ctx.fillRect(x, y, cellSize, cellSize);

        if (cellColor !== this.baseFabricColor) {
          // 糸の立体的なハイライト＆シャドウ
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          this.ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize / 2 - 1);

          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          this.ctx.fillRect(x + 1, y + cellSize / 2, cellSize - 2, cellSize / 2 - 1);
        }

        // マス目の枠線
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }

    // 左右対称補助線
    if (this.symmetricMode) {
      const midX = width / 2;
      this.ctx.strokeStyle = 'rgba(233, 188, 0, 0.6)'; // 黄色の点線
      this.ctx.setLineDash([4, 4]);
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(midX, 0);
      this.ctx.lineTo(midX, height);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  // 伝統見本テンプレート読み込み
  loadTemplate(templateId) {
    this.clearGrid();
    const size = this.gridSize;
    const mid = Math.floor(size / 2);
    const red = TRADITIONAL_COLORS[0].hex;
    const yellow = TRADITIONAL_COLORS[2].hex;
    const white = TRADITIONAL_COLORS[3].hex;

    if (templateId === 'jinbana_center') {
      // 銭花を中心に配した伝統菱形パターン
      const p = TRADITIONAL_PATTERNS.find(item => item.id === 'jinbana');
      this.currentColor = red;
      this.applyPatternStamp(mid - 1, mid - 1, p);
    } else if (templateId === 'kajimaa_four') {
      // 四隅に風車を配した華やかな祝いデザイン
      const p = TRADITIONAL_PATTERNS.find(item => item.id === 'kajimaa');
      this.currentColor = yellow;
      this.applyPatternStamp(3, 3, p);
      this.currentColor = red;
      this.applyPatternStamp(size - 4, 3, p);
    } else if (templateId === 'diamond_all') {
      // 読谷山花織伝統の連続花菱
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if ((r + c) % 4 === 0) {
            this.grid[r][c] = (r % 2 === 0) ? red : yellow;
          } else if ((r - c) % 4 === 0) {
            this.grid[r][c] = white;
          }
        }
      }
    }
    this.saveState();
    this.render();
  }
}
