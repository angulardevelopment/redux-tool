import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFormattingToolbar } from './text-formatting-toolbar';

describe('TextFormattingToolbar', () => {
  let component: TextFormattingToolbar;
  let fixture: ComponentFixture<TextFormattingToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFormattingToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextFormattingToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
