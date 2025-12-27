"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import React, { useState, useRef } from "react";
import QRCode from "react-qrcode-logo";

import { buildStoreQRUrl } from "@/lib/qr-code-utils";

interface QRCodeGeneratorProps {
  organisationUniqueCode: string;
  storeName: string;
  logoUrl?: string;
  domain?: string;
  darkColor?: string;
  lightColor?: string;
}

type QRModuleShape = "squares" | "dots" | "fluid";
type QRCornerShape = 0 | 15 | 29;

interface QRShapeConfig {
  name: string;
  module: QRModuleShape;
  corner: QRCornerShape;
}

const QR_SHAPE_PRESETS: { [key: string]: QRShapeConfig } = {
  sharp: { name: "Sharp", module: "squares", corner: 0 },
  classic: { name: "Classic", module: "squares", corner: 15 },
  smooth: { name: "Smooth", module: "fluid", corner: 15 },
  rounded: { name: "Rounded Dots", module: "dots", corner: 29 },
};

export function QRCodeGenerator({
  organisationUniqueCode,
  storeName,
  logoUrl,
  domain,
  darkColor = "#000000",
  lightColor = "#FFFFFF",
}: QRCodeGeneratorProps) {
  const [selectedShape, setSelectedShape] = useState<string>("sharp");
  const [moduleShape, setModuleShape] = useState<QRModuleShape>("squares");
  const [cornerRadius, setCornerRadius] = useState<QRCornerShape>(0);

  const basicQRRef = useRef<QRCode>(null);
  const logoQRRef = useRef<QRCode>(null);
  const basicQRContainerRef = useRef<HTMLDivElement>(null);
  const logoQRContainerRef = useRef<HTMLDivElement>(null);

  const handleShapePreset = (presetKey: string) => {
    setSelectedShape(presetKey);
    const preset = QR_SHAPE_PRESETS[presetKey];

    setModuleShape(preset.module);
    setCornerRadius(preset.corner);
  };

  const storeUrl = buildStoreQRUrl(organisationUniqueCode, domain);

  const downloadQRCode = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBasicQR = async () => {
    try {
      if (basicQRContainerRef.current) {
        const canvas = basicQRContainerRef.current.querySelector("canvas");

        if (canvas) {
          const filename = `${storeName}-qrcode.png`;

          downloadQRCode(canvas, filename);
        }
      }
    } catch (err) {
      console.error("Error downloading QR code:", err);
    }
  };

  const handleDownloadLogoQR = async () => {
    try {
      if (logoQRContainerRef.current) {
        const canvas = logoQRContainerRef.current.querySelector("canvas");

        if (canvas) {
          const filename = `${storeName}-qrcode.png`;

          downloadQRCode(canvas, filename);
        }
      }
    } catch (err) {
      console.error("Error downloading QR code:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Shape Selector */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
        <CardBody className="gap-4 p-6">
          <div className="space-y-4">
            <h5 className="font-semibold text-foreground">QR Code Style</h5>
            <div className="flex flex-wrap gap-2">
              {Object.entries(QR_SHAPE_PRESETS).map(([key, preset]) => (
                <Button
                  key={key}
                  color={selectedShape === key ? "primary" : "default"}
                  size="lg"
                  variant={selectedShape === key ? "solid" : "bordered"}
                  onPress={() => handleShapePreset(key)}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-default-500">
              Module: {moduleShape} | Corner radius: {cornerRadius}
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic QR Code */}
        <Card className="border-2 border-transparent hover:border-primary/50 transition-all duration-300 shadow-lg">
          <CardBody className="gap-6 p-8">
            <div className="text-center space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-foreground">
                  Store QR Code
                </h4>
                <p className="text-xs text-default-500">Standard format</p>
              </div>

              <div className="flex justify-center mx-auto">
                <div className="relative p-4 bg-white rounded-2xl shadow-xl border-4 border-gray-100">
                  <div
                    ref={basicQRContainerRef}
                    className="flex justify-center"
                  >
                    <QRCode
                      ref={basicQRRef}
                      bgColor={lightColor}
                      ecLevel="H"
                      enableCORS={true}
                      eyeRadius={cornerRadius}
                      fgColor={darkColor}
                      qrStyle={moduleShape}
                      size={224}
                      value={storeUrl}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5" />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-foreground">
                  Store Link
                </p>
                <p className="text-xs text-default-500 truncate px-2 py-1.5 bg-default-100 rounded-lg">
                  {storeUrl}
                </p>
              </div>

              <Button
                className="w-full font-semibold"
                color="primary"
                size="lg"
                onPress={handleDownloadBasicQR}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Download QR Code
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* QR Code with Logo */}
        {logoUrl && (
          <Card className="border-2 border-transparent hover:border-success/50 transition-all duration-300 shadow-lg">
            <CardBody className="gap-6 p-8">
              <div className="text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-foreground">
                    Branded QR Code
                  </h4>
                  <p className="text-xs text-default-500">
                    With your store logo
                  </p>
                </div>

                <div className="flex justify-center mx-auto">
                  <div className="relative p-4 bg-white rounded-2xl shadow-xl border-4 border-gray-100">
                    <div
                      ref={logoQRContainerRef}
                      className="flex justify-center"
                    >
                      <QRCode
                        ref={logoQRRef}
                        bgColor={lightColor}
                        ecLevel="H"
                        enableCORS={true}
                        eyeRadius={cornerRadius}
                        fgColor={darkColor}
                        logoHeight={50}
                        logoImage={logoUrl}
                        logoPadding={5}
                        logoPaddingStyle="square"
                        logoWidth={50}
                        qrStyle={moduleShape}
                        removeQrCodeBehindLogo={true}
                        size={224}
                        value={storeUrl}
                      />
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium text-foreground">
                    Perfect for
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      📱 Social Media
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      🖨️ Print
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full font-semibold"
                  color="success"
                  size="lg"
                  onPress={handleDownloadLogoQR}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  Download with Logo
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Usage Tips */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800">
        <CardBody className="gap-4 p-6">
          <div className="space-y-3">
            <h5 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-lg">💡</span>
              Usage Tips
            </h5>
            <ul className="space-y-2 text-sm text-default-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Print the QR code on product packaging, flyers, and business
                  cards
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Share branded QR code on your social media profiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Use in digital ads and email campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Minimum print size: 2cm x 2cm for reliable scanning</span>
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
