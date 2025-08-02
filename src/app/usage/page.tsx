"use client";
import React, { useEffect, useState } from "react";
import { UsageLogApiKeys } from "@/lib/api_keys";
import { KeyRound, Info, CalendarClock, Timer, ListOrdered, Code } from "lucide-react";

type Log = {
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  timestamp: string;
};

type ApiKeyUsage = {
  identifier: string;
  title: string;
  detail: string;
  created_at: string;
  expired: string | null;
  total_requests: number;
  logs: Log[];
};

type UsageResponse = {
  status: string;
  total_requests: number;
  data: ApiKeyUsage[];
};

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    UsageLogApiKeys()
      .then(setUsage)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin">
          <svg width="32" height="32" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#38bdf8" strokeWidth="4" fill="none" />
          </svg>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 mt-8 text-center">{error}</div>
    );
  if (!usage) return null;

  const isEmpty = !usage.data || usage.data.length === 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <KeyRound size={32} className="text-neon-blue" />
          <h2 className="text-3xl font-bold text-white tracking-tight">API Keys Usage</h2>
        </div>
        <div className="mb-8 flex items-center gap-2">
          <ListOrdered size={20} className="text-neon-cyan" />
          <span className="text-lg text-neon-cyan font-medium">
            Total Requests: <b>{usage.total_requests}</b>
          </span>
        </div>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <KeyRound size={48} className="mb-6 text-neon-blue" />
            <h3 className="text-2xl font-semibold text-white mb-2">Belum ada aktivitas penggunaan API Key</h3>
            <p className="text-white/60 mb-4">Mulai gunakan API Key Anda untuk melihat log penggunaan di sini.</p>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-blue text-black font-medium hover:bg-neon-cyan transition"
            >
              <Code size={20} />
              Lihat Dokumentasi
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {usage.data.map(key => (
              <div
                key={key.identifier}
                className="rounded-xl bg-white/5 border border-white/10 shadow-lg hover:border-neon-blue/50 transition-all duration-300 p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={20} className="text-neon-blue" />
                  <span className="text-xl font-semibold text-white">{key.title}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-neon-cyan" />
                  <span className="text-white/70">{key.detail}</span>
                </div>
                <div className="flex flex-wrap gap-4 mb-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <KeyRound size={14} className="text-neon-blue" />
                    <b>Identifier:</b> {key.identifier}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarClock size={14} className="text-neon-cyan" />
                    <b>Created:</b> {new Date(key.created_at).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarClock size={14} className="text-neon-cyan" />
                    <b>Expired:</b> {key.expired ? new Date(key.expired).toLocaleString() : "Never"}
                  </span>
                  <span className="flex items-center gap-1">
                    <ListOrdered size={14} className="text-neon-blue" />
                    <b>Total Requests:</b> {key.total_requests}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-white/10 text-neon-cyan">
                        <th className="py-2 px-2 text-left font-semibold">
                          <Info size={14} className="inline mr-1" /> Endpoint
                        </th>
                        <th className="py-2 px-2 text-left font-semibold">Method</th>
                        <th className="py-2 px-2 text-left font-semibold">Status</th>
                        <th className="py-2 px-2 text-left font-semibold">
                          <Timer size={14} className="inline mr-1" /> Response Time (ms)
                        </th>
                        <th className="py-2 px-2 text-left font-semibold">
                          <CalendarClock size={14} className="inline mr-1" /> Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {key.logs.map((log, idx) => (
                        <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition">
                          <td className="py-1 px-2">{log.endpoint}</td>
                          <td className="py-1 px-2">{log.method}</td>
                          <td className="py-1 px-2">{log.status_code}</td>
                          <td className="py-1 px-2">{log.response_time}</td>
                          <td className="py-1 px-2">{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
