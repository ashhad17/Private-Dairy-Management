import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diary-view',
  templateUrl: './diary-view.component.html',
})
export class DiaryViewComponent implements OnInit {
  entry: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    // TODO: Replace with real backend fetch
    const savedEntries = JSON.parse(localStorage.getItem('entries') || '[]');
    this.entry = savedEntries.find((e: any) => e._id === id);
  }
}
