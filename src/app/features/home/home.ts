import { Component } from '@angular/core';
import { Hero } from './components/hero/hero';
import { CardsShowcase } from './components/cards-showcase/cards-showcase';
import { Plans } from "./components/plans/plans";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, CardsShowcase, Plans],
  template: `
<div class="flex flex-col gap-20 sm:gap-40">
    <app-hero></app-hero>
    <app-cards-showcase [threshold]=".7" class="sm:mb-20 lg:mb-0"></app-cards-showcase>
    <app-plans [threshold]=".1.15" ></app-plans>
</div>
  `,
  styles: ``,
})
export class Home {}
