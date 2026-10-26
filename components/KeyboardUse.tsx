"use client";

import { useEffect } from "react";

const CONTROLS = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])";
const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

// Keyboard support for the whole page (no mouse needed).
// Tab and the arrow keys move between the buttons and fields and wrap around, so focus never jumps out to the browser address bar.
// If a dialog is open, only the controls inside it are used. When the mouse is used again the keyboard look is switched off.
export default function KeyboardUse() {
  useEffect(() => {
    function getControls(): HTMLElement[] {
      const area = document.querySelector("dialog[open]") || document;
      const all = Array.from(area.querySelectorAll<HTMLElement>(CONTROLS));
      return all.filter((element) => element.getClientRects().length > 0); // skip hidden ones
    }

    // Some fields need the arrow keys for themselves
    function needsArrows(element: HTMLElement, key: string): boolean {
      if (element.tagName === "SELECT") return key === "ArrowUp" || key === "ArrowDown"; // up and down change the option, left and right move on
      return element instanceof HTMLInputElement && element.type === "date"; // arrows change the day, month and year
    }

    function onKeyDown(event: KeyboardEvent) {
      const isTab = event.key === "Tab";
      if (!isTab && !ARROWS.includes(event.key)) return;
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      document.body.classList.add("using-keyboard");

      const current = document.activeElement as HTMLElement;
      if (!isTab && needsArrows(current, event.key)) return;

      const controls = getControls();
      if (controls.length === 0) return;
      event.preventDefault(); // stops the browser from taking the focus away

      const goBack = isTab ? event.shiftKey : event.key === "ArrowUp" || event.key === "ArrowLeft";
      const index = controls.indexOf(current);

      // past the last one goes to the first, and the other way round
      let next = controls[(index + (goBack ? -1 : 1) + controls.length) % controls.length];
      if (index === -1) next = goBack ? controls[controls.length - 1] : controls[0];
      next.focus();
    }

    const mouseUsed = () => document.body.classList.remove("using-keyboard");

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", mouseUsed);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", mouseUsed);
    };
  }, []);

  return null;
}
