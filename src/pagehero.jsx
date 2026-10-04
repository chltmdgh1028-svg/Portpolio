import React from "react";
import { ArrowLeft } from "lucide-react";
import { TLink } from "./transition";
import "./pages.css";

/** Shared hero for the four worlds (WORK / IMPACT / EXPERIENCE / PROFILE). */
export function PortalHero({ no, title, headline, sub, tone, children }) {
  return (
    <header className={`phero dark tone-${tone}`}>
      <div className="story-bg" aria-hidden="true">
        <i className="aurora a1 tinted" />
        <i className="aurora a3" />
        <div className="grid-bg" />
        <div className="noise" />
      </div>
      <div className="wrap phero-inner">
        <TLink className="back-link rise" style={{ "--i": 0 }} to="/main" kind="fade">
          <ArrowLeft size={16} aria-hidden="true" /> MAIN
        </TLink>
        <p className="phero-kicker rise" style={{ "--i": 1 }}>
          <span>{no}</span>
          <i aria-hidden="true" />
          <span>{title}</span>
        </p>
        <h1 className="phero-title">
          <span className="line"><span className="rise" style={{ "--i": 2 }}>{title}</span></span>
        </h1>
        {headline && <p className="phero-headline rise" style={{ "--i": 4 }}>{headline}</p>}
        {sub && <p className="phero-sub rise" style={{ "--i": 5 }}>{sub}</p>}
        {children}
      </div>
    </header>
  );
}
