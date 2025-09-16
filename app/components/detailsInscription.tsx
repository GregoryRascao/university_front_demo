import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Bulletin } from '../types/inscription.type';


export default function DetailInscription() {
  const router = useRouter();
  const { matricule } = router.query;

  const [bulletin, setBulletin] = useState<Bulletin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matricule) return;
    fetch('api/bulletin-anomalies/bulletins')
      .then(res => res.json())
      .then((data: Bulletin[]) => {
        const b = data.find(b => b.matricule === matricule);
        setBulletin(b || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [matricule]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  if (!bulletin) return <p className="text-center mt-10">Bulletin non trouvé.</p>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        {bulletin.nom} {bulletin.prenom} - Année {bulletin.annee}
      </h1>

      <section className="mb-6">
        <p><strong>ETS total inscrits :</strong> {bulletin.ects_total_inscrits}</p>
        <p><strong>ETS obtenus :</strong> {bulletin.ects_obtenus}</p>
        <p><strong>Moyenne pondérée :</strong> {bulletin.moyenne_ponderee ?? 'N/A'}</p>
        <p><strong>Réussite :</strong> {bulletin.reussite ? 'Oui' : 'Non'}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Détails des cours</h2>
        <ul className="list-disc list-inside">
          {bulletin.details.map((detail, i) => (
            <li key={i}>
              {detail.intitule} ({detail.credit} crédits) — {detail.titulaire} : <strong>{detail.note}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
