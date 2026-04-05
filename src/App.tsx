import { useState } from "react";
import './App.css'
import wordsList from "./assets/words.json";
import badIcon from "./assets/bad.svg";
import goodIcon from "./assets/good.svg";
import warningIcon from "./assets/warning.svg";
import notFoundIcon from "./assets/not found.svg";

interface FoodItem {
  name: string;
  status: "good" | "warning" | "bad";
  obs?: string;
  alias?: string[];
}

interface FoodCategory {
  label: string;
  items: FoodItem[];
}

interface FoodData {
  [key: string]: FoodCategory;
}

function App() {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle");
  const [observation, setObservation] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);

  function handleStatusChanges() {
    const input = value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    console.log("hey");
    if(!input){
      setStatus("idle");
      setObservation("");
      return;
    }

    const words = wordsList as unknown as FoodData;
    const matches: FoodItem[] = [];

    Object.values(words).forEach((categoria) => {
      categoria.items.forEach((item) => {
        const nomeItem = item.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const matchesName = nomeItem.includes(input);

        const matchesAlias = item.alias?.some(a => 
          a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === input
        );

        if (matchesName || matchesAlias) {
          matches.push(item);
        }
      });
    });

    const uniqueMatches = matches.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
    setSearchResults(uniqueMatches);

    if (uniqueMatches.length === 0) {
      setStatus("not-found");

    } else if (uniqueMatches.length === 1) {
      setStatus(matches[0].status);
      setObservation(matches[0].obs || "");

    } else {
      const primeiroStatus = matches[0].status;
      const todosIguais = primeiroStatus != "warning" && matches.every(item => item.status === primeiroStatus);

      if (todosIguais) {
        setStatus(primeiroStatus);
        setObservation(primeiroStatus === "bad" ? "Evitar nos vários formatos." : 
                      primeiroStatus === "good" ? "Podes comer nos vários formatos." : "");
      
      } else {
        setStatus("multiple");
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleStatusChanges();
      // Opcional: tirar o foco do input para fechar o teclado no Android
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  // map status to colours
  const borderColor = {
    idle: "",
    good: "var(--green)",
    warning: "var(--yellow)",
    bad: "var(--red)",
    "not-found": "var(--gray)"
  }[status];

  const icon = {
    good: goodIcon,
    warning: warningIcon,
    bad: badIcon,
    "not-found": notFoundIcon
  }[status];

  return (
    <>
      <section id="center">
        <div>
          <h1>O que pretendemos comer?</h1>
          <div className="space"></div>

          <input className="button" 
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => {
              setStatus("idle");
              setObservation("");
            }}
            onBlur={handleStatusChanges}
            onKeyDown={handleKeyDown}
          />
        </div>

        {status !== 'idle' && (
          <div className="infoEntry" style={{ borderColor }}>
            
            {status !== 'multiple' && (
              <>
                {icon && <img src={icon} className="icon" width="50" height="50" alt="" />}

                <span className="obs">
                  {observation || (
                    status === "not-found" ? "Alimento não encontrado" : 
                    status === "bad" ? "Não deves comer isto" : 
                    status === "good" ? "Podes comer" : ""
                  )}
                </span>
              </>
            )}

            {status === 'multiple' && (
              <div className="suggestions-list">
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Tens estas opções:</p>
                {searchResults.map((item, index) => (
                  <div 
                    key={index} 
                    className={`suggestion-item status-${item.status}`}
                    onClick={() => {
                      setStatus(item.status);
                      setObservation(`${item.name}${item.obs ? `: ${item.obs}` : ''}`);
                    }}
                  >
                    <strong>{item.name}</strong> {item.obs && <span> - {item.obs}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default App
