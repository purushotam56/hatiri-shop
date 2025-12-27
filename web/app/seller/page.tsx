"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSellerAuth, type Store } from "@/context/seller-store-context";
import { apiEndpoints } from "@/lib/api-client";

export default function SellerAuthPage() {
  const router = useRouter();
  const { authState, login, register, clearError } = useSellerAuth();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isInitializing) {
      // Check if a store is already auto-selected (from localStorage or context)
      const selectedStoreStr = localStorage.getItem("selectedSellerStore");
      const selectedStore = selectedStoreStr
        ? JSON.parse(selectedStoreStr)
        : null;

      if (selectedStore) {
        // If 1 store auto-selected, go directly to dashboard
        router.push(`/seller/${selectedStore.id}/dashboard`);
      } else if (authState.stores.length === 1) {
        // If 1 store available but not yet selected, select and redirect
        router.push(`/seller/${authState.stores[0].id}/dashboard`);
      } else {
        // Multiple stores, let user select
        router.push("/seller/select-store");
      }
    }
  }, [
    authState.isAuthenticated,
    authState.isInitializing,
    authState.stores,
    router,
  ]);

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Register form
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    fullName: "",
    mobile: "",
    organisationName: "",
    organisationCode: "",
    businessType: "",
    city: "",
    country: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Convert organisationCode to lowercase
    if (name === "organisationCode") {
      finalValue = value.toLowerCase().trim();
    }
    setRegisterForm((prev) => ({ ...prev, [name]: finalValue }));
    clearError();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(loginForm.email, loginForm.password);

      // If login successful, check if we have stores
      const storesStr = localStorage.getItem("sellerStores");
      const stores = storesStr ? JSON.parse(storesStr) : [];

      if (stores.length > 0) {
        // If only one store, auto-select it
        if (stores.length === 1) {
          await selectStoreAndRedirect(stores[0]);
        } else {
          // Multiple stores, redirect to store selection
          router.push("/seller/select-store");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const selectStoreAndRedirect = async (store: Store) => {
    try {
      const token = localStorage.getItem("sellerToken") || "";
      const data = await apiEndpoints.sellerSelectStore(
        { storeId: store.id },
        token,
      );

      if (!data.store) {
        console.error("Failed to select store:", data.message);

        return;
      }

      // Update with the new token that includes store ID
      localStorage.setItem("sellerToken", data.token);
      router.push(`/seller/${store.id}/dashboard`);
    } catch (err) {
      console.error("Failed to select store:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(registerForm);

      // Registration successful, switch to login tab with email pre-filled
      setActiveTab("login");
      setLoginForm({
        email: registerForm.email,
        password: registerForm.password,
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      // router.push(`/seller/${1}/dashboard`)
    }
  }, [authState]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-content1 via-content2 to-content1 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <Card className="w-full" shadow="lg">
          <div className="h-2 bg-gradient-to-r from-warning via-danger to-secondary" />

          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-6">
            <div className="text-5xl mb-3">🏪</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-warning to-danger bg-clip-text text-transparent">
              Hatiri Seller
            </h1>
            <p className="text-default-500">Manage your store & orders</p>
          </CardHeader>

          <CardBody className="gap-6">
            <Tabs
              fullWidth
              color="warning"
              selectedKey={activeTab}
              variant="bordered"
              onSelectionChange={(key) => setActiveTab(key as string)}
            >
              <Tab key="login" title="Login">
                <div className="py-4">
                  <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <Input
                      isRequired
                      isDisabled={authState.loading}
                      label="Email Address"
                      name="email"
                      placeholder="seller@example.com"
                      type="email"
                      value={loginForm.email}
                      variant="bordered"
                      onChange={(e) => handleLoginChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    <Input
                      isRequired
                      isDisabled={authState.loading}
                      label="Password"
                      name="password"
                      placeholder="Enter your password"
                      type="password"
                      value={loginForm.password}
                      variant="bordered"
                      onChange={(e) => handleLoginChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    {authState.error && (
                      <Chip
                        className="w-full justify-start p-4"
                        color="danger"
                        startContent={<span>⚠️</span>}
                        variant="flat"
                      >
                        {authState.error}
                      </Chip>
                    )}

                    <Button
                      fullWidth
                      color="warning"
                      isDisabled={authState.loading}
                      isLoading={authState.loading}
                      type="submit"
                      variant="shadow"
                    >
                      {authState.loading ? "Logging in…" : "Login"}
                    </Button>
                  </form>
                </div>
              </Tab>

              <Tab key="register" title="Register">
                <div className="py-4">
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleRegister}
                  >
                    <div>
                      <p className="text-sm font-semibold text-default-700 mb-3">
                        Store Information
                      </p>
                      <Input
                        isRequired
                        isDisabled={authState.loading}
                        label="Store Name"
                        name="organisationName"
                        placeholder="Your store name"
                        size="sm"
                        type="text"
                        value={registerForm.organisationName}
                        variant="bordered"
                        onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                      />
                    </div>

                    <Input
                      isRequired
                      description="Unique identifier for your store (letters and numbers only)"
                      isDisabled={authState.loading}
                      label="Store Code"
                      name="organisationCode"
                      placeholder="e.g., FM001"
                      type="text"
                      value={registerForm.organisationCode}
                      variant="bordered"
                      onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    <Input
                      isRequired
                      isDisabled={authState.loading}
                      label="Business Type"
                      name="businessType"
                      placeholder="e.g., Grocery, Electronics, Fashion"
                      type="text"
                      value={registerForm.businessType}
                      variant="bordered"
                      onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    <Input
                      isRequired
                      isDisabled={authState.loading}
                      label="City"
                      name="city"
                      placeholder="Your store's city"
                      type="text"
                      value={registerForm.city}
                      variant="bordered"
                      onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    <Input
                      isRequired
                      isDisabled={authState.loading}
                      label="Country"
                      name="country"
                      placeholder="e.g., India"
                      type="text"
                      value={registerForm.country}
                      variant="bordered"
                      onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    <div>
                      <p className="text-sm font-semibold text-default-700 mb-3">
                        Your Information
                      </p>
                      <Input
                        isRequired
                        isDisabled={authState.loading}
                        label="Full Name"
                        name="fullName"
                        placeholder="Your full name"
                        size="sm"
                        type="text"
                        value={registerForm.fullName}
                        variant="bordered"
                        onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                      />
                    </div>

                    <Input
                      isRequired
                      isDisabled={authState.loading}
                      label="Email Address"
                      name="email"
                      placeholder="your@example.com"
                      type="email"
                      value={registerForm.email}
                      variant="bordered"
                      onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    <Input
                      isDisabled={authState.loading}
                      label="Mobile Number"
                      name="mobile"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={registerForm.mobile}
                      variant="bordered"
                      onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    <Input
                      isRequired
                      isDisabled={authState.loading}
                      label="Password"
                      name="password"
                      placeholder="Choose a strong password"
                      type="password"
                      value={registerForm.password}
                      variant="bordered"
                      onChange={(e) => handleRegisterChange(e as React.ChangeEvent<HTMLInputElement>)}
                    />

                    {authState.error && (
                      <Chip
                        className="w-full justify-start p-4"
                        color="danger"
                        startContent={<span>⚠️</span>}
                        variant="flat"
                      >
                        {authState.error}
                      </Chip>
                    )}

                    <Button
                      fullWidth
                      color="warning"
                      isDisabled={authState.loading}
                      isLoading={authState.loading}
                      type="submit"
                      variant="shadow"
                    >
                      {authState.loading ? "Creating…" : "Register"}
                    </Button>
                  </form>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        <p className="text-center text-default-500 text-sm mt-6">
          Want to shop instead?{" "}
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
