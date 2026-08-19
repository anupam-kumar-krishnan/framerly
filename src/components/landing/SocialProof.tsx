"use client";

import { motion } from "motion/react";

const quotes = [
  {
    quote:
      "Swapped our whole landing page gallery in an afternoon. The shadows finally look like they belong there.",
    name: "Priya Nair",
    role: "Founder, Lattice Notes",
    rotate: -2,
  },
  {
    quote:
      "The 3D tilt is the first one I've seen that doesn't look like a PowerPoint effect.",
    name: "Owen Marsh",
    role: "Design lead, Fielded",
    rotate: 1.5,
  },
  {
    quote:
      "We generate release screenshots through the API now. Zero manual framing since we set it up.",
    name: "Theo Alaoui",
    role: "Eng, Portside",
    rotate: -1,
  },
];

export default function Testimonials() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-14 font-mono text-[12px] uppercase tracking-wider text-accent-2"
        >
          From the studio floor
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: q.rotate }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              whileHover={{ rotate: 0, y: -6 }}
              className="rounded-2xl border border-border bg-surface p-7 shadow-xl shadow-black/20"
            >
              <blockquote className="text-[15px] font-medium leading-relaxed">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <div className="mt-6 text-[13px] text-text-dim">
                <div className="font-semibold text-text">{q.name}</div>
                {q.role}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
