"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { apiEndpoints } from "@/lib/api-client";

export default function SellerAboutPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const [storeLoaded, setStoreLoaded] = useState(false);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const editorRef = useRef<Record<string, unknown> | null>(null);

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
      loadAboutContent();
    }
  }, [orgId, router]);

  const loadAboutContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("sellerToken");
      const data = await apiEndpoints.getSellerAboutPage(orgId, token || "");

      setContent(data.content || "");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error loading content:", err);
      // If 404, that's ok - page doesn't exist yet
      if (error.message?.includes("404")) {
        setContent("");
      } else {
        setError(error.message || "Failed to fetch about page data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("sellerToken");
      const data = await apiEndpoints.saveSellerAboutPage(
        orgId,
        content,
        token || "",
      );

      if (data.error) {
        setError(data.message || "Failed to save about page");
      } else {
        setSuccess("About page updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to save about page data");
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
              Edit About Page
            </h1>
            <p className="text-foreground/70 mt-1">
              Tell your customers about your store
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

        {/* Content Editor */}
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">About Content</h2>
            <p className="text-sm text-foreground/70">
              Use rich text formatting. You can use basic HTML or Markdown
              formatting.
            </p>
          </CardHeader>
          <CardBody className="gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner color="primary" />
              </div>
            ) : (
              <>
                <div className="min-h-64 bg-content1 border border-divider rounded-lg p-4 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <textarea
                    ref={editorRef as React.Ref<HTMLTextAreaElement>}
                    className="w-full h-64 bg-transparent border-0 outline-0 resize-none text-foreground placeholder:text-foreground/40 font-mono"
                    placeholder="Write your about page content here... You can use HTML tags like <b>, <i>, <u>, <p>, <ul>, <li>, etc."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* Preview */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Preview</h3>
                  <Card className="bg-content2">
                    <CardBody
                      className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                      dangerouslySetInnerHTML={{
                        __html:
                          content ||
                          '<p className="text-foreground/50">Your content will appear here...</p>',
                      }}
                    />
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

        {/* Help Section */}
        <Card className="mt-8 bg-primary/10">
          <CardBody className="gap-3">
            <h3 className="font-semibold">Formatting Tips</h3>
            <ul className="text-sm space-y-2 text-foreground/80">
              <li>
                • Use{" "}
                <code className="bg-black/20 px-2 py-1 rounded">
                  &lt;b&gt;text&lt;/b&gt;
                </code>{" "}
                for <b>bold</b>
              </li>
              <li>
                • Use{" "}
                <code className="bg-black/20 px-2 py-1 rounded">
                  &lt;i&gt;text&lt;/i&gt;
                </code>{" "}
                for <i>italic</i>
              </li>
              <li>
                • Use{" "}
                <code className="bg-black/20 px-2 py-1 rounded">
                  &lt;p&gt;&lt;/p&gt;
                </code>{" "}
                for paragraphs
              </li>
              <li>
                • Use{" "}
                <code className="bg-black/20 px-2 py-1 rounded">
                  &lt;ul&gt;&lt;li&gt;&lt;/li&gt;&lt;/ul&gt;
                </code>{" "}
                for lists
              </li>
              <li>
                • Use{" "}
                <code className="bg-black/20 px-2 py-1 rounded">
                  &lt;h2&gt;&lt;/h2&gt;
                </code>{" "}
                for headings
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
