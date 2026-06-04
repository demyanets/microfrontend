import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-c',
    templateUrl: './c.component.html',
    styleUrls: ['./c.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class CComponent {}
