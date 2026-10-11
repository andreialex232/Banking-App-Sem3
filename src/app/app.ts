import { Component, signal, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
    protected readonly title = signal('advjs');
    private main = viewChild.required<ElementRef<HTMLElement>>('main');

    constructor() {
        let lastSection: string | null = null;
        inject(Router).events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntilDestroyed())
        .subscribe(e => {
            const section = e.urlAfterRedirects.split(/[?#]/)[0].split('/').slice(1, 3).join('/');
            if (lastSection !== null && section !== lastSection) {
                setTimeout(() => (document.querySelector<HTMLElement>('main h1[tabindex]') ?? this.main().nativeElement).focus());
            }
            lastSection = section;
        });
    }

      protected skipToMain(event: Event) {
        event.preventDefault(); // with <base href="/">, a plain "#main" link would navigate to the home page
        this.main().nativeElement.focus();
    }
}
