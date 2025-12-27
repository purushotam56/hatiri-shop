"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useSellerStore } from "@/context/seller-store-context";
import { apiEndpoints } from "@/lib/api-client";

interface Customer {
  customerId: number;
  customerName: string;
  customerPhone: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function SellerCustomersPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id;
  const { selectedStore, clearStore } = useSellerStore();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeLoaded, setStoreLoaded] = useState(false);

  // First effect: wait for store to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true);
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

    if (
      !selectedStore ||
      (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)
    ) {
      router.push("/seller/select-store");

      return;
    }

    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("sellerToken");
        const data = await apiEndpoints.getSellerCustomers(
          String(orgId),
          token || "",
        );

        setCustomers(data.customers || []);
      } catch (err) {
        setError("Failed to load customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [orgId, router, selectedStore, storeLoaded]);

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    clearStore();
    router.push("/seller");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">
              {error}
            </CardBody>
          </Card>
        ) : customers.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-default-600">
              No customers found
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  Customers ({customers.length})
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <Table aria-label="Customers table">
                <TableHeader>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Phone</TableColumn>
                  <TableColumn align="end">Orders</TableColumn>
                  <TableColumn align="end">Total Spent</TableColumn>
                  <TableColumn>Last Order</TableColumn>
                  <TableColumn align="center">Action</TableColumn>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.customerId}>
                      <TableCell>{customer.customerName}</TableCell>
                      <TableCell>{customer.customerPhone}</TableCell>
                      <TableCell className="text-right">
                        {customer.orderCount}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{" "}
                        {typeof customer.totalSpent === "number"
                          ? customer.totalSpent.toFixed(2)
                          : Number(customer.totalSpent).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {formatDate(customer.lastOrderDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link
                          href={`/seller/${orgId}/customers/${customer.customerId}`}
                        >
                          <Button color="primary" size="sm" variant="light">
                            View Orders
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  );
}
