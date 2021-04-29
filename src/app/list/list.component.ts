import { Component, OnInit } from '@angular/core';
import { REMOVE_ALL_TODOS } from '../actions';
import { IAppState } from '../store';
import { NgRedux, select } from '@angular-redux/store';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @select() todos;
  @select() lastUpdate;
  constructor(private ngRedux: NgRedux<IAppState>) { }
  ngOnInit() {
  }
  clearTodos() {
    this.ngRedux.dispatch({type: REMOVE_ALL_TODOS});
  }
}
