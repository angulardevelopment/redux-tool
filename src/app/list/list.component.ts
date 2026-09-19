import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { REMOVE_ALL_TODOS } from '../actions';
import { IAppState, ITodo } from '../store';
import { NgRedux } from '@angular-redux/store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [AsyncPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  todos: Observable<ITodo[]>;
  lastUpdate: Observable<Date | null>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private cdr: ChangeDetectorRef
  ) {
    this.todos = this.ngRedux.select<ITodo[]>('todos');
    this.lastUpdate = this.ngRedux.select<Date | null>('lastUpdate');
  }

  ngOnInit() {
  }

  clearTodos() {
    this.ngRedux.dispatch({ type: REMOVE_ALL_TODOS });
    this.cdr.markForCheck();
  }
}
