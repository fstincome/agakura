import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

type Dict = Record<string, { fr: string; en: string }>;

export const dict = {
  "nav.home": { fr: "Accueil", en: "Home" },
  "nav.about": { fr: "À propos", en: "About" },
  "nav.team": { fr: "Équipe", en: "Team" },
  "nav.projects": { fr: "Projets", en: "Projects" },
  "nav.news": { fr: "Actualités", en: "News" },
  "nav.contact": { fr: "Contact", en: "Contact" },
  "nav.admin": { fr: "Admin", en: "Admin" },
  "nav.login": { fr: "Connexion", en: "Login" },
  "brand.tagline": {
    fr: "ONG de développement communautaire & d'autonomisation des jeunes au Burundi",
    en: "Community Development & Youth Empowerment NGO in Burundi",
  },
  "hero.eyebrow": { fr: "Agakura Jeunesse Providence", en: "Agakura Jeunesse Providence" },
  "hero.title": {
    fr: "Programmes d'éducation et de sensibilisation à la santé",
    en: "Education and Health Awareness Programs",
  },
  "hero.body": {
    fr: "Centre communautaire de santé et nutrition (Makebuko, Gitega) : un centre en développement qui soutient la santé et la nutrition des familles. Accès à l'assurance maladie : appui aux familles vulnérables pour obtenir une couverture santé.",
    en: "Community Health & Nutrition Center (Makebuko, Gitega): A developing center supporting family health and nutrition. Access to Medical Insurance: Assistance for vulnerable families to obtain health insurance coverage.",
  },
  "hero.cta": { fr: "Découvrir nos projets", en: "Discover our projects" },
  "hero.cta2": { fr: "Nous contacter", en: "Contact us" },
  "stats.dev": { fr: "Développement communautaire", en: "Community Development" },
  "stats.dev.sub": { fr: "Autonomisation des jeunes", en: "Youth Empowerment" },
  "stats.avail": { fr: "Disponible 24/7", en: "24/7 Available" },
  "stats.hq": { fr: "Siège social", en: "Headquarters" },
  "stats.hq.sub": { fr: "Makebuko, Gitega", en: "Makebuko, Gitega" },
  "legal.title": { fr: "Reconnaissance légale & conformité", en: "Legal recognition & Compliance" },
  "legal.body": {
    fr: "AGAKURA Jeunesse Providence est une ONG légalement reconnue au Burundi. Agréée par Ordonnance Ministérielle N° 530/170 du 15 mai 1995, et opérant en stricte conformité avec la loi sur les Associations Sans But Lucratif, agrément N° 530/1786/CAB/2018.",
    en: "AGAKURA Jeunesse Providence is a legally recognized NGO in Burundi. Approved under Ministerial Order No. 530/170 of 15 May 1995, and strictly operating in conformity with the Non-Profit Making Organization Act Approval No. 530/1786/CAB/2018.",
  },
  "legal.tag1": { fr: "Établie en 1995", en: "Established 1995" },
  "legal.tag2": { fr: "ONG locale certifiée", en: "Certified Local NGO" },
  "core.eyebrow": { fr: "Ce que nous faisons", en: "What We Do" },
  "core.title": { fr: "Nos domaines clés", en: "Our core domains" },
  "core.youth.t": { fr: "Autonomisation des jeunes", en: "Youth Empowerment" },
  "core.youth.b": {
    fr: "Formation professionnelle en compétences agricoles et non agricoles pour aider les diplômés à lancer de petites entreprises et garantir une résilience à long terme.",
    en: "Vocational training in agricultural and non-agricultural skills to help graduates start small businesses and ensure long-term resilience.",
  },
  "core.women.t": { fr: "Inclusion économique des femmes", en: "Women's Economic Inclusion" },
  "core.women.b": {
    fr: "Autonomiser les femmes et les familles vulnérables grâce à des activités génératrices de revenus, à l'éducation financière et à des programmes d'inclusion durables.",
    en: "Empowering women and vulnerable families through income-generating activities, financial literacy, and sustainable inclusion programs.",
  },
  "core.env.t": { fr: "Préservation de l'environnement", en: "Environmental Preservation" },
  "core.env.b": {
    fr: "Mettre en œuvre des initiatives qui favorisent la restauration écologique et l'utilisation durable des terres pour protéger le patrimoine naturel du Burundi.",
    en: "Implementing initiatives that promote ecological restoration and sustainable land use to protect Burundi's natural heritage.",
  },
  "projects.eyebrow": { fr: "Nos projets", en: "Our projects" },
  "projects.title": { fr: "Nos projets à impact", en: "Our impact projects" },
  "projects.details": { fr: "Détails", en: "Details" },
  "voices.title": { fr: "Voix de la communauté", en: "Community Voices" },
  "contact.title": { fr: "Contactez-nous", en: "Contact us" },
  "contact.sub": {
    fr: "Une question, un partenariat, un don ? Écrivez-nous, nous répondons sous 48h.",
    en: "A question, a partnership, a donation? Write to us, we reply within 48 hours.",
  },
  "contact.name": { fr: "Nom complet", en: "Full name" },
  "contact.email": { fr: "Email", en: "Email" },
  "contact.subject": { fr: "Sujet", en: "Subject" },
  "contact.message": { fr: "Message", en: "Message" },
  "contact.send": { fr: "Envoyer", en: "Send message" },
  "contact.sent": { fr: "Message envoyé. Merci !", en: "Message sent. Thank you!" },
  "footer.rights": { fr: "Tous droits réservés.", en: "All rights reserved." },
  "about.title": { fr: "À propos d'AGAKURA", en: "About AGAKURA" },
  "about.body": {
    fr: "Depuis 1995, AGAKURA Jeunesse Providence œuvre à Makebuko (Gitega) pour le développement communautaire, l'autonomisation des jeunes et l'inclusion des femmes au Burundi. Notre approche allie formation, santé, environnement et résilience économique.",
    en: "Since 1995, AGAKURA Jeunesse Providence has worked in Makebuko (Gitega) for community development, youth empowerment and women's inclusion in Burundi. Our approach combines training, health, environment and economic resilience.",
  },
  "about.mission": { fr: "Notre mission", en: "Our mission" },
  "about.mission.b": {
    fr: "Bâtir une jeunesse autonome, des familles en bonne santé et des communautés résilientes.",
    en: "Build self-reliant youth, healthy families and resilient communities.",
  },
  "about.vision": { fr: "Notre vision", en: "Our vision" },
  "about.vision.b": {
    fr: "Un Burundi rural où chaque jeune et chaque femme accède aux opportunités économiques et à la santé.",
    en: "A rural Burundi where every young person and woman has access to economic opportunities and health.",
  },
  "about.values": { fr: "Nos valeurs", en: "Our values" },
  "about.values.b": {
    fr: "Intégrité, solidarité, transparence, durabilité et respect des bénéficiaires.",
    en: "Integrity, solidarity, transparency, sustainability and respect for beneficiaries.",
  },
  "team.title": { fr: "Notre équipe", en: "Our team" },
  "team.sub": {
    fr: "Une équipe dévouée au service des communautés depuis 1995.",
    en: "A dedicated team serving communities since 1995.",
  },
  "news.title": { fr: "Actualités", en: "News" },
  "news.sub": { fr: "Dernières nouvelles et publications.", en: "Latest stories and updates." },
  "news.empty": { fr: "Aucune actualité pour l'instant.", en: "No news yet." },
  "projects.page.sub": {
    fr: "Découvrez les initiatives qui transforment des vies au quotidien.",
    en: "Discover the initiatives transforming lives every day.",
  },
  "admin.title": { fr: "Tableau de bord admin", en: "Admin dashboard" },
  "admin.logout": { fr: "Se déconnecter", en: "Sign out" },
  "auth.title": { fr: "Connexion administrateur", en: "Admin login" },
  "auth.sub": { fr: "Accès réservé à l'équipe AGAKURA.", en: "Restricted to the AGAKURA team." },
  "auth.signin": { fr: "Se connecter", en: "Sign in" },
} satisfies Dict;

type Key = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "fr",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved === "fr" || saved === "en") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k: Key) => dict[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
