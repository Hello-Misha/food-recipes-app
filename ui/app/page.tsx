import { Hero } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Найпопулярніші рецепти</h1>
          <p>
            Ось список наших найпопулярніших рецептів, які завоювали серця наших
            користувачів.
          </p>
        </div>
      </div>
    </main>
  );
}