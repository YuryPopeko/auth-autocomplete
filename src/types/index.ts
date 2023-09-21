type Continent = {
  code: string;
  name: string;
};

type Country = Continent & {
  native: string;
  phone: string;
  continent: string;
  capital: string;
  currency: string;
  languages: string;
};

type Language = Continent & {
  native: string;
  rtl: boolean;
};

export type Suggestions = {
  continents: Continent[];
  countries: Country[];
  languages: Language[];
};
