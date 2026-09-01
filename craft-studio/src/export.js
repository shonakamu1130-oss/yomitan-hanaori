// スマホ保存・PNGダウンロード処理モジュール

export function downloadCanvasImage(canvas, filename = 'my_yomitan_hanaori.png') {
  if (!canvas) return;

  // モバイル Web Share API（対応端末の場合、スマホの「写真を保存」ダイアログを起動）
  if (navigator.canShare && navigator.share) {
    canvas.toBlob((blob) => {
      if (!blob) {
        fallbackDownload(canvas, filename);
        return;
      }
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: '読谷山花織デザイン作品',
          text: 'スマホで読谷山花織の伝統デザインを作ったよ！'
        }).catch(() => {
          fallbackDownload(canvas, filename);
        });
      } else {
        fallbackDownload(canvas, filename);
      }
    }, 'image/png');
  } else {
    fallbackDownload(canvas, filename);
  }
}

function fallbackDownload(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
