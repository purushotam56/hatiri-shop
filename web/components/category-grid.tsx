import React from "react";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";

interface CategoryGridProps {
  categories?: Array<{ name: string; slug: string; emoji: string }>;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories = [] }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/?category=${cat.slug}`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer h-full hover:scale-105">
              <CardBody className="flex items-center justify-center py-6 px-2">
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="text-xs font-medium text-center line-clamp-2">{cat.name}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
