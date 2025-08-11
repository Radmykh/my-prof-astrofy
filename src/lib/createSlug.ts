// createSlug.ts
// Adapted from https://equk.co.uk/2023/02/02/generating-slug-from-title-in-astro/

import { GENERATE_SLUG_FROM_TITLE } from '../config'

// Мапінг кириличних символів → латиниця
const cyrillicMap: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd',
  е: 'e', є: 'ye', ж: 'zh', з: 'z', и: 'y', і: 'i',
  ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
  ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
  ь: '', ю: 'yu', я: 'ya',
  // великі літери теж (щоб не зникали при toLowerCase на етапі трансліту)
  А: 'a', Б: 'b', В: 'v', Г: 'h', Ґ: 'g', Д: 'd',
  Е: 'e', Є: 'ye', Ж: 'zh', З: 'z', И: 'y', І: 'i',
  Ї: 'yi', Й: 'y', К: 'k', Л: 'l', М: 'm', Н: 'n',
  О: 'o', П: 'p', Р: 'r', С: 's', Т: 't', У: 'u',
  Ф: 'f', Х: 'kh', Ц: 'ts', Ч: 'ch', Ш: 'sh', Щ: 'shch',
  Ь: '', Ю: 'yu', Я: 'ya'
}

function transliterate(text: string): string {
  return text
    .split('')
    .map(char => cyrillicMap[char] ?? char)
    .join('')
}

export default function createSlug(title: string, staticSlug: string) {
  return !GENERATE_SLUG_FROM_TITLE
    ? staticSlug
    : transliterate(title) // 🔹 Спочатку транслітерація кирилиці
        .trim() // 1. Прибираємо пробіли на початку/кінці
        .toLowerCase() // 2. До нижнього регістру
        .replace(/\s+/g, '-') // 3. Пробіли → дефіси
        .replace(/[^\w-]/g, '') // 4. Видаляємо все, крім букв/цифр/дефісів
        .replace(/^-+|-+$/g, '') // 5. Прибираємо дефіси на краях
}
