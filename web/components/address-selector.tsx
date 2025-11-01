"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { useAddress, type Address } from "@/context/address-context";

interface AddressSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
}

export function AddressSelector({ isOpen, onClose, onSelect }: AddressSelectorProps) {
  const { addresses, selectedAddress, setSelectedAddress, addAddress } = useAddress();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Address>({
    label: "",
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleAddAddress = async () => {
    addAddress(formData);
    setFormData({
      label: "",
      fullName: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
    setIsAddingNew(false);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    onSelect(address);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {isAddingNew ? "Add New Address" : "Select Address"}
        </ModalHeader>
        <ModalBody>
          {!isAddingNew ? (
            <>
              {/* Address List */}
              {addresses.length === 0 ? (
                <p className="text-center text-foreground/60 py-8">No addresses saved yet</p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <Card
                      key={address.id}
                      isPressable
                      onClick={() => handleSelectAddress(address)}
                      className={`cursor-pointer transition-all ${
                        selectedAddress?.id === address.id
                          ? "border-2 border-primary bg-primary/5"
                          : "border border-divider"
                      }`}
                    >
                      <CardBody className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-foreground">
                              {address.label || address.fullName}
                            </p>
                            <p className="text-sm text-foreground/70">{address.street}</p>
                            <p className="text-sm text-foreground/70">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                            <p className="text-sm text-foreground/70">{address.phoneNumber}</p>
                          </div>
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-divider">
                            {selectedAddress?.id === address.id && (
                              <div className="w-3 h-3 bg-primary rounded-full" />
                            )}
                          </div>
                        </div>
                        {address.isDefault && (
                          <p className="text-xs font-semibold text-primary mt-2">Default Address</p>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Add Address Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Label"
                    placeholder="e.g., Home, Office"
                    value={formData.label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                  />
                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />

                <Input
                  label="Street Address"
                  placeholder="Street address"
                  value={formData.street}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                  <Input
                    label="State"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Postal Code"
                  placeholder="Postal code"
                  value={formData.pincode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default"
                    checked={formData.isDefault}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="default" className="text-sm text-foreground">
                    Set as default address
                  </label>
                </div>
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {!isAddingNew ? (
            <>
              <Button color="default" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={() => setIsAddingNew(true)}>
                + Add New Address
              </Button>
            </>
          ) : (
            <>
              <Button color="default" variant="light" onPress={() => setIsAddingNew(false)}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleAddAddress}>
                Save Address
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
