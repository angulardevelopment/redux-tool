import { Component } from '@angular/core';
import { Toolbar, ToolbarWidget, ToolbarWidgetGroup } from '@angular/aria/toolbar';

@Component({
  selector: 'app-text-formatting-toolbar',
    imports: [Toolbar, ToolbarWidget, ToolbarWidgetGroup],
  templateUrl: './text-formatting-toolbar.html',
  styleUrl: './text-formatting-toolbar.scss',
})
export class TextFormattingToolbar {

}
