"use client";

import { Button } from "@/components/ui/button";

type Item = { label: string; value: string; icon?: React.ReactNode };

interface Props {
  items: Item[];
  onClick: (value: string) => void;
}

export default function NavButtons({ items, onClick }: Props) {
  return (
    <ul className="space-y-1">
      {items.map((it) => (
        <li key={it.value}>
          <Button className="flex items-center px-4 py-2 w-full" onClick={() => onClick(it.value)}>
            {it.icon}
            {it.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}