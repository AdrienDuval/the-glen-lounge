/**
 * La carte — transcribed from the venue's own four-page menu artwork
 * (Facebook, posted 2026-02-01; files `122122637{709,745,793,817}015607.jpg`
 * in `assets-raw/facebook/`).
 *
 * ⚠️ TWO THINGS TO SETTLE WITH THE CLIENT BEFORE LAUNCH
 *
 * 1. **The prices are février 2026.** Nothing published since restates them.
 *    They are almost certainly still broadly right, but a restaurant menu is
 *    the one place on a website where being out of date costs the venue money
 *    at the till. The page renders a dated note saying so.
 *
 * 2. **The artwork has real errors.** It is set with typos («SANWDWICH»,
 *    «FONDANT AN CHOCOLAT», «TEXAN BEFE BURGER»), lists a couple of dishes
 *    twice at different prices, and prints one price as «12 00FCFA».
 *    This file is transcribed from the *data*, not photocopied — the spelling
 *    is corrected, and anywhere the source is genuinely ambiguous the item
 *    carries a `query`. Run `pendingQueries()` to get the list to send them.
 *    Nothing has been silently invented: a `query` means "the source says
 *    something contradictory", never "we guessed".
 *
 * ⚠️ **There is no drinks list.** All four pages are food. For a lounge selling
 * cocktails and bottle service that is a conspicuous gap — see FACTS.md.
 */

export type MenuItem = {
  name: string;
  /** FCFA. `null` when the section header carries a single price for all. */
  price: number | null;
  /** Composition, as printed. */
  detail?: string;
  /** Set when the source artwork is contradictory. Surfaced, never guessed. */
  query?: string;
};

export type MenuSection = {
  id: string;
  title: { fr: string; en: string };
  /** Overrides per-item pricing, e.g. "all 1 000 FCFA". */
  flatPrice?: number;
  items: MenuItem[];
};

