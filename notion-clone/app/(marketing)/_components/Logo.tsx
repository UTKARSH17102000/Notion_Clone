import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        height="28"
        width="28"
        alt=""
        aria-hidden
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height="28"
        width="28"
        alt=""
        aria-hidden
        className="hidden dark:block"
      />
      <span className="text-[15px] font-semibold tracking-tight">Strata</span>
    </div>
  );
};
