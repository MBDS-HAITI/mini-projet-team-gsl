import { Outlet } from "react-router";

import logo from "@/assets/mbds.png";

export default function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex w-36 h-auto items-center justify-start">
                <img src={logo} alt="Logo MBDS" className="w-full h-full object-contain" />
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Outlet />
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://wallpapercave.com/wp/wp9700158.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
