"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAdmin } from "@/context/admin-context";
import { apiEndpoints } from "@/lib/api-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminUser } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiEndpoints.adminLogin(formData);

      if (!data.admin) {
        setError(data.message || "Login failed");

        return;
      }

      // Store token
      localStorage.setItem("adminToken", data.token);
      setAdminUser(data.admin);

      router.push("/admin/dashboard");
    } catch (err) {
      setError("Connection error. Please try again.");
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-content1 via-content2 to-content1 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <Card className="w-full" shadow="lg">
          <div className="h-2 bg-gradient-to-r from-warning via-success to-warning" />

          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-6">
            <div className="text-5xl mb-3">👑</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-warning to-success bg-clip-text text-transparent">
              Hatiri Admin
            </h1>
            <p className="text-default-500">Manage organizations and sellers</p>
          </CardHeader>

          <CardBody className="gap-6">
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <Input
                isRequired
                isDisabled={loading}
                label="Email Address"
                name="email"
                placeholder="admin@hatiri.com"
                type="email"
                value={formData.email}
                variant="bordered"
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
              />

              <Input
                isRequired
                isDisabled={loading}
                label="Password"
                name="password"
                placeholder="Enter your password"
                type="password"
                value={formData.password}
                variant="bordered"
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
              />

              {error && (
                <Chip
                  className="w-full justify-start p-4"
                  color="danger"
                  startContent={<span>⚠️</span>}
                  variant="flat"
                >
                  {error}
                </Chip>
              )}

              <Button
                fullWidth
                color="warning"
                isDisabled={loading}
                isLoading={loading}
                type="submit"
                variant="shadow"
              >
                {loading ? "Logging in…" : "Login as Admin"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="text-center text-default-500 text-sm mt-6">
          Not an admin?{" "}
          <Link
            className="text-warning hover:text-warning-600 font-semibold transition-colors"
            href="/"
          >
            Go to store
          </Link>
        </p>
      </div>
    </main>
  );
}
