import React from 'react';

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Логотип «Дома и кровли»"
    >
      <defs>
        <linearGradient
          id="brandLogoGradOrange"
          x1="9.17997"
          y1="19.4032"
          x2="-16.1719"
          y2="-0.521445"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f83900" stopOpacity="1" />
          <stop offset="1" stopColor="#f83900" stopOpacity="0" />
        </linearGradient>

        <linearGradient
          id="brandLogoGradBlue"
          x1="27.0141"
          y1="31.7548"
          x2="12.0971"
          y2="-37.5581"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2eadff" stopOpacity="1" />
          <stop offset="1" stopColor="#2eadff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Левая часть дома/крыши с оранжевым градиентом */}
      <path
        style={{ display: 'inline', fill: 'url(#brandLogoGradOrange)', fillOpacity: 1 }}
        d="M 3.9642401,30.16092 3.8416347,15.162197 0.08173691,15.070544 5.993639,10.414444 6.0514357,5.245186 11.649212,5.3029827 16.336262,0.11559345 31.999999,15.530013 27.014049,15.284802 V 31.915709 L 3.9642401,32.040872 Z"
      />

      {/* Правая часть стрелы/крыши с синим градиентом */}
      <path
        style={{ display: 'inline', fill: 'url(#brandLogoGradBlue)', fillOpacity: 1 }}
        d="m 15.407407,32.040868 1.512133,-2.043423 0.04087,-14.950841 -4.618137,-0.04788 10.424361,-8.623244 9.315103,9.113665 -4.904215,-0.04087 0.08174,16.592592 z"
      />
    </svg>
  );
};
