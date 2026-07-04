'use client';

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [qrUrl, setQrUrl] = useState('https://justapedia.org/Justapedia');
  const [message, setMessage] = useState('');
  const [articlePath, setArticlePath] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const qrRef = useRef<SVGSVGElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (newUrl.includes('justapedia.org')) {
      try {
        const urlObj = new URL(newUrl);
        let path = urlObj.pathname;
        
        // Handle both /wiki/Article and /Article formats
        path = path.replace('/wiki/', '/');
        
        // Remove leading slash
        path = path.startsWith('/') ? path.slice(1) : path;
        
        setArticlePath(path);
        
        const newQrUrl = `${window.location.origin}/${path}`;
        setQrUrl(newQrUrl);
        setMessage('The article will be available on Justapedia');
      } catch (error) {
        setMessage("Sorry - that doesn't seem to be a valid Justapedia URL");
      }
    } else if (newUrl.length > 0) {
      setMessage("Sorry - that doesn't seem to be a valid Justapedia URL");
    } else {
      setMessage('');
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ top: e.pageY, left: e.pageX });
    setMenuVisible(true);
  };

  const handleMenuClick = () => {
    setMenuVisible(false);
    downloadQRCode();
  };

  const handleDocumentClick = () => {
    setMenuVisible(false);
  };

  const downloadQRCode = () => {
    if (!qrRef.current || !articlePath) return;

    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${articlePath} QRJustapedia.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [menuVisible]);

  return (
    <div id="wrapper">
      <div id="inner_wrapper">
        <div id="title">
          <a href="https://justapedia.org/Justapedia" target="_blank" className="title">
            What Is QRJustapedia?
          </a>
        </div>
        <div id="panel">
          <div id="panel_content">
            <div id="qr_area" onContextMenu={handleContextMenu}>
              <div id="image">
                <a 
                  id="download" 
                  className="download" 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadQRCode();
                  }}
                >
                  <div id="qr">
                    <QRCodeSVG
                      ref={qrRef}
                      value={qrUrl}
                      size={345}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </a>
              </div>
            </div>
            <div id="url_area">
              <form 
                id="target" 
                action="/"
                onSubmit={(e) => e.preventDefault()}
              >
                <textarea
                  className="url"
                  id="url"
                  rows={2}
                  autoFocus
                  placeholder="Paste your Justapedia url here"
                  value={url}
                  onChange={handleUrlChange}
                />
              </form>
            </div>
          </div>
        </div>
        <div id="language_area" className="language_area">
          {message || '\u00A0'}
        </div>
        <div id="statistics_area" className="statistics_area">
          &nbsp;
        </div>
        <div id="bottom">
          <a href="https://justapedia.org/" target="_blank">Justapedia</a>
        </div>
        <div id="copyright">
          Copyright © 2026 by the Tools contributors.<br /><br />
          JPTools (also known as Justapedia Tools) is free and open-source software licensed under the GNU General Public License, version 3 or later (GPL-3.0+). Developed by Sourav<br /><br />
          Contact: skhsouravhalder@gmail.com<br /><br />
          Hosting generously provided by InterServer.
        </div>
      </div>
      <div
        id="menu"
        style={{
          display: menuVisible ? 'block' : 'none',
          top: menuPosition.top,
          left: menuPosition.left,
          position: 'absolute',
          padding: '10px',
          backgroundColor: '#ddd',
          border: '1px solid #000',
        }}
      >
        <a
          id="download-menu"
          className="download-menu"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleMenuClick();
          }}
        >
          Download QR Code
        </a>
      </div>
    </div>
  );
}
