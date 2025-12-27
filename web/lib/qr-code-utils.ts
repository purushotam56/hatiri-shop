/**
 * QR Code Utilities
 * Functions for generating and downloading QR codes
 */

import QRCode from "qrcode";

interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  logo?: {
    size?: number;
  };
  shape?: "square" | "rounded" | "dots";
}

/**
 * Generate QR code as data URL
 */
export const generateQRCodeDataURL = async (
  text: string,
  options?: QRCodeOptions,
): Promise<string> => {
  try {
    const qrOptions = {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || "#000000",
        light: options?.color?.light || "#FFFFFF",
      },
    };

    // For shaped QR codes, generate to canvas first
    if (options?.shape && options.shape !== "square") {
      const canvas = document.createElement("canvas");

      await QRCode.toCanvas(canvas, text, qrOptions);
      applyQRCodeShape(canvas, options.shape);

      return canvas.toDataURL("image/png");
    }

    return await QRCode.toDataURL(text, qrOptions);
  } catch (error) {
    // console.error("Error generating QR code:", error);
    throw error;
  }
};

/**
 * Generate QR code as canvas and add logo overlay
 */
export const generateQRCodeWithLogo = async (
  text: string,
  logoUrl?: string,
  options?: QRCodeOptions,
): Promise<string> => {
  try {
    // Generate base QR code
    const canvas = document.createElement("canvas");
    const qrOptions = {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || "#000000",
        light: options?.color?.light || "#FFFFFF",
      },
    };

    await QRCode.toCanvas(canvas, text, qrOptions);

    // Apply shape if specified
    if (options?.shape && options.shape !== "square") {
      applyQRCodeShape(canvas, options.shape);
    }

    // If no logo, return as is
    if (!logoUrl) {
      return canvas.toDataURL("image/png");
    }

    // Add logo to center of QR code
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could not get canvas context");

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const logoSize = options?.logo?.size || canvas.width * 0.25;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;

        // Draw white background for logo
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

        // Draw border
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 5, y - 5, logoSize + 10, logoSize + 10);

        // Draw logo
        ctx.drawImage(img, x, y, logoSize, logoSize);

        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        reject(new Error("Failed to load logo image"));
      };
      img.crossOrigin = "anonymous";
      img.src = logoUrl;
    });
  } catch (error) {
    // console.error("Error generating QR code with logo:", error);
    throw error;
  }
};

/**
 * Download QR code as PNG
 */
export const downloadQRCode = async (
  text: string,
  filename: string = "qrcode.png",
  logoUrl?: string,
  options?: QRCodeOptions,
): Promise<void> => {
  try {
    const dataUrl = logoUrl
      ? await generateQRCodeWithLogo(text, logoUrl, options)
      : await generateQRCodeDataURL(text, options);

    const link = document.createElement("a");

    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    // console.error("Error downloading QR code:", error);
    throw error;
  }
};

/**
 * Apply shape styling to QR code canvas
 */
export const applyQRCodeShape = (
  canvas: HTMLCanvasElement,
  shape: "square" | "rounded" | "dots" = "square",
): HTMLCanvasElement => {
  if (shape === "square") {
    // No changes needed for square - it's the default
    return canvas;
  }

  const imageData = canvas
    .getContext("2d")
    ?.getImageData(0, 0, canvas.width, canvas.height);

  if (!imageData) return canvas;

  const ctx = canvas.getContext("2d");

  if (!ctx) return canvas;

  const data = imageData.data;
  const pixelSize = 1; // Size of each QR module in pixels

  if (shape === "rounded") {
    // Draw rounded rectangles instead of squares
    ctx.fillStyle = imageData.data.toString(); // Preserve original colors
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Re-scan and redraw with rounded corners
    const moduleSize = canvas.width / Math.sqrt(data.length / 4);

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 128) {
        // If alpha > 0 (dark pixel)
        const pixelIndex = i / 4;
        const row = Math.floor(pixelIndex / (canvas.width / moduleSize));
        const col = pixelIndex % (canvas.width / moduleSize);
        const x = col * moduleSize;
        const y = row * moduleSize;

        // Draw rounded rectangle
        ctx.fillStyle = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
        const radius = moduleSize / 3;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + moduleSize - radius, y);
        ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + radius);
        ctx.lineTo(x + moduleSize, y + moduleSize - radius);
        ctx.quadraticCurveTo(
          x + moduleSize,
          y + moduleSize,
          x + moduleSize - radius,
          y + moduleSize,
        );
        ctx.lineTo(x + radius, y + moduleSize);
        ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
      }
    }
  } else if (shape === "dots") {
    // Draw circles instead of squares
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const moduleSize = canvas.width / Math.sqrt(data.length / 4);

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 128) {
        // If alpha > 0 (dark pixel)
        const pixelIndex = i / 4;
        const row = Math.floor(pixelIndex / (canvas.width / moduleSize));
        const col = pixelIndex % (canvas.width / moduleSize);
        const x = col * moduleSize + moduleSize / 2;
        const y = row * moduleSize + moduleSize / 2;

        // Draw circle
        ctx.fillStyle = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`;
        ctx.beginPath();
        ctx.arc(x, y, moduleSize / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  return canvas;
};

/**
 * Build store URL from unique code and domain
 */
export const buildStoreQRUrl = (
  organisationUniqueCode: string,
  domain?: string,
): string => {
  const webDomain =
    domain || process.env.NEXT_PUBLIC_WEB_DOMAIN || "localhost:3000";
  const code = organisationUniqueCode.toLowerCase();

  return `https://${code}.${webDomain}`;
};
