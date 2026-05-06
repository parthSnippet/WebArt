const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] gap-6">
      {/* Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-20 h-20 border-4 border-soft-cream border-t-luxury-gold rounded-full animate-spin"></div>
        
        {/* Inner Ring */}
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-soft-cream border-t-mehndi-green rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <p className="text-mehndi-green font-semibold text-lg mb-2">Loading...</p>
        <div className="flex gap-2 justify-center">
          <span className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-mehndi-green rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
          <span className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
