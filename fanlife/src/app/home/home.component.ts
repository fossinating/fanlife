import { Component, OnInit } from '@angular/core';
import { GameLogsService } from './gamelog/glogs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private glogService: GameLogsService) { }

  ngOnInit(): void {
  }

  nextBtn(): void {
    
  }

}
