import { Component, OnInit } from '@angular/core';
import { DiaryService } from '../diary.service';
import { CalendarEvent, CalendarModule, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { subDays } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-view',
  imports:[CommonModule,FormsModule,CalendarModule],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(private diaryService: DiaryService) {}

  ngOnInit(): void {
    this.diaryService.getEntries().subscribe(entries => {
      this.events = entries.map((entry: { date: string | number | Date; title: any; }) => ({
        start: new Date(entry.date),
        title: entry.title,
        meta: entry
      }));
    });
  }

  changeView(view: CalendarView): void {
    this.view = view;
  }

  dayClicked({ day, sourceEvent }: { day: CalendarMonthViewDay; sourceEvent: MouseEvent | KeyboardEvent }): void {
    const clickedDate = day.date;
    const events = day.events;
  
    // Now you can handle clickedDate or events
    console.log('Clicked date:', clickedDate);
    console.log('Events on that day:', events);
  }
}
