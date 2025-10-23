import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Zap, FileCode, RefreshCw, Clock, Plus } from "lucide-react";

export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryImpact?: string;
  icon?: string;
}

interface ServiceAddonsProps {
  addons: ServiceAddon[];
  selectedAddons: string[];
  onToggleAddon: (addonId: string) => void;
}

const iconMap: Record<string, any> = {
  zap: Zap,
  file: FileCode,
  refresh: RefreshCw,
  clock: Clock,
  plus: Plus,
};

export function ServiceAddons({ addons, selectedAddons, onToggleAddon }: ServiceAddonsProps) {
  const totalAddonsPrice = addons
    .filter(addon => selectedAddons.includes(addon.id))
    .reduce((sum, addon) => sum + addon.price, 0);

  if (addons.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Add-ons</CardTitle>
        <CardDescription>
          Enhance your order with these optional extras
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {addons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id);
          const Icon = iconMap[addon.icon || 'plus'];

          return (
            <div
              key={addon.id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                isSelected ? "border-primary bg-primary/5" : "hover-elevate"
              }`}
              data-testid={`addon-${addon.id}`}
            >
              <Checkbox
                id={addon.id}
                checked={isSelected}
                onCheckedChange={() => onToggleAddon(addon.id)}
                data-testid={`checkbox-addon-${addon.id}`}
              />
              
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={addon.id}
                  className="flex items-center gap-2 cursor-pointer font-medium"
                >
                  {Icon && <Icon className="h-4 w-4 text-primary" />}
                  {addon.name}
                  <Badge variant="outline" className="ml-auto">
                    +${addon.price.toLocaleString()}
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">
                  {addon.description}
                </p>
                {addon.deliveryImpact && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Clock className="h-3 w-3" />
                    {addon.deliveryImpact}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {totalAddonsPrice > 0 && (
          <div className="pt-4 border-t flex items-center justify-between">
            <span className="font-medium">Total Add-ons:</span>
            <span className="text-lg font-bold" data-testid="text-total-addons">
              +${totalAddonsPrice.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Default add-ons for services
export const defaultAddons: Omit<ServiceAddon, 'id' | 'serviceId'>[] = [
  {
    name: "Rush Delivery",
    description: "Receive your order 2-3 days faster",
    price: 500,
    deliveryImpact: "2-3 days faster",
    icon: "zap",
  },
  {
    name: "Source Files",
    description: "Get all editable source files (PSD, AI, Figma, etc.)",
    price: 200,
    icon: "file",
  },
  {
    name: "Extra Revision",
    description: "Add 2 more revision rounds",
    price: 150,
    icon: "refresh",
  },
  {
    name: "Priority Support",
    description: "Get faster responses and dedicated support",
    price: 100,
    icon: "clock",
  },
];
