import './style.css';
import { TRADITIONAL_COLORS, TRADITIONAL_PATTERNS, PRODUCTS } from './patterns.js';
import { soundManager } from './audio.js';
import { HanaoriGrid } from './grid.js';
import { ProductPreview } from './preview.js';
import { downloadCanvasImage } from './export.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM要素取得
  const gridCanvas = document.getElementById('grid-canvas');
  const previewCanvas = document.getElementById('preview-canvas');
  
  const tabEdit = document.getElementById('tab-edit');
  const tabPreview = document.getElementById('tab-preview');
  const viewEditor = document.getElementById('view-editor');
  const viewPreviewSection = document.getElementById('view-preview-section');

  const colorPalette = document.getElementById('color-palette');
  const patternPalette = document.getElementById('pattern-palette');
  const productList = document.getElementById('product-list');

  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  const btnClear = document.getElementById('btn-clear');

  const toggleSymmetry = document.getElementById('toggle-symmetry');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  const btnOpenZukan = document.getElementById('btn-open-zukan');
  const btnCloseZukan = document.getElementById('btn-close-zukan');
  const modalZukan = document.getElementById('modal-zukan');
  const zukanBody = document.getElementById('zukan-body');

  const productTitle = document.getElementById('product-title');
  const productDesc = document.getElementById('product-desc');
  const btnDownload = document.getElementById('btn-download');

  // インスタンス作成
  const gridInstance = new HanaoriGrid(gridCanvas, { gridSize: 12 });
  const previewInstance = new ProductPreview(previewCanvas);

  let currentProductId = PRODUCTS[0].id;

  // 初期描画
  gridInstance.render();

  // 1. カラーパレットの構築
  TRADITIONAL_COLORS.forEach((colorObj, idx) => {
    const swatch = document.createElement('button');
    swatch.className = `color-swatch ${idx === 0 ? 'active' : ''}`;
    swatch.style.backgroundColor = colorObj.hex;
    swatch.title = colorObj.name;
    swatch.dataset.hex = colorObj.hex;

    swatch.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      gridInstance.currentColor = colorObj.hex;
      gridInstance.currentPattern = null; // スタンプ解除

      document.querySelectorAll('.stamp-item').forEach(st => st.classList.remove('active'));
      soundManager.playTonSound();
    });

    colorPalette.appendChild(swatch);
  });

  // 2. 伝統紋様スタンプリストの構築
  TRADITIONAL_PATTERNS.forEach(pat => {
    const stamp = document.createElement('div');
    stamp.className = 'stamp-item';
    stamp.innerHTML = `
      <span class="stamp-icon">${pat.icon}</span>
      <span class="stamp-name">${pat.name}</span>
    `;

    stamp.addEventListener('click', () => {
      document.querySelectorAll('.stamp-item').forEach(st => st.classList.remove('active'));
      stamp.classList.add('active');

      gridInstance.currentPattern = pat;
      soundManager.playTonSound();
    });

    patternPalette.appendChild(stamp);
  });

  // 3. 商品選択リストの構築
  PRODUCTS.forEach((prod, idx) => {
    const chip = document.createElement('button');
    chip.className = `product-chip ${idx === 0 ? 'active' : ''}`;
    chip.innerHTML = `${prod.icon} ${prod.name}`;

    chip.addEventListener('click', () => {
      document.querySelectorAll('.product-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      currentProductId = prod.id;
      productTitle.textContent = `${prod.icon} ${prod.name}`;
      productDesc.textContent = prod.desc;

      previewInstance.render(currentProductId, gridInstance);
      soundManager.playTonSound();
    });

    productList.appendChild(chip);
  });

  // 4. マス目サイズ切り替え
  document.querySelectorAll('.btn-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const newSize = parseInt(btn.dataset.size, 10);
      gridInstance.setGridSize(newSize);
      soundManager.playTonSound();
    });
  });

  // 5. 左右対称スイッチ
  toggleSymmetry.addEventListener('change', (e) => {
    gridInstance.symmetricMode = e.target.checked;
    gridInstance.render();
    soundManager.playTonSound();
  });

  // 6. アンドゥ / リドゥ / クリア
  btnUndo.addEventListener('click', () => gridInstance.undo());
  btnRedo.addEventListener('click', () => gridInstance.redo());
  btnClear.addEventListener('click', () => {
    if (confirm('作ったもようをぜんぶ消してもいいですか？')) {
      gridInstance.clearGrid();
      soundManager.playTonSound();
    }
  });

  // 7. テンプレート選択
  document.querySelectorAll('.btn-template').forEach(btn => {
    btn.addEventListener('click', () => {
      const templateId = btn.dataset.template;
      gridInstance.loadTemplate(templateId);
      soundManager.playTonSound();
    });
  });

  // 8. タブ切替（エディタ ⇄ プレビュー）
  tabEdit.addEventListener('click', () => {
    tabEdit.classList.add('active');
    tabEdit.setAttribute('aria-selected', 'true');
    tabPreview.classList.remove('active');
    tabPreview.setAttribute('aria-selected', 'false');

    viewEditor.classList.add('active');
    viewPreviewSection.classList.remove('active');
    soundManager.playTonSound();
  });

  tabPreview.addEventListener('click', () => {
    tabPreview.classList.add('active');
    tabPreview.setAttribute('aria-selected', 'true');
    tabEdit.classList.remove('active');
    tabEdit.setAttribute('aria-selected', 'false');

    viewPreviewSection.classList.add('active');
    viewEditor.classList.remove('active');

    // プレビューレンダリング
    previewInstance.render(currentProductId, gridInstance);
    soundManager.playFanfare();
  });

  // 9. サウンドON/OFF
  btnSoundToggle.addEventListener('click', () => {
    const isEnabled = soundManager.toggleSound();
    soundIcon.textContent = isEnabled ? '🔊' : '🔇';
  });

  // 10. 読谷山花織もよう図鑑モーダル
  btnOpenZukan.addEventListener('click', () => {
    zukanBody.innerHTML = '';
    TRADITIONAL_PATTERNS.forEach(pat => {
      const card = document.createElement('div');
      card.className = 'zukan-card';
      card.innerHTML = `
        <div class="zukan-icon">${pat.icon}</div>
        <div class="zukan-info">
          <h4>${pat.name}</h4>
          <p>${pat.meaning}</p>
        </div>
      `;
      zukanBody.appendChild(card);
    });
    modalZukan.classList.add('active');
    modalZukan.setAttribute('aria-hidden', 'false');
    soundManager.playTonSound();
  });

  btnCloseZukan.addEventListener('click', () => {
    modalZukan.classList.remove('active');
    modalZukan.setAttribute('aria-hidden', 'true');
  });

  modalZukan.addEventListener('click', (e) => {
    if (e.target === modalZukan) {
      modalZukan.classList.remove('active');
      modalZukan.setAttribute('aria-hidden', 'true');
    }
  });

  // 11. 画像保存ボタン
  btnDownload.addEventListener('click', () => {
    downloadCanvasImage(previewCanvas, `yomitan_hanaori_${currentProductId}.png`);
    soundManager.playFanfare();
  });

  // エディタ内容変更時、プレビュー中であれば更新
  gridInstance.onChangeCallback = () => {
    if (viewPreviewSection.classList.contains('active')) {
      previewInstance.render(currentProductId, gridInstance);
    }
  };
});
