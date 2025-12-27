"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useRouter, useParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import { EmojiPicker } from "@/components/emoji-picker";
import { apiEndpoints } from "@/lib/api-client";
import { CategoryFormData } from "@/types/category";

interface Category {
  id: number;
  organisationId: number;
  name: string;
  slug: string;
  emoji: string | null;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function CategoriesContent() {
  const router = useRouter();
  const params = useParams();
  const organisationId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    emoji: "📦",
    description: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize token and fetch categories
  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        // Get token from localStorage
        const storedToken = localStorage.getItem("sellerToken");

        if (!organisationId || !storedToken) {
          router.push("/seller/select-store");

          return;
        }

        setToken(storedToken);
        setIsInitialized(true);
      } catch (err) {
        console.error("Initialization error:", err);
        router.push("/seller/select-store");
      }
    };

    initializeAndFetch();
  }, [organisationId, router]);

  useEffect(() => {
    if (isInitialized && token) {
      fetchCategories();
    }
  }, [isInitialized, token, organisationId]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiEndpoints.getSellerCategories(
        organisationId!,
        token!,
      );

      setCategories(data.categories || []);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      setFormError("Category name is required");

      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      await apiEndpoints.createSellerCategory(
        organisationId!,
        formData,
        token!,
      );

      // Reset form and refresh list
      setFormData({
        name: "",
        emoji: "📦",
        description: "",
      });
      setIsCreateModalOpen(false);
      await fetchCategories();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setFormError(error.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategoryId(category.id);
    setFormData({
      name: category.name,
      emoji: category.emoji || "📦",
      description: category.description,
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!formData.name.trim()) {
      setFormError("Category name is required");

      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      await apiEndpoints.updateSellerCategory(
        organisationId!,
        editingCategoryId!,
        formData,
        token!,
      );

      setIsEditModalOpen(false);
      await fetchCategories();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setFormError(error.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category? Products in this category may be affected.",
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(categoryId);
      await apiEndpoints.deleteSellerCategory(
        organisationId!,
        categoryId,
        token!,
      );
      await fetchCategories();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to delete category");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!organisationId || !token) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Manage your product categories</p>
          </div>
          <Button
            color="primary"
            onPress={() => {
              setFormData({
                name: "",
                emoji: "📦",
                description: "",
              });
              setFormError("");
              setIsCreateModalOpen(true);
            }}
          >
            + Add Category
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            {categories.length === 0 ? (
              <Card className="bg-white">
                <CardBody className="py-20 text-center">
                  <div className="text-5xl mb-4">📁</div>
                  <p className="text-gray-600 text-lg">No categories yet</p>
                  <p className="text-gray-500 mb-6">
                    Create your first category to organize your products
                  </p>
                  <Button
                    color="primary"
                    onPress={() => {
                      setFormData({
                        name: "",
                        emoji: "📦",
                        description: "",
                      });
                      setFormError("");
                      setIsCreateModalOpen(true);
                    }}
                  >
                    Create First Category
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="bg-white hover:shadow-lg transition"
                  >
                    <CardHeader className="flex gap-3">
                      <div className="text-4xl">{category.emoji || "📦"}</div>
                      <div className="flex flex-col flex-grow">
                        <p className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </p>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                      </div>
                    </CardHeader>
                    <CardBody className="gap-4">
                      {category.description && (
                        <p className="text-gray-700">{category.description}</p>
                      )}
                      <div className="flex gap-2 pt-4">
                        <Button
                          isIconOnly
                          className="flex-1"
                          variant="flat"
                          onPress={() => handleOpenEditModal(category)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          isIconOnly
                          className="flex-1"
                          color="danger"
                          isLoading={isDeleting === category.id}
                          variant="flat"
                          onPress={() => handleDeleteCategory(category.id)}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        size="md"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Create New Category</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200">
                  {formError}
                </div>
              )}

              <Input
                isRequired
                label="Category Name"
                placeholder="e.g., Electronics, Clothing, Food"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <EmojiPicker
                label="Select Emoji Icon"
                value={formData.emoji}
                onChange={(emoji) => setFormData({ ...formData, emoji })}
              />

              <Input
                label="Description"
                placeholder="Optional description for this category"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isSubmitting}
              variant="flat"
              onPress={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isSubmitting}
              onPress={handleCreateCategory}
            >
              Create Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        size="md"
        onClose={() => setIsEditModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200">
                  {formError}
                </div>
              )}

              <Input
                isRequired
                label="Category Name"
                placeholder="e.g., Electronics, Clothing, Food"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <EmojiPicker
                label="Select Emoji Icon"
                value={formData.emoji}
                onChange={(emoji) => setFormData({ ...formData, emoji })}
              />

              <Input
                label="Description"
                placeholder="Optional description for this category"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isSubmitting}
              variant="flat"
              onPress={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isLoading={isSubmitting}
              onPress={handleUpdateCategory}
            >
              Update Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}
