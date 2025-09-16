 export type Inscription = {
    matricule: string;
    nom: string;
    prenom: string;
    annee_etude: string;
    cours_json: string;
  };

  export type BulletinDetail = {
  mnemonique: any;
  intitule: string;
  credit: number;
  titulaire: string;
  note: string;
};

export type Bulletin = {
  matricule: any;
  nom: string;
  prenom: string;
  annee: string;
  ects_total_inscrits: number;
  ects_obtenus: number;
  moyenne_ponderee: number | null;
  reussite: boolean;
  details: BulletinDetail[];
};

export type Note = {
  id: number | undefined;
  matricule: string;
  mnemonique: string;
  note: number;
  inscription: Inscription;
  cours: Cours;
}

export type Cours = {
  mnemonique: string;
  intitule: string;
  credit: number;
  titulaire: string;
  notes: Note[];
}