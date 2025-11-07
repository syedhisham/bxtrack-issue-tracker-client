import React from "react";

interface IllustrationContainerProps {
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

export const IllustrationContainer: React.FC<IllustrationContainerProps> = ({
  imageSrc,
  imageAlt = "Illustration",
  className = "",
}) => {
  return (
    <div className={`hidden md:flex md:w-1/2 lg:w-3/5 items-center justify-center relative overflow-hidden p-8 lg:p-12 ${className}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/40"></div>
      
      {/* Angled geometric shapes */}
      <div className="absolute top-0 right-0 w-full h-full">
        {/* Top-right angled shape */}
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-secondary/30 transform rotate-12 origin-top-right -translate-y-1/4 translate-x-1/4"></div>
        {/* Bottom-left angled shape */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-primary/40 transform -rotate-12 origin-bottom-left translate-y-1/4 -translate-x-1/4"></div>
        {/* Center diagonal shape */}
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[300px] bg-secondary/20 transform rotate-45 origin-center -translate-x-1/2 -translate-y-1/2"></div>
        {/* Top-left small angle */}
        <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-primary/30 transform rotate-45 origin-top-left"></div>
        {/* Bottom-right small angle */}
        <div className="absolute bottom-0 right-0 w-[350px] h-[250px] bg-secondary/25 transform -rotate-45 origin-bottom-right"></div>
      </div>
      
      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-auto max-h-[800px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

