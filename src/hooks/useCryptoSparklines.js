import { useState, useEffect } from 'react';
import api from '../components/valor/api';

// Cache em memória para evitar requisições repetidas ao trocar de rota ou filtrar
const sparklinesCache = new Map();
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutos

/**
 * Converte array de valores em uma curva Bézier cúbica contínua (Catmull-Rom spline)
 * para viewBox 100x30.
 */
export function generateSparklinePath(values, width = 100, height = 30, padding = 4) {
  if (!values || values.length < 2) return '';

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const usableHeight = height - padding * 2;

  const pts = values.map((val, i) => ({
    x: Number(((i / (values.length - 1)) * width).toFixed(1)),
    y: Number((height - padding - ((val - min) / range) * usableHeight).toFixed(1)),
  }));

  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : pts.length - 1];

    const cp1x = Number((p1.x + (p2.x - p0.x) / 6).toFixed(1));
    const cp1y = Number((p1.y + (p2.y - p0.y) / 6).toFixed(1));
    const cp2x = Number((p2.x - (p3.x - p1.x) / 6).toFixed(1));
    const cp2y = Number((p2.y - (p3.y - p1.y) / 6).toFixed(1));

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

/**
 * Hook para carregar mini-gráficos (sparklines) de 7 dias reais para uma lista de símbolos.
 * Busca velas diárias (klines) na Binance e gera o path SVG dinamicamente.
 *
 * @param {string[]} symbols - Ex: ['BTC', 'ETH', 'SOL']
 * @returns {{ sparklines: Record<string, { sparkPath: string, isPositive7d: boolean, prices: number[] }>, carregando: boolean }}
 */
export function useCryptoSparklines(symbols) {
  const [sparklines, setSparklines] = useState(() => {
    // Inicializa com o cache existente se houver
    const initial = {};
    if (symbols) {
      symbols.forEach((sym) => {
        const cached = sparklinesCache.get(sym);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
          initial[sym] = cached.data;
        }
      });
    }
    return initial;
  });
  const [carregando, setCarregando] = useState(false);

  const symbolsKey = symbols ? JSON.stringify([...symbols].sort()) : '';

  useEffect(() => {
    if (!symbolsKey) return;
    const parsedSymbols = JSON.parse(symbolsKey);
    const now = Date.now();

    // Identifica quais símbolos precisam ser buscados
    const toFetch = parsedSymbols.filter((sym) => {
      const cached = sparklinesCache.get(sym);
      return !cached || now - cached.timestamp >= CACHE_DURATION_MS;
    });

    if (toFetch.length === 0) return;

    let isMounted = true;
    setCarregando(true);

    const fetchAllSparklines = async () => {
      try {
        const results = await Promise.allSettled(
          toFetch.map(async (sym) => {
            // Busca velas de 1 dia (últimos 8 dias para 7 intervalos completos)
            const res = await api.get(`/api/v3/klines?symbol=${sym}USDT&interval=1d&limit=8`);
            if (Array.isArray(res.data) && res.data.length >= 2) {
              const closePrices = res.data.map((k) => parseFloat(k[4]));
              const path = generateSparklinePath(closePrices);
              const isPositive7d = closePrices[closePrices.length - 1] >= closePrices[0];
              const data = {
                sparkPath: path,
                isPositive7d,
                prices: closePrices,
              };
              sparklinesCache.set(sym, { data, timestamp: Date.now() });
              return { sym, data };
            }
            throw new Error(`Dados insuficientes para ${sym}`);
          })
        );

        if (!isMounted) return;

        const updates = {};
        results.forEach((r) => {
          if (r.status === 'fulfilled' && r.value) {
            updates[r.value.sym] = r.value.data;
          }
        });

        if (Object.keys(updates).length > 0) {
          setSparklines((prev) => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.warn('[Sparklines] Erro ao buscar sparklines de 7 dias:', err);
      } finally {
        if (isMounted) setCarregando(false);
      }
    };

    fetchAllSparklines();

    return () => {
      isMounted = false;
    };
  }, [symbolsKey]);

  return { sparklines, carregando };
}
