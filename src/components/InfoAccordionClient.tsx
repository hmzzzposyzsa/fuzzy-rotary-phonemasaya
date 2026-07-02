"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Link2 } from "lucide-react";
import type { InfoCategory } from "@/types";

export default function InfoAccordionClient({
  categories,
}: {
  categories: InfoCategory[];
}) {
  const [openId, setOpenId] = useState<string | number | null>(null);

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 text-muted bg-card border border-border rounded-2xl">
        <Link2 size={32} className="mx-auto mb-3 opacity-30" />
        <p className="font-semibold mb-1">Belum ada data Info</p>
        <p className="text-sm">
          Data ini diambil dari endpoint <code className="text-primary">/info-links</code> di API eksternal kamu.
        </p>
      </div>
    );
  }

  return (
    <div>
      {categories.map((cat) => {
        const isOpen = openId === cat.id;
        return (
          <div
            key={cat.id}
            className="border border-border rounded-2xl overflow-hidden mb-3.5 transition-colors hover:border-primary/30"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : cat.id)}
              className="w-full flex items-center justify-between px-5 py-4.5 bg-card hover:bg-primary/5 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9.5 h-9.5 rounded-xl bg-primary/12 flex items-center justify-center shrink-0">
                  <Link2 size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm">{cat.title}</div>
                  {cat.subtitle && (
                    <div className="text-xs text-muted mt-0.5">{cat.subtitle}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs bg-primary/12 text-primary rounded-full px-2.5 py-0.5 font-bold">
                  {cat.links.length} link
                </span>
                <ChevronDown
                  size={18}
                  className={`text-muted transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border bg-primary/[0.02] p-3.5 flex flex-col gap-2">
                {cat.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-border bg-card text-sm font-semibold hover:border-primary hover:bg-primary/8 hover:text-primary hover:translate-x-1 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      {link.label}
                      {link.badge && (
                        <span className="text-[0.62rem] font-bold bg-primary/15 text-primary rounded-md px-1.5 py-0.5">
                          {link.badge}
                        </span>
                      )}
                    </span>
                    <ExternalLink size={14} className="text-muted" />
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
