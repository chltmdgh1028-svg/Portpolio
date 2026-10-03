import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
