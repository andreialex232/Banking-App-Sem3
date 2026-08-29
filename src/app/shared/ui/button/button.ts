import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  standalone: true,
  template: ` <p>button works!</p> `,
  styles: ``,
})
export class Button {}
