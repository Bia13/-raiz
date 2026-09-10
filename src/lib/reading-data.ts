export type Verse = {
  number: number;
  text: string;
};

export const CURRENT_CHAPTER = {
  book: "Salmos",
  chapter: 23,
  heading: "O Senhor é o meu pastor",
  subheading: "Salmo de Davi",
  ref: "Salmos 23",
};

export const VERSES: Verse[] = [
  { number: 1, text: "O Senhor é o meu pastor; nada me faltará." },
  {
    number: 2,
    text: "Ele me faz repousar em pastos verdejantes e me conduz a águas tranquilas;",
  },
  {
    number: 3,
    text: "restaura a minha alma e me guia pelas veredas da justiça, por amor do seu nome.",
  },
  {
    number: 4,
    text: "Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
  },
  {
    number: 5,
    text: "Preparas um banquete para mim à vista dos meus inimigos. Unges a minha cabeça com óleo; o meu cálice transborda.",
  },
  {
    number: 6,
    text: "Sei que a bondade e o amor me seguirão todos os dias da minha vida, e voltarei à casa do Senhor enquanto eu viver.",
  },
];

export function verseRef(number: number) {
  return `${CURRENT_CHAPTER.book} ${CURRENT_CHAPTER.chapter}:${number}`;
}
