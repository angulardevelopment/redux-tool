import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState, ITodo } from '../store';
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from '../actions';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [
    FormsModule,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  todos: Observable<ITodo[]>;

  model: ITodo = {
    id: 0,
    description: '',
    responsible: '',
    priority: 'low',
    isCompleted: false,
  };

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private cdr: ChangeDetectorRef
  ) {
    this.todos = this.ngRedux.select<ITodo[]>('todos');
  }

  ngOnInit() {}

  onSubmit() {
    if (!this.model.description || !this.model.description.trim()) {
      return;
    }
    this.ngRedux.dispatch({ type: ADD_TODO, todo: { ...this.model } });
    this.model = {
      id: 0,
      description: '',
      responsible: '',
      priority: 'low',
      isCompleted: false,
    };
    this.cdr.markForCheck();
  }

  // means marked as checked
  toggleTodo(todo: ITodo) {
    this.ngRedux.dispatch({ type: TOGGLE_TODO, id: todo.id });
    this.cdr.markForCheck();
  }

  removeTodo(todo: ITodo) {
    this.ngRedux.dispatch({ type: REMOVE_TODO, id: todo.id });
    this.cdr.markForCheck();
  }
}
