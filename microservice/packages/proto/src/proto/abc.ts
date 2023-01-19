/* eslint-disable */

export const protobufPackage = "hello";

/** hero/hero.proto */

export interface HeroById {
  id: number;
}

export interface Hero {
  id: number;
  name: string;
}

export interface HeroesService {
  FindOne(request: HeroById): Promise<Hero>;
}
