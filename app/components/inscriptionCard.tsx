import { useEffect, useState } from "react";
import { Bulletin, Inscription } from "../types/inscription.type";

export default function InscriptionsCards() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Inscription[]>([]);

  useEffect(() => {
    setFiltered(inscriptions);
  }, [inscriptions]);

  function handleSearch() {
    const term = query.toLowerCase();
    setFiltered(
      inscriptions.filter(
        (insc) =>
          insc.nom.toLowerCase().includes(term) ||
          insc.prenom.toLowerCase().includes(term) ||
          insc.matricule.toLowerCase().includes(term) ||
          JSON.parse(insc.cours_json).some((cours: string) =>
            cours.toLowerCase().includes(term)
          )
      )
    );
  }

  useEffect(() => {
    handleSearch();
  }, [query, inscriptions]);

  useEffect(() => {
    Promise.all([
      fetch("/api/SimpleQuery/inscriptions").then((res) => res.json()),
      fetch("/api/SimpleQuery/notes").then((res) => res.json()),
      fetch("/api/SimpleQuery/cours").then((res) => res.json()),
      fetch("/api/bulletin-anomalies/bulletins").then((res) => res.json()),
    ])
      .then(([inscData, , , bullData]) => {
        setInscriptions(Array.isArray(inscData) ? inscData : []);
        setBulletins(Array.isArray(bullData) ? bullData : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-[#004b93]">Chargement...</p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        {error}
      </p>
    );
  if (inscriptions.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">Aucune inscription disponible.</p>
    );

  // clé unique par inscription : matricule + année
  const makeKey = (insc: Inscription) => `${insc.matricule}-${insc.annee_etude}`;

  // Trouver bulletin correspondant à la clé
  const bulletinSelectionne = openKey
    ? bulletins.find((b) => `${b.matricule}-${b.annee}` === openKey)
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Recherche */}
      <div className="flex gap-3 max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Recherche nom, prénom, matricule ou cours..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 border border-[#c6dafc] rounded-2xl shadow-sm focus:outline-none focus:border-[#004b93] focus:ring-2 focus:ring-[#004b93]"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-[#004b93] text-white rounded-2xl font-semibold hover:bg-[#003f7a] transition"
        >
          Rechercher
        </button>
      </div>

      {/* Liste cards inscriptions */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 font-medium italic">
            Aucun résultat trouvé.
          </div>
        ) : (
          filtered.map((insc) => {
            const key = makeKey(insc);
            const isOpen = openKey === key;
            return (
              <div
                key={key}
                onClick={() => setOpenKey(isOpen ? null : key)}
                className={`relative cursor-pointer rounded-3xl border border-[#c6dafc] bg-white p-6 shadow-sm transition-transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#004b93]/40 ${
                  isOpen ? "ring-4 ring-[#004b93]/60" : ""
                }`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setOpenKey(isOpen ? null : key);
                  if (e.key === "Escape") setOpenKey(null);
                }}
                aria-expanded={isOpen}
                aria-controls={`card-details-${key}`}
              >
                <h2 className="text-[#004b93] text-2xl font-extrabold mb-1">
                  {insc.nom} {insc.prenom}
                </h2>
                <p className="text-[#004d95] font-semibold mb-1">
                  Matricule : {insc.matricule}
                </p>
                <p className="text-gray-700">Année : {insc.annee_etude}</p>
                <div className="mt-3">
                  <span className="font-semibold text-[#004b93]">Cours suivis :</span>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {JSON.parse(insc.cours_json).map((cours: string) => (
                      <li
                        key={cours}
                        className="rounded-full bg-[#c6dafc]/40 px-3 py-1 text-[#004d95] font-semibold text-xs"
                      >
                        {cours}
                      </li>
                    ))}
                  </ul>
                </div>
                {isOpen && (
                  <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#004b93] shadow-lg" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal détails bulletin */}
      {openKey && bulletinSelectionne && (
        <div
          className="fixed inset-0 z-50 bg-gray-100 bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpenKey(null)}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-xl w-full p-8 text-gray-900 font-sans outline-none"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <h3
              id="modal-title"
              className="text-2xl font-extrabold text-[#004b93] mb-4"
            >
              Bulletin de {bulletinSelectionne.nom} {bulletinSelectionne.prenom} ({bulletinSelectionne.annee})
            </h3>
            <p>
              <strong>ECTS inscrits:</strong> {bulletinSelectionne.ects_total_inscrits}
            </p>
            <p>
              <strong>ECTS obtenus:</strong> {bulletinSelectionne.ects_obtenus}
            </p>
            <p>
              <strong>Moyenne:</strong> {bulletinSelectionne.moyenne_ponderee ?? "N/A"}
            </p>
            <p>
              <strong>Réussite:</strong> {bulletinSelectionne.reussite ? "Oui" : "Non"}
            </p>
            <h4 className="mt-6 text-lg font-semibold text-[#004b93]">
              Détails des cours :
            </h4>
            <ul className="list-disc list-inside mt-2 text-gray-700 max-h-64 overflow-y-auto">
              {bulletinSelectionne.details.map((detail, i) => (
                <li key={i} className="mb-1">
                  {detail.intitule} ({detail.credit} ECTS) — {detail.titulaire} :{" "}
                  <b>{detail.note}</b>
                </li>
              ))}
            </ul>
            <button
              className="mt-8 px-6 py-2 bg-[#004b93] text-white font-semibold rounded-2xl hover:bg-[#003f7a] transition"
              onClick={() => setOpenKey(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

