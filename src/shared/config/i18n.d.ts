/**
 * Augment react-i18next's `Resources` type so that `t('home.start')` and
 * all other translation keys are type-checked at compile time.
 *
 * Consumers must import `i18n` (or any i18next-aware hook like `useTranslation`)
 * for these types to apply — no extra runtime import needed here.
 */

import type en from './locales/en.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    /**
     * Bind the default namespace to the English locale shape.
     * TypeScript will error if a key used in `t(...)` does not exist here.
     */
    defaultNS: 'translation';
    resources: {
      translation: typeof en;
    };
  }
}
