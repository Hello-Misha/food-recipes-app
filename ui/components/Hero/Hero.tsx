"use client";

import Image from "next/image";
import { CustomButton } from "..";

const Hero = () => {
  const handleScroll = () => {};
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">Смакуйте Життя</h1>
        <p className="hero__subtitle">
          Тут ви знайдете сотні чудових рецептів. Вирушайте в захоплюючу
          кулінарну подорож разом з нами і дізнайтеся, як приготувати смачні та
          ситні страви.
        </p>
        <CustomButton
          title="До смаколиків"
          containerStyles="bg-primary-green text-white rounded-full mt-10"
          handleClick={handleScroll}
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image src="/hero.png" alt="hero" fill className="object-contain" />
        </div>
        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};

export default Hero;
