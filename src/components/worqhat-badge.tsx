import { Button } from "@/components/ui/button";

export function BrandingBadge() {
  return (
    <div className="w-full z-[99]">
      <Button
        onClick={() => window.open("https://worqhat.com", "_blank")}
        className="bg-white text-gray-600 text-xs rounded-b-none px-2 hover:bg-gray-200 border border-gray-200 border-b-0
                      dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:border-neutral-700 z-[99]"
      >
        <img src="/worqhat-icon.png" alt="WorqHat" className="h-4 w-4" />
        <span className="hidden sm:inline ml-2">Made with WorqHat</span>{" "}
      </Button>
    </div>
  );
}
