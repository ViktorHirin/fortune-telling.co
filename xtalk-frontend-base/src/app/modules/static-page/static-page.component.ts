import { Component, OnInit } from '@angular/core';
import {IArticle} from '@/_models/Interface/IArticle';
import { HttpClient } from '@angular/common/http';
import { environment} from 'environments/environment';
import { AlertService, PageconfigService } from '@/_servies';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.css']
})
export class StaticPageComponent implements OnInit {
  editorConfig = {
    placeholder: 'Type the content here!',
  };
  slug:string='how-to-call';
  constructor(
    private http:HttpClient,
    private alertService:AlertService,
    private route:Router,
    private pageService:PageconfigService,
    private router:ActivatedRoute,
  ) 
  {
    this.router.params.subscribe(params => {
      this.slug = params['id'];
      if(this.slug)
      {
        this.pageService.getStaticPage(this.slug).subscribe(res=>{
          this.article={
            _id:res.data._id,
            title:res.data.title,
            content:res.data.content,
            slug:res.data.slug,
          }
        })
      }
      else
      {
        this.article={
          _id:'',
          title:'',
          content:'',
          slug:'',
        }
      }
      }
      ); 

  }
  article: IArticle;
  ngOnInit() {
    
  }

  public ngOnSubmit()
  {
    this.article.slug=this.convertToSlug(this.article.title);  
      this.http.put<any>(`${environment.apiUrl}/api/backend/static-page/`,this.article).subscribe(data=>{
          this.alertService.success('Saved Success');
          this.route.navigate(['/dashboard/static-page']);
      },err=>{
          this.alertService.error('Failed');
      })
  }
 
  convertToSlug(text)
  {
   return  text.toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
  }


}

