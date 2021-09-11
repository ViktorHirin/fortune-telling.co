import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { MyGalleryService } from '@/_servies/mygallery.service';
import { ModelService } from '@/_servies/model.service';
import { ReviewService } from '@/_servies/review.service';
import { AlertService } from '@/_servies/alert.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { first } from 'rxjs/operators';
import { Model, Gallery, User } from '@/_models';
import { callbackify } from 'util';
import { environment } from 'environments/environment';
declare const Twilio: any;
@Component({
  selector: 'app-my-gallery',
  templateUrl: './my-gallery.component.html',
  styleUrls: ['./my-gallery.component.css']
})
export class MyGalleryComponent implements OnInit {
  @Input()
  id: String;
  uploading: Boolean = false;
  private sub: any;
  listGallery: Gallery[] = [];
  host = environment.apiUrl + '/';
  user: User;
  fileData: File;
  previewUrl: any;
  constructor(
    private modelService: ModelService,
    private alertService: AlertService,
    private reviewService: ReviewService,
    private galleryService: MyGalleryService,
    private route: Router,
    private router: ActivatedRoute,
    private authentication: AuthenticationService) {
    this.user = new User().deserialize(this.authentication.currentUserValue);
  }
  ngOnInit() {
    this.loadListGallery(this.user.id);

  }



  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;

    }
  }

  updateGallery() {
    this.uploading = true;
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.galleryService.postGallery(this.fileData, this.user.id).subscribe(
      data => {
        if (data.status == true) {
          this.listGallery.push(new Gallery().deserialize(data['data']));
          this.fileData = null;
          this.uploading = false;
          this.alertService.success('Upload Sucessfull');
        }
        else {
          this.uploading = false;
          this.fileData = null;
          this.alertService.error('Failed');
        }
      },
      error => {
        this.alertService.error("Failed");
      }

    )
  }

  loadListGallery(id: String) {
    this.galleryService.getGallery(id).subscribe(
      data => {
        data['data'].map(item => {
          this.listGallery.push(new Gallery().deserialize(item));
        });
      },
      error => {
        this.alertService.error(error.msg);
      }
    )
  }

  deleteGallery(id: string) {
    this.galleryService.deleteGallery(id).subscribe(
      data => {
        if (data['status'] != true) {
          this.alertService.error('Failed');
        }
        else {
          this.alertService.success(data['msg']);
          this.listGallery.map((item, index) => {
            if (item._id == id) {
              this.listGallery.splice(index, 1);
            }

          })
        }
      },
      err => {
        this.alertService.error('Failed');
      }
    )
  }

  trackElement(index: number, element: any) {
    return element ? element._id : null
  }
}

