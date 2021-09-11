import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { AuthenticationService} from '@/_servies/authentication.service';
import { User} from '@/_models'
//import {WindowRef} from '@/_servies/windowref.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  private user:User=new User();
   @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  constructor(private authentication:AuthenticationService) {
   }

  ngOnInit() {
    this.user=this.authentication.currentUserValue;;
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
    //   this.windowRef.nativeWindow.dispatchEvent(
    //     new Event('resize')
    //   );
    // }, 300);
    window.dispatchEvent(
      new Event('resize')
    );
  }, 300);

  }
}
