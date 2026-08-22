import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, INITIAL_STATE, rootReducer } from './store';
import { FormsModule } from '@angular/forms';
@NgModule(/* TODO(standalone-migration): clean up removed NgModule class manually. 
{
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgReduxModule,
        ListComponent,
        TodoListComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
} */)
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
}

}
