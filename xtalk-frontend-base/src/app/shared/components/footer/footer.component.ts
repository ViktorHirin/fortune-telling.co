import {Component, OnInit} from '@angular/core';
import {PageconfigService} from '@/_servies/pageconfig.service';
import {NewsLetterService} from '@/_servies/newsLetter.service';
import {AuthenticationService} from '@/_servies/authentication.service';
import {AlertService} from '@/_servies/alert.service';
import {IArticle} from '@/_models/Interface/IArticle';
import {User} from '@/_models';
import {Router} from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  pageConfig;
  user: User;
  isShowModal: boolean = false;
  listStaticPage: IArticle[] = [];
  actiionProfile: boolean = false;
  emailNewsLetter = '';
  constructor(private pageConfigService: PageconfigService,
    private router: Router,
    private newsLetter: NewsLetterService,
    private alertService:AlertService,
    private authentication: AuthenticationService
  ) {
    this.user = this.authentication.currentUserValue;
    this.pageConfigService.currentConfig.subscribe(data => {
      if (data) {
        this.pageConfig = data;
      }
    })
    this.pageConfigService.getListStaticPage().subscribe(response => {
      response.data.forEach(pageItem => {
        this.listStaticPage.push(pageItem);
      });

    })

  }
  registerNewLetter() {
    if(this.validateEmail(this.emailNewsLetter)){
      this.newsLetter.register(this.emailNewsLetter).subscribe(response => {
        this.alertService.success('Congratulations!');
      },(err)=>{
      
          this.alertService.error(err);
      });
    }
    else{
      this.alertService.error("Email not valid.");
    }
  }


  ngOnInit() {

  }
   validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

}
