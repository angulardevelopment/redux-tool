import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, ITodo } from '../store';
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from '../actions';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  @select() todos;
  model: ITodo = {
    id: 0,
    description: '',
    responsible: '',
    priority: 'low',
    isCompleted: false,
  };
  constructor(private ngRedux: NgRedux<IAppState>) {}
  ngOnInit() {}
  onSubmit() {
    console.log('onSubmit');
    this.ngRedux.dispatch({ type: ADD_TODO, todo: this.model });
  }
  // means marked as checked
  toggleTodo(todo) {
    console.log(todo, 'toggleTodo');
    this.ngRedux.dispatch({ type: TOGGLE_TODO, id: todo.id });
  }
  removeTodo(todo) {
    console.log('removeTodo');

    this.ngRedux.dispatch({ type: REMOVE_TODO, id: todo.id });
  }
}
