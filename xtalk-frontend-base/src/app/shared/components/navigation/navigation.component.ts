import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { SearchService} from '@/_servies/';
import {PageconfigService} from '@/_servies/pageconfig.service';  
import {CallService} from '@/_servies/call.service';
import { AuthenticationService} from '@/_servies/authentication.service';

import { Config} from '@/_models';
import { first } from 'rxjs/operators';
import {  User} from '@/_models';
import { Router} from '@angular/router';
import { Subject} from 'rxjs';
import {environment} from 'environments/environment'
import { Location } from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
declare var $:any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  user:User;
  pageConfig;
  timer:number=0;
  isShowModal:boolean=false;
  baseUrl=environment.apiUrl;
  results: object[];
  searchTerm$ = new Subject<string>();
  actiionProfile:boolean=false;
  acitveToggleMenu:boolean=false;
  @ViewChild('toggleMenu',{static:true}) toggleMenu:ElementRef;
  @ViewChild('rightHeader',{static:true}) rightHeader:ElementRef;

  public languageOptions: any;
  public selectedLanguage: any;

  constructor(private authentication :AuthenticationService,
    private callService:CallService,private searchService:SearchService,private pageConfigService:PageconfigService,private location:Location,
    private router:Router,public _translateService: TranslateService) { 
      this._translateService.setDefaultLang('en');
      this._translateService.addLangs(['en', 'fr', 'de', 'pt', 'sp','ru', 'it', 'ur', 'zh', 'ja', 'bn', 'id', 'hi', 'ar' ]);
      if(this._translateService.currentLang === undefined) {
        this._translateService.use(this._translateService.getBrowserLang());
      } 

      this.languageOptions= {
          en: { title: 'EN', flag: 'gb'},
          fr: { title: 'FR', flag: 'fr'},
          de: { title: 'DE', flag: 'de'},
          pt: { title: 'PT', flag: 'pt'},
          sp: { title: 'ES', flag: 'es'},
          ru: { title: 'RU', flag: 'ru'},
          it: { title: 'IT', flag: 'it'},
          ur: { title: 'UR', flag: 'pk'},
          zh: { title: 'ZH', flag: 'cn'},
          ja: { title: 'JP', flag: 'jp'},
          bn: { title: 'BN', flag: 'bd'},
          id: { title: 'ID', flag: 'id'},
          ar: { title: 'AR', flag: 'ae'},
          hi: { title: 'IN', flag: 'in'},
      }

      this.searchTerm$.subscribe(inputData => {
      });
      this.searchService.search(this.searchTerm$).subscribe(results => {
          this.results = results.data;
      });
      this.pageConfigService.currentConfig.subscribe(data=>{
        if(data !=null)
        {
          this.pageConfig=data;
        }
        else
        {
          this.pageConfig = new Config();
        }
      })
      
    }

  ngOnInit() {
    this.callService.remainingTime$.subscribe(data=>{
      if(data <=0)
      {
        this.timer=0;
      }
      else
      {
        this.timer=data;
      }
    },
    err=>{
      this.timer=0;
    })
    this.user= this.authentication.currentUserValue;
  }
  
  showAction(){
    this.actiionProfile=!this.actiionProfile;
  }

  logout(){
    this.authentication.logout();
   // this.location.back();
    //this.router.navigate(['/']);
  }
  ngAfterViewInit(){
    // $('.toggle-menu').click(function(){
    //   $('.right-header').toggleClass('active');
    //   $(this).toggleClass('active');
    // });
    // this.toggleMenu.nativeElement.on('click',(event)=>{
    //   this.rightHeader.nativeElement.classList.add('active');
    //   //$(this).toggleClass('active');
    //   this.acitveToggleMenu=!this.acitveToggleMenu;
    // })

    // $('.toogle-chat').click(function(){
    //   $('.chat-main').toggleClass('active');
    //   $(this).toggleClass('active');
    // });

   
  }

  /**
   * Set the language
   *
   * @param language
   */
   setLanguage(language): void {
    // Set the selected language for the navbar on change
    this.selectedLanguage = language;

    // Use the selected language id for translations
    this._translateService.use(language);
  }

 
}
