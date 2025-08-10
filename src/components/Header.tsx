// In Desktop Navigation buttons:
<button
  onClick={() => scrollToSection('who-we-are')}
  className="font-anton text-lg transition-colors duration-300 hover:text-[#ffbe4a] text-[#2a3747]"
>
  About
</button>

<button
  onClick={() => scrollToSection('what-our-clients-say')}
  className="font-anton text-lg transition-colors duration-300 hover:text-[#ffbe4a] text-[#2a3747]"
>
  Reviews
</button>

// In Mobile Menu:
<button
  onClick={() => {
    scrollToSection('who-we-are');
    setIsMobileMenuOpen(false);
  }}
  className="block font-anton text-lg text-[#2a3747] hover:text-[#ffbe4a] hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-lg mx-4 text-left w-[calc(100%-2rem)]"
>
  About
</button>

<button
  onClick={() => {
    scrollToSection('what-our-clients-say');
    setIsMobileMenuOpen(false);
  }}
  className="block font-anton text-lg text-[#2a3747] hover:text-[#ffbe4a] hover:bg-gray-50 transition-all duration-300 px-6 py-3 rounded-lg mx-4 text-left w-[calc(100%-2rem)]"
>
  Reviews
</button>
