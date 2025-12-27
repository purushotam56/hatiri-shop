"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Switch } from "@heroui/switch";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { QRCodeGenerator } from "@/components/qr-code-generator";
import { useSellerStore } from "@/context/seller-store-context";
import { apiEndpoints, apiUpload } from "@/lib/api-client";

interface SellerUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: unknown;
}

interface OrganisationData {
  id?: number;
  name: string;
  organisationUniqueCode: string;
  currency?: string;
  image?: string | { url: string } | Record<string, unknown>;
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
  priceVisibility?: "hidden" | "login_only" | "visible";
  [key: string]: unknown;
}

export default function SellerSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string | number;
  const { selectedStore, clearStore } = useSellerStore();
  const [storeLoaded, setStoreLoaded] = useState(false);

  // Organisation data state
  const [organisation, setOrganisation] = useState<OrganisationData | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(false);

  // WhatsApp settings state
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [whatsappError, setWhatsappError] = useState("");
  const [whatsappSuccess, setWhatsappSuccess] = useState("");

  // QR Code color state
  const [qrDarkColor, setQrDarkColor] = useState("#000000");
  const [qrLightColor, setQrLightColor] = useState("#FFFFFF");

  // Profile edit state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [sellerUser, setSellerUser] = useState<SellerUser | null>(null);
  const [profileFormData, setProfileFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Store settings state
  const [editStoreOpen, setEditStoreOpen] = useState(false);
  const [storeFormData, setStoreFormData] = useState({
    name: "",
    logoFile: null as File | null,
    logoPreview: "",
  });
  const [storeSaving, setStoreSaving] = useState(false);
  const [storeError, setStoreError] = useState("");
  const [storeSuccess, setStoreSuccess] = useState("");

  // Price visibility state
  const [priceVisibility, setPriceVisibility] = useState<
    "hidden" | "login_only" | "visible"
  >("visible");
  const [priceVisibilitySaving, setPriceVisibilitySaving] = useState(false);
  const [priceVisibilityError, setPriceVisibilityError] = useState("");
  const [priceVisibilitySuccess, setPriceVisibilitySuccess] = useState("");

  // First effect: wait for store to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true);

      // Load seller user data
      const userDataStr = localStorage.getItem("sellerUser");

      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr) as SellerUser;

          setSellerUser(userData);
          setProfileFormData({
            firstName: (userData.firstName as string) || "",
            lastName: (userData.lastName as string) || "",
            email: (userData.email as string) || "",
          });
        } catch (error) {
          console.error("Failed to parse seller user data:", error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Second effect: check auth and store selection
  useEffect(() => {
    if (!storeLoaded) return;

    const token = localStorage.getItem("sellerToken");

    if (!token) {
      router.push("/seller");

      return;
    }

    // Verify store match
    if (
      !selectedStore ||
      (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)
    ) {
      router.push("/seller/select-store");
    }
  }, [router, orgId, selectedStore, storeLoaded]);

  // Third effect: fetch organisation data using getSellerDashboard
  useEffect(() => {
    if (!storeLoaded || !selectedStore) return;

    const token = localStorage.getItem("sellerToken");

    if (!token) return;

    const fetchOrganisation = async () => {
      try {
        setLoadingOrg(true);
        const dashboardData = await apiEndpoints.getSellerDashboard(
          String(orgId),
          token,
        );

        // Extract organisation data from dashboard or use fallback
        const org: OrganisationData = dashboardData.organisation || {
          id: typeof selectedStore.id === "number" ? selectedStore.id : Number(selectedStore.id),
          name: selectedStore.name,
          organisationUniqueCode: selectedStore.code,
          currency: "USD",
        };

        setOrganisation(org);

        // Set WhatsApp values if they exist
        if (org?.whatsappNumber) {
          setWhatsappNumber(org.whatsappNumber);
        }
        if (org?.whatsappEnabled !== undefined) {
          setWhatsappEnabled(org.whatsappEnabled);
        }
        // Set price visibility if it exists
        if (org?.priceVisibility) {
          setPriceVisibility(org.priceVisibility);
        }
      } catch (error) {
        console.error("Failed to fetch organisation data:", error);
        // Fallback to using selectedStore data
        setOrganisation({
          id: typeof selectedStore.id === "number" ? selectedStore.id : Number(selectedStore.id),
          name: selectedStore.name,
          organisationUniqueCode: selectedStore.code,
          currency: "USD",
        });
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchOrganisation();
  }, [storeLoaded, selectedStore, orgId]);

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    clearStore();
    router.push("/seller");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      // Validate form data
      if (
        !profileFormData.firstName ||
        !profileFormData.lastName ||
        !profileFormData.email
      ) {
        setProfileError("All fields are required");
        setProfileSaving(false);

        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(profileFormData.email)) {
        setProfileError("Please enter a valid email address");
        setProfileSaving(false);

        return;
      }

      // Update localStorage with new data
      const updatedUser = {
        ...sellerUser,
        firstName: profileFormData.firstName,
        lastName: profileFormData.lastName,
        email: profileFormData.email,
      };

      localStorage.setItem("sellerUser", JSON.stringify(updatedUser));
      setSellerUser(updatedUser);

      setProfileSuccess("Profile updated successfully!");
      setEditProfileOpen(false);
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setProfileError(error.message || "Failed to save profile");
      console.error(err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleEditProfileOpen = () => {
    setProfileFormData({
      firstName: (sellerUser?.firstName as string) || "",
      lastName: (sellerUser?.lastName as string) || "",
      email: (sellerUser?.email as string) || "",
    });
    setEditProfileOpen(true);
  };

  const handleEditStoreOpen = () => {
    let imageUrl = "";
    if (organisation?.image) {
      if (typeof organisation.image === "string") {
        imageUrl = organisation.image;
      } else if (
        organisation.image &&
        typeof organisation.image === "object" &&
        "url" in organisation.image
      ) {
        imageUrl = (organisation.image as { url: string }).url;
      }
    }
    setStoreFormData({
      name: (organisation?.name as string) || "",
      logoFile: null,
      logoPreview: imageUrl,
    });
    setStoreError("");
    setStoreSuccess("");
    setEditStoreOpen(true);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setStoreError("Please select an image file");

        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setStoreError("Image size must be less than 5MB");

        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        setStoreFormData({
          ...storeFormData,
          logoFile: file,
          logoPreview: event.target?.result as string,
        });
        setStoreError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreSaving(true);
    setStoreError("");
    setStoreSuccess("");

    try {
      const token = localStorage.getItem("sellerToken");

      if (!token) {
        router.push("/seller");

        return;
      }

      // Validate store name
      if (!storeFormData.name || !storeFormData.name.trim()) {
        setStoreError("Store name is required");
        setStoreSaving(false);

        return;
      }

      // Create FormData to send store name and logo file
      const formData = new FormData();

      formData.append("name", storeFormData.name);

      // Add logo file if a new one was selected
      if (storeFormData.logoFile) {
        formData.append("logo", storeFormData.logoFile);
      }

      // Call API to update store settings using multipart form
      const url = `/seller/${orgId}/store`;
      const response = await apiUpload(url, formData, token, "PUT");

      if (response.error) {
        setStoreError(response.message || "Failed to save store settings");

        return;
      }

      // Update local organisation state
      const updatedOrg: OrganisationData = {
        ...organisation,
        name: storeFormData.name,
        image: response.store?.image || organisation?.image,
      } as OrganisationData;

      setOrganisation(updatedOrg);

      // Also update the store form data preview with the new logo URL
      if (response.store?.image) {
        const logoUrl =
          typeof response.store.image === "string"
            ? response.store.image
            : response.store.image.url;

        setStoreFormData({
          name: storeFormData.name,
          logoFile: null,
          logoPreview: logoUrl,
        });
      }

      setStoreSuccess("Store settings updated successfully!");
      setEditStoreOpen(false);
      setTimeout(() => setStoreSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setStoreError(error.message || "Failed to save store settings");
      console.error(err);
    } finally {
      setStoreSaving(false);
    }
  };

  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappSaving(true);
    setWhatsappError("");
    setWhatsappSuccess("");

    try {
      const token = localStorage.getItem("sellerToken");

      if (!token) {
        router.push("/seller");

        return;
      }

      // Validate WhatsApp number format
      if (whatsappEnabled && !whatsappNumber) {
        setWhatsappError("WhatsApp number is required when enabled");
        setWhatsappSaving(false);

        return;
      }

      // Validate phone number format (basic international format)
      if (
        whatsappNumber &&
        !/^\+?[1-9]\d{1,14}$/.test(whatsappNumber.replace(/[^\d+]/g, ""))
      ) {
        setWhatsappError(
          "Please enter a valid WhatsApp number (e.g., +1234567890)",
        );
        setWhatsappSaving(false);

        return;
      }

      // Call API to update settings
      await apiEndpoints.updateSellerStore(
        orgId,
        {
          whatsappNumber: whatsappNumber || "",
          whatsappEnabled: whatsappEnabled,
        },
        token,
      );

      setWhatsappSuccess("WhatsApp settings updated successfully!");
      setTimeout(() => setWhatsappSuccess(""), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setWhatsappError(error.message || "Failed to save WhatsApp settings");
      console.error(err);
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleSavePriceVisibility = async (
    newVisibility: "hidden" | "login_only" | "visible",
  ) => {
    setPriceVisibilitySaving(true);
    setPriceVisibilityError("");
    setPriceVisibilitySuccess("");

    try {
      const token = localStorage.getItem("sellerToken");

      if (!token) {
        router.push("/seller");

        return;
      }

      await apiEndpoints.updateSellerStore(
        orgId,
        {
          priceVisibility: newVisibility,
        },
        token,
      );

      setPriceVisibility(newVisibility);
      setPriceVisibilitySuccess("Price visibility updated successfully!");
      setTimeout(() => setPriceVisibilitySuccess(""), 3000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setPriceVisibilityError(
        error.message || "Failed to update price visibility",
      );
      console.error(err);
    } finally {
      setPriceVisibilitySaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader className="font-semibold">Profile</CardHeader>
          <CardBody className="space-y-4">
            {sellerUser && (
              <div className="space-y-3 mb-2">
                <div>
                  <p className="text-sm text-default-500">Name</p>
                  <p className="font-medium">
                    {(sellerUser.firstName as string) || ""} {(sellerUser.lastName as string) || ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Email</p>
                  <p className="font-medium">{(sellerUser.email as string) || ""}</p>
                </div>
              </div>
            )}
            <Button
              className="w-full justify-start"
              variant="flat"
              onPress={handleEditProfileOpen}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Edit Profile
            </Button>
            <Button
              className="w-full justify-start"
              variant="flat"
              onPress={() => {}}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Change Password
            </Button>
          </CardBody>
        </Card>

        {/* Store Section */}
        <Card>
          <CardHeader className="font-semibold">Store</CardHeader>
          <CardBody className="space-y-4">
            {organisation && (
              <div className="space-y-3 mb-2 p-3 bg-default-100 rounded-lg">
                <div>
                  <p className="text-sm text-default-500">Store Name</p>
                  <p className="font-medium">{(organisation.name as string) || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Store Code</p>
                  <p className="font-medium text-sm">
                    {(organisation.organisationUniqueCode as string) || ""}
                  </p>
                </div>
                {organisation.image && (
                  <div>
                    <p className="text-sm text-default-500 mb-2">Store Logo</p>
                    <img
                      alt="Store Logo"
                      className="h-16 w-auto rounded"
                      src={
                        typeof organisation.image === "string"
                          ? organisation.image
                          : (organisation.image as { url?: string }).url || ""
                      }
                    />
                  </div>
                )}
              </div>
            )}
            <Button
              className="w-full justify-start"
              variant="flat"
              onPress={handleEditStoreOpen}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <path
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Edit Store Settings
            </Button>
            <Button
              className="w-full justify-start"
              variant="flat"
              onPress={() => {}}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Billing & Payments
            </Button>
          </CardBody>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader className="font-semibold">Support</CardHeader>
          <CardBody className="space-y-4">
            <Button
              className="w-full justify-start"
              variant="flat"
              onPress={() => {}}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Help & Support
            </Button>
          </CardBody>
        </Card>

        {/* WhatsApp Integration */}
        <Card>
          <CardHeader className="font-semibold">
            WhatsApp Integration
          </CardHeader>
          <CardBody className="space-y-4">
            {whatsappError && (
              <Chip
                className="w-full justify-start"
                color="danger"
                variant="flat"
              >
                {whatsappError}
              </Chip>
            )}
            {whatsappSuccess && (
              <Chip
                className="w-full justify-start"
                color="success"
                variant="flat"
              >
                {whatsappSuccess}
              </Chip>
            )}

            <form className="space-y-4" onSubmit={handleSaveWhatsApp}>
              <div>
                <p className="text-sm text-default-600 mb-2">
                  Enable WhatsApp for customers to inquire about products
                  directly
                </p>
              </div>

              <Input
                description="Include country code (e.g., +1 for US, +44 for UK)"
                disabled={whatsappSaving}
                label="WhatsApp Number"
                placeholder="+1234567890"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />

              <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                <div>
                  <p className="font-medium">Enable WhatsApp</p>
                  <p className="text-sm text-default-600">
                    Show WhatsApp button on your products
                  </p>
                </div>
                <Switch
                  checked={whatsappEnabled}
                  disabled={whatsappSaving}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  color="primary"
                  disabled={whatsappSaving}
                  isLoading={whatsappSaving}
                  type="submit"
                >
                  Save WhatsApp Settings
                </Button>
                <Button
                  disabled={whatsappSaving}
                  type="button"
                  variant="bordered"
                  onClick={() => {
                    setWhatsappNumber("");
                    setWhatsappEnabled(false);
                    setWhatsappError("");
                    setWhatsappSuccess("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Price Visibility Settings */}
        <Card>
          <CardHeader className="font-semibold">Price Visibility</CardHeader>
          <CardBody className="space-y-4">
            {priceVisibilityError && (
              <Chip
                className="w-full justify-start"
                color="danger"
                variant="flat"
              >
                {priceVisibilityError}
              </Chip>
            )}
            {priceVisibilitySuccess && (
              <Chip
                className="w-full justify-start"
                color="success"
                variant="flat"
              >
                {priceVisibilitySuccess}
              </Chip>
            )}

            <p className="text-sm text-default-600 mb-4">
              Control whether product prices are visible to guests, logged-in
              users, or everyone.
            </p>

            <div className="space-y-3">
              {/* Hidden Option */}
              <button
                type="button"
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors text-left w-full ${
                  priceVisibility === "hidden"
                    ? "border-primary bg-primary-50"
                    : "border-default-200 hover:border-default-300"
                } ${priceVisibilitySaving ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  !priceVisibilitySaving && handleSavePriceVisibility("hidden")
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      priceVisibility === "hidden"
                        ? "border-primary bg-primary"
                        : "border-default-300"
                    }`}
                  >
                    {priceVisibility === "hidden" && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Hide Prices</p>
                    <p className="text-sm text-default-600">
                      Prices hidden from all customers (guests and logged-in
                      users)
                    </p>
                  </div>
                </div>
              </button>

              {/* Login Only Option */}
              <button
                type="button"
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors text-left w-full ${
                  priceVisibility === "login_only"
                    ? "border-primary bg-primary-50"
                    : "border-default-200 hover:border-default-300"
                } ${priceVisibilitySaving ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  !priceVisibilitySaving &&
                  handleSavePriceVisibility("login_only")
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      priceVisibility === "login_only"
                        ? "border-primary bg-primary"
                        : "border-default-300"
                    }`}
                  >
                    {priceVisibility === "login_only" && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Login Only</p>
                    <p className="text-sm text-default-600">
                      Prices visible only to logged-in customers
                    </p>
                  </div>
                </div>
              </button>

              {/* Visible Option */}
              <button
                type="button"
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors text-left w-full ${
                  priceVisibility === "visible"
                    ? "border-primary bg-primary-50"
                    : "border-default-200 hover:border-default-300"
                } ${priceVisibilitySaving ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() =>
                  !priceVisibilitySaving && handleSavePriceVisibility("visible")
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                      priceVisibility === "visible"
                        ? "border-primary bg-primary"
                        : "border-default-300"
                    }`}
                  >
                    {priceVisibility === "visible" && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Show Prices</p>
                    <p className="text-sm text-default-600">
                      Prices visible to all customers (guests and logged-in
                      users)
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </CardBody>
        </Card>

        {/* QR Code Download */}
        {loadingOrg ? (
          <Card>
            <CardHeader className="font-semibold">Store QR Code</CardHeader>
            <CardBody className="flex items-center justify-center gap-3 py-8">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-default-600">Loading...</p>
            </CardBody>
          </Card>
        ) : organisation ? (
          <Card>
            <CardHeader className="font-semibold">Store QR Code</CardHeader>
            <CardBody className="space-y-6">
              <p className="text-sm text-default-600">
                Download QR codes that link to your store. Share them on printed
                materials, social media, or packaging.
              </p>

              {/* Color Customization */}
              <div className="space-y-4 p-4 bg-default-100 rounded-lg">
                <h5 className="font-semibold text-sm text-foreground">
                  Customize QR Code Colors
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  {/* Dark Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      QR Code Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-300"
                        type="color"
                        value={qrDarkColor}
                        onChange={(e) => setQrDarkColor(e.target.value)}
                      />
                      <div className="flex-1">
                        <input
                          className="w-full px-3 py-2 text-sm border-1 border-default-300 rounded-lg bg-background"
                          placeholder="#000000"
                          type="text"
                          value={qrDarkColor}
                          onChange={(e) => setQrDarkColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Light Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-300"
                        type="color"
                        value={qrLightColor}
                        onChange={(e) => setQrLightColor(e.target.value)}
                      />
                      <div className="flex-1">
                        <input
                          className="w-full px-3 py-2 text-sm border-1 border-default-300 rounded-lg bg-background"
                          placeholder="#FFFFFF"
                          type="text"
                          value={qrLightColor}
                          onChange={(e) => setQrLightColor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick color presets */}
                <div className="space-y-2 pt-2 border-t border-default-300">
                  <p className="text-xs font-medium text-default-600">
                    Quick Presets
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1.5 text-xs font-medium rounded bg-black text-white border-2 border-default-300 hover:border-primary transition-colors"
                      onClick={() => {
                        setQrDarkColor("#000000");
                        setQrLightColor("#FFFFFF");
                      }}
                    >
                      Classic Black
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs font-medium rounded bg-gray-800 text-gray-100 border-2 border-default-300 hover:border-primary transition-colors"
                      onClick={() => {
                        setQrDarkColor("#1f2937");
                        setQrLightColor("#f3f4f6");
                      }}
                    >
                      Dark Mode
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs font-medium rounded bg-blue-600 text-white border-2 border-default-300 hover:border-primary transition-colors"
                      onClick={() => {
                        setQrDarkColor("#0066cc");
                        setQrLightColor("#FFFFFF");
                      }}
                    >
                      Brand Blue
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white border-2 border-default-300 hover:border-primary transition-colors"
                      onClick={() => {
                        setQrDarkColor("#16a34a");
                        setQrLightColor("#FFFFFF");
                      }}
                    >
                      Green
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Generator */}
              {(() => {
                let logoUrl: string | undefined;

                if (organisation.image) {
                  // Handle both direct URL and object with url property
                  if (typeof organisation.image === "string") {
                    logoUrl = organisation.image;
                  } else if (
                    organisation.image &&
                    typeof organisation.image === "object" &&
                    "url" in organisation.image
                  ) {
                    logoUrl = (organisation.image as { url: string }).url;
                  }
                }

                return (
                  <QRCodeGenerator
                    darkColor={qrDarkColor}
                    lightColor={qrLightColor}
                    logoUrl={logoUrl}
                    organisationUniqueCode={(organisation.organisationUniqueCode as string) || ""}
                    storeName={(organisation.name as string) || ""}
                  />
                );
              })()}
            </CardBody>
          </Card>
        ) : null}

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader className="font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </CardHeader>
          <CardBody>
            <Button
              className="w-full"
              color="danger"
              variant="flat"
              onPress={handleLogout}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Logout
            </Button>
          </CardBody>
        </Card>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={editProfileOpen}
          size="md"
          onOpenChange={setEditProfileOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Profile
                </ModalHeader>
                <form onSubmit={handleSaveProfile}>
                  <ModalBody className="gap-4">
                    {profileError && (
                      <Chip
                        className="w-full justify-start"
                        color="danger"
                        variant="flat"
                      >
                        {profileError}
                      </Chip>
                    )}
                    {profileSuccess && (
                      <Chip
                        className="w-full justify-start"
                        color="success"
                        variant="flat"
                      >
                        {profileSuccess}
                      </Chip>
                    )}

                    <Input
                      disabled={profileSaving}
                      label="First Name"
                      placeholder="Enter your first name"
                      value={profileFormData.firstName}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          firstName: e.target.value,
                        })
                      }
                    />

                    <Input
                      disabled={profileSaving}
                      label="Last Name"
                      placeholder="Enter your last name"
                      value={profileFormData.lastName}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          lastName: e.target.value,
                        })
                      }
                    />

                    <Input
                      disabled={profileSaving}
                      label="Email"
                      placeholder="Enter your email"
                      type="email"
                      value={profileFormData.email}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          email: e.target.value,
                        })
                      }
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="default"
                      disabled={profileSaving}
                      variant="light"
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      disabled={profileSaving}
                      isLoading={profileSaving}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Edit Store Settings Modal */}
        <Modal isOpen={editStoreOpen} size="md" onOpenChange={setEditStoreOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Edit Store Settings
                </ModalHeader>
                <form onSubmit={handleSaveStore}>
                  <ModalBody className="gap-4">
                    {storeError && (
                      <Chip
                        className="w-full justify-start"
                        color="danger"
                        variant="flat"
                      >
                        {storeError}
                      </Chip>
                    )}
                    {storeSuccess && (
                      <Chip
                        className="w-full justify-start"
                        color="success"
                        variant="flat"
                      >
                        {storeSuccess}
                      </Chip>
                    )}

                    <Input
                      disabled={storeSaving}
                      label="Store Name"
                      placeholder="Enter your store name"
                      value={storeFormData.name}
                      onChange={(e) =>
                        setStoreFormData({
                          ...storeFormData,
                          name: e.target.value,
                        })
                      }
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Store Logo
                      </label>
                      <div className="flex items-center gap-3">
                        {storeFormData.logoPreview && (
                          <div className="relative">
                            <img
                              alt="Logo Preview"
                              className="h-20 w-20 rounded-lg object-cover border-2 border-default-300"
                              src={storeFormData.logoPreview}
                            />
                            <button
                              className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                              type="button"
                              onClick={() =>
                                setStoreFormData({
                                  ...storeFormData,
                                  logoFile: null,
                                  logoPreview:
                                    (typeof organisation?.image === "object" &&
                                    "url" in (organisation.image as Record<string, unknown>)
                                      ? (organisation.image as { url: string }).url
                                      : typeof organisation?.image === "string"
                                        ? organisation.image
                                        : "") || "",
                                })
                              }
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            accept="image/*"
                            className="block w-full text-sm text-default-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded file:border-0
                              file:text-sm file:font-semibold
                              file:bg-primary file:text-primary-foreground
                              hover:file:bg-primary-600
                              cursor-pointer"
                            disabled={storeSaving}
                            type="file"
                            onChange={handleLogoFileChange}
                          />
                          <p className="text-xs text-default-400 mt-1">
                            Max 5MB. Formats: JPG, PNG, WebP
                          </p>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="default"
                      disabled={storeSaving}
                      variant="light"
                      onPress={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      disabled={storeSaving}
                      isLoading={storeSaving}
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
}
