"use client";

import { useEffect } from "react";

const CONTROLS = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])";
const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

// Keyboard support for the whole page (no mouse needed).
// Tab and the four arrow keys move between the controls and wrap around, so focus never leaves the page.
// A dropdown only opens when you press Enter or Space. While its list is open, the arrow keys choose an option.
export default function KeyboardUse() {
  useEffect(() => {
    let dropdownOpen = false; // true while a dropdown list is open

    function getControls(): HTMLElement[] {
      const area = document.querySelector("dialog[open]") || document;
      const all = Array.from(area.querySelectorAll<HTMLElement>(CONTROLS));
      return all.filter((element) => element.getClientRects().length > 0); // skip hidden ones
    }

    // Opens the dropdown list. Returns false if this browser can't do it.
    function openDropdown(select: HTMLSelectElement): boolean {
      const picker = select as HTMLSelectElement & { showPicker?: () => void };
      if (typeof picker.showPicker !== "function") return false;
      try {
        picker.showPicker();
        return true;
      } catch {
        return false;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const current = document.activeElement as HTMLElement;

      // Enter or Space on a dropdown opens it. Pressed again, they pick the highlighted option.
      if (current instanceof HTMLSelectElement && (event.key === "Enter" || event.key === " ")) {
        if (dropdownOpen) {
          dropdownOpen = false;
          return;
        }
        if (openDropdown(current)) {
          event.preventDefault();
          dropdownOpen = true;
        }
        return;
      }

      if (event.key === "Escape") {
        dropdownOpen = false;
        return;
      }

      const isTab = event.key === "Tab";
      if (!isTab && !ARROWS.includes(event.key)) return;
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      // while a dropdown list is open the arrow keys belong to the list
      if (dropdownOpen && !isTab) return;
      dropdownOpen = false;

      document.body.classList.add("using-keyboard");

      // a date field uses the arrow keys to change the day, month and year
      if (!isTab && current instanceof HTMLInputElement && current.type === "date") return;

      const controls = getControls();
      if (controls.length === 0) return;
      event.preventDefault(); // stops the browser from taking the focus away, or changing a closed dropdown

      const goBack = isTab ? event.shiftKey : event.key === "ArrowUp" || event.key === "ArrowLeft";
      const index = controls.indexOf(current);

      // past the last one goes to the first, and the other way round
      let next = controls[(index + (goBack ? -1 : 1) + controls.length) % controls.length];
      if (index === -1) next = goBack ? controls[controls.length - 1] : controls[0];
      next.focus();
    }

    // a click on a dropdown opens its list. A click anywhere else closes it.
    function onMouseDown(event: MouseEvent) {
      document.body.classList.remove("using-keyboard");
      dropdownOpen = event.target instanceof HTMLSelectElement;
    }

    const onFocusOut = () => {
      dropdownOpen = false;
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return null;
}