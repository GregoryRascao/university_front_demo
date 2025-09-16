export default function HeroHeader() {
  return (
    <section className="bg-gradient-to-r from-[#004b93] via-[#004d95] to-[#003f7a] text-white min-h-[60vh] flex flex-col justify-center items-center px-6 text-center font-sans">
      <div className="absolute top-4 left-4">
        <img
          src="/ulb-logo.png"
          alt="Logo ULB"
          className="w-36 h-auto"
          aria-hidden="true"
        />
      </div>
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
        Bienvenue à l’Université Libre de Bruxelles
      </h1>
      <p className="text-lg max-w-xl mb-8 drop-shadow-md font-medium tracking-wide">
        Découvrez notre plateforme intuitive pour consulter les inscriptions, bulletins et rapports d’anomalies facilement.
      </p>
    </section>
  );
}
