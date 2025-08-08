"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocationOption {
  id: string;
  name: string;
}

interface Props {
  options: LocationOption[];
  value?: string;
  onChange: (id: string | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  showChip?: boolean;
}

export function LocationComboboxStatic({
  options,
  value,
  onChange,
  placeholder = "Chọn địa điểm",
  disabled,
  showChip = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const selected = React.useMemo(
    () => options.find((o) => o.id === value),
    [options, value]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled}
            >
              <span
                className={cn(
                  "flex items-center gap-2 truncate",
                  !selected && "text-muted-foreground"
                )}
              >
                <MapPin className="h-4 w-4" />
                {selected ? selected.name : placeholder}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
            <Command>
              <CommandInput placeholder="Tìm theo tên địa điểm..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
                <CommandGroup>
                  {options.map((o) => (
                    <CommandItem
                      key={o.id}
                      value={o.name}
                      onSelect={() => {
                        onChange(o.id);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">{o.name}</span>
                      <Check
                        className={cn(
                          "h-4 w-4 opacity-0",
                          value === o.id && "opacity-100"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => onChange(undefined)}
          disabled={disabled || !value}
          aria-label="Xóa địa điểm"
        >
          <X className="h-4 w-4" />
        </Button> */}
      </div>

      {showChip && selected && (
        <Badge variant="secondary" className="mt-1">
          {selected.name}
        </Badge>
      )}
    </div>
  );
}
