/* ============================================================
   LISTE DES CLIENTS — la seule chose à modifier dans admin/.
   (Fichier .js plutôt que .json pour que la page admin s'ouvre
   aussi en double-clic, sans serveur. Les commentaires et la
   virgule finale sont permis.)

   Après chaque génération, ajouter une entrée dans "clients"
   (dans le même commit que le dossier du client) :

     {
       slug: "aline-marc",            // nom du dossier dans clients/
       name: "Aline & Marc",          // nom affiché
       theme: "ivory-botanical-gold", // ivory-gold | ivory-botanical-gold
       languages: ["fr", "en"],       // ["fr"] | ["en"] | ["fr", "en"]
       created: "2026-11-19",         // AAAA-MM-JJ
     },

   Le lien public est construit automatiquement :
   baseUrl + "clients/" + slug + "/".
   ============================================================ */
window.CLIENTS = {
  baseUrl: "https://bavepictures-svg.github.io/Bavepictures-digital-invitation/",
  clients: [
    {
      slug: "yves-clarisse",
      name: "Yves & Clarisse",
      theme: "ivory-gold",
      languages: ["fr"],
      created: "2026-11-18",
    },
    {
      slug: "anzoiid-luna",
      name: "Anzoiid & Luna",
      theme: "ivory-botanical-gold",
      languages: ["fr", "en"],
      created: "2026-11-19",
    },
  ],
};
