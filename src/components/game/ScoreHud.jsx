import { useEffect, useMemo, useRef, useState } from 'react';
import './ScoreHud.css';

const clampPercent = (value, max) => {
  if (!max || max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
};

const formatPoints = (value) => `${value > 0 ? '+' : ''}${value} pts`;

const formatDelta = (delta) => `${delta > 0 ? '+' : ''}${delta}`;

export const ScoreHud = ({ userAnswers = {}, maxScores = { cognitive: 72, techDependence: 68 } }) => {
  const { cognitive, techDependence } = useMemo(() => {
    return Object.values(userAnswers).reduce(
      (acc, phaseMap) => {
        if (!phaseMap) return acc;
        Object.values(phaseMap).forEach((ans) => {
          acc.cognitive += ans?.scoreCognitive || 0;
          acc.techDependence += ans?.scoreTechDependence || 0;
        });
        return acc;
      },
      { cognitive: 0, techDependence: 0 }
    );
  }, [userAnswers]);

  const prevScoresRef = useRef({ cognitive, techDependence });
  const [cogFlash, setCogFlash] = useState({ active: false, delta: 0, key: 0 });
  const [depFlash, setDepFlash] = useState({ active: false, delta: 0, key: 0 });

  useEffect(() => {
    const prev = prevScoresRef.current;
    const cogDelta = cognitive - prev.cognitive;
    const depDelta = techDependence - prev.techDependence;
    prevScoresRef.current = { cognitive, techDependence };

    const timers = [];

    if (cogDelta !== 0) {
      timers.push(
        setTimeout(() => {
          setCogFlash((curr) => ({ active: true, delta: cogDelta, key: curr.key + 1 }));
        }, 0)
      );
      timers.push(
        setTimeout(() => {
          setCogFlash((curr) => ({ ...curr, active: false }));
        }, 750)
      );
    }

    if (depDelta !== 0) {
      timers.push(
        setTimeout(() => {
          setDepFlash((curr) => ({ active: true, delta: depDelta, key: curr.key + 1 }));
        }, 0)
      );
      timers.push(
        setTimeout(() => {
          setDepFlash((curr) => ({ ...curr, active: false }));
        }, 750)
      );
    }

    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [cognitive, techDependence]);

  const cognitivePercent = clampPercent(cognitive, maxScores.cognitive);
  const dependencePercent = clampPercent(techDependence, maxScores.techDependence);

  return (
    <section className="score-hud" aria-label="Indicadores de desempenho em tempo real">
      <div className={`score-hud-meter cognitive ${cogFlash.active ? 'pulse' : ''}`}>
        <div className="score-hud-header">
          <span className="score-hud-label">Raciocínio Próprio</span>
          <span className="score-hud-values">
            {cogFlash.active && (
              <span
                key={cogFlash.key}
                className={`score-hud-delta ${cogFlash.delta > 0 ? 'good' : 'bad'}`}
              >
                {formatDelta(cogFlash.delta)}
              </span>
            )}
            <span className="score-hud-pts">{formatPoints(cognitive)}</span>
          </span>
        </div>
        <div
          className="score-hud-track"
          role="progressbar"
          aria-label="Raciocínio Próprio"
          aria-valuemin={0}
          aria-valuemax={maxScores.cognitive}
          aria-valuenow={Math.max(0, cognitive)}
        >
          <div
            className="score-hud-fill cognitive"
            style={{ width: `${cognitivePercent}%` }}
          />
        </div>
      </div>

      <div className={`score-hud-meter dependence ${depFlash.active ? 'pulse' : ''}`}>
        <div className="score-hud-header">
          <span className="score-hud-label">Dependência de IA</span>
          <span className="score-hud-values">
            {depFlash.active && (
              <span
                key={depFlash.key}
                className={`score-hud-delta ${depFlash.delta < 0 ? 'good' : 'bad'}`}
              >
                {formatDelta(depFlash.delta)}
              </span>
            )}
            <span className="score-hud-pts">{formatPoints(techDependence)}</span>
          </span>
        </div>
        <div
          className="score-hud-track"
          role="progressbar"
          aria-label="Dependência de IA"
          aria-valuemin={0}
          aria-valuemax={maxScores.techDependence}
          aria-valuenow={Math.max(0, techDependence)}
        >
          <div
            className="score-hud-fill dependence"
            style={{ width: `${dependencePercent}%` }}
          />
        </div>
      </div>
    </section>
  );
};
