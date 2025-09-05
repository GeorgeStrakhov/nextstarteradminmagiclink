import { appConfig } from "@/lib/config.client";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold">{appConfig.name}</h1>
      <p className="mt-8 text-xl">{appConfig.description}</p>
    </div>
  );
}
