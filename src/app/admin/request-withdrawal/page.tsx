"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WithdrawalContainer() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/admin/request-withdrawal/request-table")}
    >
      Table
    </Button>
  );
}
