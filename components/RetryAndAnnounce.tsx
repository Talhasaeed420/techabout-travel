"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LIVE_MESSAGE_ID } from "../app/constants";
import { TEXT } from "../app/text";
import Button from "./ui/Button";

// Loads the same URL again, so the search and filters stay as they are
export function RetryButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button disabled={isPending} onClick={() => startTransition(() => router.refresh())}>
      {isPending ? TEXT.retry.busy : TEXT.retry.button}
    </Button>
  );
}

// Writes a message into the hidden box in layout.tsx so screen readers say it out loud
export function Announce({ text }: { text: string }) {
  useEffect(() => {
    const box = document.getElementById(LIVE_MESSAGE_ID);
    if (box) box.textContent = text;
  }, [text]);

  return null;
}
