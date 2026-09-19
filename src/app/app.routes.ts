import { TodoListComponent } from "./todo-list/todo-list.component";
import { ListComponent } from "./list/list.component";

import { Routes } from "@angular/router";
import { TextFormattingToolbar } from "./text-formatting-toolbar/text-formatting-toolbar";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'todo',
        pathMatch: 'full'
    },
    {
        path: 'todo',
        component: TodoListComponent
    },
    {
        path: 'list',
        component: ListComponent
    },
    {
        path: 'toolbar',
        component: TextFormattingToolbar
    }
]