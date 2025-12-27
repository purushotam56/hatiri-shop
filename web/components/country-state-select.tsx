"use client";

import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";

import { buildApiUrl } from "@/config/api";

interface Country {
  name: string;
  isoCode: string;
}

interface State {
  name: string;
  isoCode: string;
}

interface CountryStateSelectProps {
  selectedCountryCode?: string;
  selectedStateCode?: string;
  onCountryChange: (countryCode: string) => void;
  onStateChange: (stateCode: string) => void;
  isDisabled?: boolean;
  countryLabel?: string;
  stateLabel?: string;
  countryPlaceholder?: string;
  statePlaceholder?: string;
}

export function CountryStateSelect({
  selectedCountryCode = "",
  selectedStateCode = "",
  onCountryChange,
  onStateChange,
  isDisabled = false,
  countryLabel = "Country",
  stateLabel = "State",
  countryPlaceholder = "Select country",
  statePlaceholder = "Select state",
}: CountryStateSelectProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [error, setError] = useState("");

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const url = buildApiUrl("/public/countries");
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();

        setCountries(data || []);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountryCode) {
      setStates([]);

      return;
    }

    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        setStates([]);
        onStateChange(""); // Clear state selection when country changes

        const url = buildApiUrl(`/public/state/${selectedCountryCode}`);
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch states");
        const data = await response.json();

        setStates(data || []);
      } catch (err) {
        console.error("Error fetching states:", err);
        setError("Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountryCode]); // Only depend on selectedCountryCode, not onStateChange

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2 bg-danger-50 text-danger rounded text-sm">
          {error}
        </div>
      )}

      <Select
        isDisabled={isDisabled || loadingCountries}
        isLoading={loadingCountries}
        label={countryLabel}
        placeholder={countryPlaceholder}
        selectedKeys={selectedCountryCode ? [selectedCountryCode] : []}
        onChange={(e) => onCountryChange(e.target.value)}
      >
        {countries.map((country) => (
          <SelectItem key={country.isoCode}>{country.name}</SelectItem>
        ))}
      </Select>

      <Select
        isDisabled={isDisabled || !selectedCountryCode || loadingStates}
        isLoading={loadingStates}
        label={stateLabel}
        placeholder={statePlaceholder}
        selectedKeys={selectedStateCode ? [selectedStateCode] : []}
        onChange={(e) => onStateChange(e.target.value)}
      >
        {states.map((state) => (
          <SelectItem key={state.isoCode}>{state.name}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