export const MENU: MenuSection[] = [
  {
    id: "entrees-froides",
    title: { fr: "Entrées froides", en: "Cold starters" },
    items: [
      { name: "Salade de crudités variées", price: 3500, detail: "Carotte, concombre, tomate, choux" },
      { name: "Salade de tomate au thon", price: 3000, detail: "Thon, tomate" },
      { name: "Salade tropicale", price: 4000, detail: "Ananas, tomate, maïs doux" },
      { name: "Tartare d’avocat et sa quenelle au thon", price: 4000, detail: "Avocat, thon, oignon, tomate" },
      { name: "Salade d’avocat nature", price: 3000 },
      { name: "Mille-feuille d’avocat aux crevettes", price: 4000 },
      {
        name: "Duo de saumon et capitaine fumé sur blinis",
        price: 5000,
        detail: "Saumon, capitaine fumé, citron, huile d’olive, vinaigrette balsamique",
      },
    ],
  },
  {
    id: "entrees-chaudes",
    title: { fr: "Entrées chaudes", en: "Hot starters" },
    items: [
      { name: "Soupe de poisson et ses croûtons", price: 4000, detail: "Fumet, miettes de poisson, pain" },
      { name: "Consommé de volaille aux vermicelles", price: 4000, detail: "Dés de poule, vermicelle" },
      { name: "Omelette", price: 3000 },
    ],
  },
  {
    id: "produits-de-mer",
    title: { fr: "Produits de mer", en: "Seafood" },
    items: [
      { name: "Bar entier grillé aux oignons confits", price: 7000, detail: "Oignon confit, citron, huile d’olive, anis" },
      { name: "Escalope de capitaine à la florentine", price: 8000, detail: "Épinard, oignons, crème fraîche, fromage" },
      { name: "Escalope de capitaine, sauce vierge", price: 7000 },
      { name: "Crevettes poêlées à l’ail et ciboulette", price: 7000, detail: "Huile d’olive, ail, ciboulette" },
      { name: "Sole grillée, beurre citronné", price: 7000, detail: "Beurre, persil, citron, anis vert" },
      {
        name: "Gambas royal",
        price: 12000,
        query:
          "The artwork prints « 12 00FCFA ». 12 000 is the only sensible reading against the rest of the seafood section, but confirm.",
      },
    ],
  },
  {
    id: "viandes",
    title: { fr: "Viandes & volailles", en: "Meat & poultry" },
    items: [
      { name: "Poulet grillé — ¼", price: 5000 },
      { name: "Poulet grillé — ½", price: 9000 },
      { name: "Poulet grillé — entier", price: 15000 },
      { name: "Poulet pané — ¼", price: 6500 },
      { name: "Poulet pané — ½", price: 12000 },
      { name: "Poulet DG — ½", price: 15000 },
      { name: "Poulet DG — entier", price: 20000 },
      { name: "Basquaise — ¼", price: 5000 },
      { name: "Yassa — ¼", price: 5000 },
      { name: "Plat de saucisse", price: 5000 },
      { name: "Plat de brochette", price: 3500 },
      { name: "Brochette de capitaine", price: 7000 },
      { name: "Côte de porc grillée à la moutarde à l’ancienne", price: 6000 },
      {
        name: "Filet de bœuf aux deux poivres de Penja",
        price: 6000,
        detail: "Poivre blanc et vert, crème fraîche, vin blanc sec",
      },
    ],
  },
  {
    id: "plats-locaux",
    title: { fr: "Plats locaux", en: "Local dishes" },
    items: [
      { name: "Kedjenou", price: 6000, detail: "Aubergine, courgette, oignon, tomate" },
      { name: "Ndolè sentimental", price: 5000, detail: "Au choix : poulet fumé, crevette ou bœuf" },
      { name: "Ndolè", price: 5000 },
      { name: "Ndolè royal", price: 7000, detail: "Bœuf & crevettes" },
      { name: "Queue de bœuf aux épices du pays", price: 5000 },
    ],
  },
  {
    id: "pates",
    title: { fr: "Pâtes", en: "Pasta" },
    items: [
      { name: "Spaghetti bolognaise", price: 3500, detail: "Bœuf haché, tomate, oignon" },
      { name: "Spaghetti napolitaine", price: 3500, detail: "Beurre, sauce tomate" },
      { name: "Penne arrabiata", price: 3500, detail: "Beurre, sauce tomate, basilic, piment doux" },
      { name: "Fusilli", price: 3500 },
      { name: "Tagliatelle carbonara", price: 6000, detail: "Crème, lardon, oignon" },
      {
        name: "Pâtes, sauce au choix",
        price: 5000,
        detail: "Bolognaise, arrabiata, napolitaine, carbonara ou fruits de mer à la crème",
        query:
          "The artwork lists this as a second « PENNE ARRABIATA » at 5 000 — same name as the 3 500 line but with a choose-your-sauce description. Read here as a separate choose-your-sauce dish. Confirm the name and price.",
      },
    ],
  },
  {
    id: "pizzas",
    title: { fr: "Pizzas", en: "Pizzas" },
    items: [
      { name: "Parfait", price: 6000, detail: "Poulet, poivron, mozzarella, tomate" },
      { name: "Végétarienne", price: 6500, detail: "Câpres, petits pois, épinards, tomate, mozzarella" },
      { name: "Canibale", price: 6000, detail: "Bolognaise, tomate, origan, mozzarella" },
      { name: "Regina", price: 6000, detail: "Jambon épaule, champignons, tomate, mozzarella" },
      { name: "Gamberitt", price: 6500, detail: "Écrevisses, ail, tomate, mozzarella" },
      { name: "Calzone", price: 6000, detail: "Jambon épaule, œuf, champignons, tomate, mozzarella" },
      { name: "Fromages", price: 7000, detail: "Bleu d’Auvergne, feta de vache, mozzarella, tomate" },
      { name: "Salroyale", price: 7500, detail: "Crème fraîche, lardon, pomme, œuf, mozzarella, oignon" },
      { name: "All America", price: 10000, detail: "Tomate, mozzarella, viande hachée, poulet, jambon, olive noire" },
    ],
  },
  {
    id: "petites-faims",
    title: { fr: "Petites faims", en: "Light bites" },
    items: [
      { name: "Mini-brochettes de bœuf & frites", price: 3500, detail: "Filet de bœuf, tomate, oignon, poivron" },
      { name: "Mini-brochettes de porc au kankan", price: 3500, detail: "Porc, pain, oignon, tomate, poivron vert" },
      { name: "Sandwich parisien", price: 3500, detail: "Jambon épaule, pain baguette, tomate" },
      { name: "Sandwich poulet & frites", price: 3500, detail: "Poulet de chair, pain baguette, tomate, oignon" },
      {
        name: "Texan burger de bœuf & frites",
        price: 3500,
        detail: "Viande hachée, pain hamburger, tomate, oignon",
        query:
          "The artwork lists this twice with identical composition — once at 3 500 and again, in English, at 4 000. Transcribed once at the lower price. Confirm which is right.",
      },
    ],
  },
  {
    id: "accompagnements",
    title: { fr: "Accompagnements", en: "Sides" },
    flatPrice: 1000,
    items: [
      { name: "Frites de pomme de terre", price: null },
      { name: "Frites de plantain", price: null },
      { name: "Riz pilaw", price: null },
      { name: "Pâtes alimentaires", price: null },
      { name: "Miondo", price: null },
      { name: "Pommes de terre rissolées", price: null },
      { name: "Légumes du jardin", price: null },
    ],
  },
  {
    id: "desserts",
    title: { fr: "Desserts", en: "Desserts" },
    items: [
      { name: "Assiette de fruits frais de saison", price: 2500 },
      { name: "Tarte fine au citron", price: 2500 },
      { name: "Fondant au chocolat", price: 3000 },
      { name: "Mousse au chocolat", price: 2500 },
      { name: "Crème brûlée", price: 2500 },
      { name: "Crêpe — 3 pièces", price: 2000 },
    ],
  },
];

/** ISO date of the source artwork. Rendered on the page as an honesty note. */
export const MENU_SOURCE_DATE = "2026-02-01";

/** Every unresolved source ambiguity, for the client-questions list. */
export function pendingQueries(): { section: string; item: string; query: string }[] {
  return MENU.flatMap((s) =>
    s.items
      .filter((i) => i.query)
      .map((i) => ({ section: s.title.fr, item: i.name, query: i.query as string }))
  );
}

/** « 12 000 » — FCFA convention is a space-separated thousands group. */
export function formatPrice(value: number): string {
  return value.toLocaleString("fr-FR").replace(/ | /g, " ");
}
