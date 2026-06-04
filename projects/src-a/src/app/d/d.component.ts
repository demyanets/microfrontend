import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-d',
    templateUrl: './d.component.html',
    styleUrls: ['./d.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class DComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
