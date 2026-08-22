import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TextFormattingToolbar } from './text-formatting-toolbar/text-formatting-toolbar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [ListComponent, TodoListComponent, TextFormattingToolbar]
})
export class AppComponent {
  title = 'redux';
}
