import logo from './logo.svg';
import './App.css';
import { PDFDocument } from "pdf-lib";
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

function App() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [status, setStatus] = useState('');

  // ファイル選択時のハンドラ
  const handleFileChange = (event) => {
    setPdfFiles([...event.target.files]);
    setStatus('');
  };

  // PDF結合処理
  const mergePDFs = async () => {
    if (pdfFiles.length === 0) {
      setStatus('PDFファイルを選択してください');
      return;
    }

    try {
      setStatus('PDFを結合中...');
      const mergedPdf = await PDFDocument.create();

      // 各PDFファイルを読み込んでページを追加
      for (const pdfFile of pdfFiles) {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // 結合したPDFをダウンロード
      const mergedPdfBytes = await mergedPdf.save();
      downloadFile(mergedPdfBytes, 'merged.pdf');
      setStatus('結合が完了しました！');
    } catch (error) {
      console.error('エラー:', error);
      setStatus('PDFの結合に失敗しました');
    }
  };

  // ファイルダウンロード用のヘルパー関数
  const downloadFile = (bytes, fileName) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>PDF結合ツール</h2>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <br />
      <button
        onClick={mergePDFs}
        style={{ marginTop: '10px', padding: '8px 16px' }}
      >
        PDFを結合
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
export default App;
