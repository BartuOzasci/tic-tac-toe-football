import React, { useState, useEffect, useCallback } from "react";
import "./css/style.css";
import { logoPool } from "./data";

// Sabit Logo Yolu
const FIXED_LOGO = "/img/logo.png";

const App = () => {
  // State: Griddeki 6 dinamik hücrenin içeriğini tutar
  const [activeLogos, setActiveLogos] = useState([]);

  // Yardımcı Fonksiyon: Diziyi karıştır (Fisher-Yates Shuffle Algorithm)
  // Performans: En verimli karıştırma algoritmasıdır.
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fonksiyon: Rastgele 6 farklı logo seçip state'i güncelle
  // Her dağıtımda 6 logo birbirinden farklı olacak (tekrar yok)
  const handleShuffle = useCallback(() => {
    const shuffled = shuffleArray(logoPool);
    // İlk 6 elemanı al - tüm dizi karıştırıldığı için her biri farklı logo
    setActiveLogos(shuffled.slice(0, 6));
  }, []);

  // Effect: Sayfa ilk yüklendiğinde bir kez çalıştır
  useEffect(() => {
    handleShuffle();
  }, [handleShuffle]);

  // Grid Render Mantığı
  // 4x4 Grid = 16 Hücre.
  // Indexler: 0-15
  // Hedeflenen Indexler:
  // (0,0)=0 -> Sabit
  // Satır 1: 1, 2, 3 -> Dinamik
  // Sütun 1: 4, 8, 12 -> Dinamik
  const renderGridCells = () => {
    const cells = [];
    let dynamicIndexCounter = 0;

    for (let i = 0; i < 16; i++) {
      let content = null;
      let customClass = "grid-cell";

      // Sol Üst (0. index) - Sabit Logo
      if (i === 0) {
        content = <img src={FIXED_LOGO} alt="Main Logo" className="grid-img" />;
        customClass += " cell-fixed";
      }
      // 1. Satırın geri kalanı (1, 2, 3) VEYA 1. Sütunun geri kalanı (4, 8, 12)
      else if ([1, 2, 3, 4, 8, 12].includes(i)) {
        const logoSrc = activeLogos[dynamicIndexCounter];
        if (logoSrc) {
          content = (
            <img
              src={logoSrc}
              alt={`Random Logo ${dynamicIndexCounter}`}
              className="grid-img"
            />
          );
        }
        dynamicIndexCounter++;
      }
      // Diğer hücreler (Boş dekoratif alanlar)
      else {
        content = <span style={{ opacity: 0.1 }}>•</span>;
      }

      cells.push(
        <div key={i} className={customClass}>
          {content}
        </div>
      );
    }
    return cells;
  };

  return (
    <main className="main-container">
      <header className="mb-4 text-center">
        <h1 className="text-white fw-light">
          Logo{" "}
          <span style={{ color: "var(--accent-color)", fontWeight: "bold" }}>
            GRID
          </span>
        </h1>
      </header>

      <section className="custom-grid">{renderGridCells()}</section>

      <div className="mt-4">
        <button
          className="btn btn-shuffle"
          onClick={handleShuffle}
          aria-label="Logoları Yeniden Dağıt"
        >
          Yeniden Dağıt
        </button>
      </div>

      <footer className="mt-5 text-white-50 small">
        &copy; 2025 Modern Grid Systems
      </footer>
    </main>
  );
};

export default App;
