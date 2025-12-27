"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { apiEndpoints } from "@/lib/api-client";
import { ContactData } from "@/types/contact";

export default function SellerContactPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const [storeLoaded, setStoreLoaded] = useState(false);

  const [formData, setFormData] = useState<ContactData>({
    address: "",
    additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Check for token - if no token, redirect to login
    const token = localStorage.getItem("sellerToken");

    if (!token) {
      router.push("/seller/login");

      return;
    }

    // If we have a valid orgId from URL and token, we can proceed
    // Don't require selectedStore context to be set
    if (orgId && token) {
      setStoreLoaded(true);
      loadContactContent();
    }
  }, [orgId, router]);

  const loadContactContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("sellerToken");
      const data = await apiEndpoints.getSellerContactPage(orgId, token || "");

      setFormData({
        address: data.address || "",
        additionalInfo: data.additionalInfo || "",
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error loading content:", err);
      // If 404, that's ok - page doesn't exist yet
      if (error.message?.includes("404")) {
        setFormData({ address: "", additionalInfo: "" });
      } else {
        setError(error.message || "Failed to save contact page data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("sellerToken");
      const data = await apiEndpoints.saveSellerContactPage(
        orgId,
        formData,
        token || "",
      );

      if (data.error) {
        setError(data.message || "Failed to save contact page");
      } else {
        setSuccess("Contact page updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to fetch contact page data");
    } finally {
      setSaving(false);
    }
  };

  if (!storeLoaded) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/seller/${orgId}/pages`}>
            <Button isIconOnly className="text-lg" variant="light">
              ←
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Edit Contact Page
            </h1>
            <p className="text-foreground/70 mt-1">
              Provide your store&apos;s contact information
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Card className="mb-4 bg-danger/10">
            <CardBody>
              <p className="text-danger">{error}</p>
            </CardBody>
          </Card>
        )}

        {success && (
          <Card className="mb-4 bg-success/10">
            <CardBody>
              <p className="text-success">{success}</p>
            </CardBody>
          </Card>
        )}

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Contact Information</h2>
          </CardHeader>
          <CardBody className="gap-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner color="primary" />
              </div>
            ) : (
              <>
                {/* Address Field */}
                <div>
                  <h3 className="block text-sm font-semibold mb-3 text-foreground">
                    📍 Address
                  </h3>
                  <Textarea
                    className="w-full"
                    description="The street address, building number, city, state, and postal code"
                    minRows={4}
                    name="address"
                    placeholder="Enter your store's complete address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Additional Info Field */}
                <div>
                  <h3 className="block text-sm font-semibold mb-3 text-foreground">
                    ℹ️ Additional Information
                  </h3>
                  <Textarea
                    className="w-full"
                    description="Any additional information customers should know about visiting or contacting you"
                    minRows={6}
                    name="additionalInfo"
                    placeholder="e.g., Business hours, directions, parking info, delivery radius, etc."
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Preview */}
                <div className="mt-6 pt-6 border-t border-divider">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <Card className="bg-content2">
                    <CardBody className="gap-6">
                      <div>
                        <p className="text-sm font-semibold text-foreground/70 mb-2">
                          Address
                        </p>
                        <p className="text-foreground whitespace-pre-wrap">
                          {formData.address || "No address provided"}
                        </p>
                      </div>
                      {formData.additionalInfo && (
                        <div>
                          <p className="text-sm font-semibold text-foreground/70 mb-2">
                            Additional Information
                          </p>
                          <p className="text-foreground whitespace-pre-wrap">
                            {formData.additionalInfo}
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-divider">
                  <Button
                    color="primary"
                    isLoading={saving}
                    size="lg"
                    onPress={handleSave}
                  >
                    Save Changes
                  </Button>
                  <Link href={`/seller/${orgId}/pages`}>
                    <Button size="lg" variant="bordered">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Info Section */}
        <Card className="mt-8 bg-primary/10">
          <CardBody className="gap-3">
            <h3 className="font-semibold">Tips for Contact Information</h3>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li>• Include complete street address with postal code</li>
              <li>• Mention business hours if different from standard</li>
              <li>• Include parking or access information if helpful</li>
              <li>• Specify delivery radius or service areas</li>
              <li>• Add any special instructions for customers</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
