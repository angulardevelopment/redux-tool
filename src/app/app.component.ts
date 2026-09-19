import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState, INITIAL_STATE, rootReducer } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'redux';

  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
