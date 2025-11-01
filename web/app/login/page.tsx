"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { COLORS, GRADIENTS, COMPONENTS, UTILS } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(username, password);
      // expect backend to return { token } on success
      if (data?.token) {
        // store token for demo purposes; adapt to your auth flow
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
        }
        router.push("/");
      } else {
        setError(data?.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header gradient */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🔐</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-400">Sign in to your Hatiri Shop account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-red-200">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${COMPONENTS.button.primary}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-600">
              <p className="text-sm text-slate-400 text-center mb-4">Demo Credentials:</p>
              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2 text-xs text-slate-300">
                <p><span className="font-semibold text-blue-400">Customer:</span> john@example.com / Password@123</p>
                <p><span className="font-semibold text-purple-400">Seller:</span> seller1@example.com / Password@123</p>
                <p><span className="font-semibold text-pink-400">Admin:</span> admin@hatiri.com / Admin@123</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account?{" "}
          <a href="/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Return home
          </a>
        </p>
      </div>
    </div>
  );
}
