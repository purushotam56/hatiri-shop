"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";

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
    <div className="min-h-screen bg-gradient-to-b from-content1 via-background to-content1 flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-content2/50 backdrop-blur-xl border border-divider rounded-3xl shadow-2xl overflow-hidden">
          {/* Header gradient */}
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-secondary-600"></div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🔐</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-default-500">Sign in to your Hatiri Shop account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="bordered"
                size="lg"
                isRequired
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="bordered"
                size="lg"
                isRequired
              />

              {error && (
                <div className="p-4 bg-danger/20 border border-danger/50 rounded-lg flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-sm font-semibold text-danger-200">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                color="primary"
                size="lg"
                className="w-full font-bold"
                isLoading={loading}
                spinner={<Spinner size="sm" color="current" />}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>


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
