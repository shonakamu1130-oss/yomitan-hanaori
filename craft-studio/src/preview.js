// デザインされた花織データを元に、コースターやストラップ等のリアルな商品プレビューをCanvas描画するモジュール

export class ProductPreview {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
  }

  // 織物テクスチャパターン（糸の浮き彫りや布の凹凸）の背景ノイズ生成
  renderFabricTexture(ctx, width, height) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let x = 0; x < width; x += 4) {
      ctx.fillRect(x, 0, 1, height);
    }
    ctx.restore();
  }

  render(productId, gridInstance) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    // 背景（優しく上品な和紙/木目調グラデーション）
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
    bgGrad.addColorStop(0, '#2C2B30');
    bgGrad.addColorStop(1, '#18171B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    switch (productId) {
      case 'coaster':
        this.renderCoaster(ctx, width, height, gridInstance);
        break;
      case 'strap':
        this.renderStrap(ctx, width, height, gridInstance);
        break;
      case 'bookmark':
        this.renderBookmark(ctx, width, height, gridInstance);
        break;
      case 'wallpaper':
        this.renderWallpaper(ctx, width, height, gridInstance);
        break;
      case 'mat':
        this.renderMat(ctx, width, height, gridInstance);
        break;
      default:
        this.renderCoaster(ctx, width, height, gridInstance);
    }
  }

  // 1. コースタープレビュー（正方形＋四方の糸フリンジ）
  renderCoaster(ctx, w, h, grid) {
    const coasterSize = Math.min(w, h) * 0.65;
    const cx = (w - coasterSize) / 2;
    const cy = (h - coasterSize) / 2;

    // 影
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;

    // フリンジ（下部と左右の房糸）
    ctx.fillStyle = '#E9BC00'; // 金茶色の飾り房糸
    const fringeLen = 18;

    // 左右フリンジ
    for (let y = cy; y <= cy + coasterSize; y += 4) {
      ctx.fillRect(cx - fringeLen, y, fringeLen, 2);
      ctx.fillRect(cx + coasterSize, y, fringeLen, 2);
    }
    // 上下フリンジ
    for (let x = cx; x <= cx + coasterSize; x += 4) {
      ctx.fillRect(x, cy - fringeLen, 2, fringeLen);
      ctx.fillRect(x, cy + coasterSize, 2, fringeLen);
    }

    // 本体キャンバス描画
    this.drawPatternOnCanvas(ctx, grid, cx, cy, coasterSize, coasterSize);

    ctx.restore();
    this.renderFabricTexture(ctx, w, h);
  }

  // 2. 携帯ストラッププレビュー（縦長帯＋上部金属リング＆根付紐）
  renderStrap(ctx, w, h, grid) {
    const strapW = w * 0.28;
    const strapH = h * 0.65;
    const cx = (w - strapW) / 2;
    const cy = (h - strapH) / 2 + 25;

    ctx.save();
    // 影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 8;

    // 上部の根付ストラップ紐（赤/黒の和紐）
    ctx.strokeStyle = '#D70035';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w / 2, cy - 45);
    ctx.quadraticCurveTo(w / 2 - 20, cy - 25, w / 2, cy - 10);
    ctx.stroke();

    // 金具（真鍮リング）
    ctx.fillStyle = '#E9BC00';
    ctx.beginPath();
    ctx.arc(w / 2, cy - 8, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#18171B';
    ctx.beginPath();
    ctx.arc(w / 2, cy - 8, 5, 0, Math.PI * 2);
    ctx.fill();

    // 織物帯本体
    this.drawPatternOnCanvas(ctx, grid, cx, cy, strapW, strapH);

    // 下部のフリンジ
    ctx.fillStyle = '#D70035';
    for (let x = cx + 2; x < cx + strapW; x += 3) {
      ctx.fillRect(x, cy + strapH, 2, 22);
    }

    ctx.restore();
    this.renderFabricTexture(ctx, w, h);
  }

  // 3. 織物しおりプレビュー
  renderBookmark(ctx, w, h, grid) {
    const bkW = w * 0.32;
    const bkH = h * 0.72;
    const cx = (w - bkW) / 2;
    const cy = (h - bkH) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 10;

    // しおり本体
    this.drawPatternOnCanvas(ctx, grid, cx, cy, bkW, bkH);

    // 上部ハトメ（ハトメ穴＋シルクリボン）
    ctx.fillStyle = '#D70035';
    ctx.beginPath();
    ctx.moveTo(w / 2, cy + 12);
    ctx.lineTo(w / 2 - 15, cy - 35);
    ctx.lineTo(w / 2 + 5, cy - 35);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#E9BC00';
    ctx.beginPath();
    ctx.arc(w / 2, cy + 12, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#18171B';
    ctx.beginPath();
    ctx.arc(w / 2, cy + 12, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    this.renderFabricTexture(ctx, w, h);
  }

  // 4. スマホ壁紙プレビュー
  renderWallpaper(ctx, w, h, grid) {
    const phoneW = w * 0.48;
    const phoneH = h * 0.82;
    const cx = (w - phoneW) / 2;
    const cy = (h - phoneH) / 2;

    ctx.save();
    // スマホ外枠
    ctx.fillStyle = '#0F0F12';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 12;
    this.roundRect(ctx, cx, cy, phoneW, phoneH, 24, true, false);

    // 画面内描画（パターンを縦横リピート表示してモダン壁紙風に）
    ctx.save();
    this.roundRect(ctx, cx + 5, cy + 5, phoneW - 10, phoneH - 10, 20, false, false);
    ctx.clip();

    // 縦リピート描画
    const itemH = (phoneW - 10);
    for (let y = cy + 5; y < cy + phoneH; y += itemH) {
      this.drawPatternOnCanvas(ctx, grid, cx + 5, y, phoneW - 10, itemH);
    }

    // 壁紙の時計UI（スマホらしさ演出）
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('12:34', w / 2, cy + 55);
    ctx.font = '12px sans-serif';
    ctx.fillText('9月1日 火曜日', w / 2, cy + 75);

    ctx.restore();
    ctx.restore();
  }

  // 5. ランチョンマットプレビュー
  renderMat(ctx, w, h, grid) {
    const matW = w * 0.78;
    const matH = h * 0.58;
    const cx = (w - matW) / 2;
    const cy = (h - matH) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;

    this.drawPatternOnCanvas(ctx, grid, cx, cy, matW, matH);

    // 両端フリンジ
    ctx.fillStyle = '#F5F5F0';
    for (let y = cy + 2; y < cy + matH; y += 3) {
      ctx.fillRect(cx - 10, y, 10, 2);
      ctx.fillRect(cx + matW, y, 10, 2);
    }

    ctx.restore();
    this.renderFabricTexture(ctx, w, h);
  }

  // グリッド配列をタイル/拡大縮小してCanvas領域へ美しく転写
  drawPatternOnCanvas(ctx, grid, x, y, width, height) {
    const size = grid.gridSize;
    const cellW = width / size;
    const cellH = height / size;

    ctx.save();
    ctx.translate(x, y);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const color = grid.grid[r][c];
        const cx = c * cellW;
        const cy = r * cellH;

        ctx.fillStyle = color;
        ctx.fillRect(cx, cy, cellW, cellH);

        // 立体的な織り糸エフェクト
        if (color !== grid.baseFabricColor) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH / 2 - 1);
        }
      }
    }
    ctx.restore();
  }

  // 角丸矩形描画ヘルパー
  roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }
}
