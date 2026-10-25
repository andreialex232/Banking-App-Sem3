export interface Country {
  readonly name: string;
  readonly postalPattern: RegExp;
  readonly currency?: string; // fill in once you share the currency map
}

export const COUNTRIES: readonly Country[] = [
  { name: 'Denmark', postalPattern: /^\d{4}$/ },
  { name: 'Sweden',  postalPattern: /^\d{3}\s?\d{2}$/ },
  { name: 'Poland',  postalPattern: /^\d{2}-\d{3}$/ },
];

export const COUNTRY_BY_NAME: ReadonlyMap<string, Country> =
  new Map(COUNTRIES.map(c => [c.name, c]));

export const COUNTRY_OPTIONS = COUNTRIES.map(c => ({ value: c.name, label: c.name }));