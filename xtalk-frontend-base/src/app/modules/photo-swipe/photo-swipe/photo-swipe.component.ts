import { Component, ViewChild, ElementRef, Input } from '@angular/core';

// Import PhotoSwipe
import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import { environment } from 'environments/environment';
// Image Interface


@Component({
  selector: 'app-photo-swipe',
  templateUrl: './photo-swipe.component.html',
  styleUrls: ['./photo-swipe.component.css']
})
export class PhotoSwipeComponent {
  @ViewChild('photoSwipe', { static: false }) photoSwipe: ElementRef;

  @Input() images = [];
  constructor() { }
  openGallery(images: any, imageOnly = false, index: number) {
    // Build gallery images array
    images = images || this.images;

    // define options (if needed)
    const options = {
      // optionName: 'option value'
      // for example:
      index: index, // start at first slide,
      shareEl: false,
      counterEl: false,
      tapToToggleControls: false,
    };
    if (imageOnly) {
      this.getImagesOnlyAsPhotoswipe(images).then(items => {
        let gallery = new PhotoSwipe(this.photoSwipe.nativeElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
      });
    }
    // Initializes and opens PhotoSwipe
    this.getImagesAsPhotoswipe(images).then(items => {
      let gallery = new PhotoSwipe(this.photoSwipe.nativeElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
    })
  }
  async getImagesOnlyAsPhotoswipe(images) {
    let items = [];
    const promiseArray = []; // create an array for promises
    images.forEach((item) => {

      promiseArray.push(new Promise(resolve => {
        const img = new Image();
        img.onload = function ($e) {

          items.map((imgItem) => {
            if (imgItem.src == img.src) {
              imgItem.w = img.width;
              imgItem.h = img.height;
            }
          })
          resolve();
        };

        items.push({
          src: environment.apiUrl + '/' + item.fileUrlBase,
          w: img.width,
          h: img.height
        });
        img.src = environment.apiUrl + '/' + item.fileUrlBase;
      }));
    })
    await Promise.all(promiseArray);
    return items;
  }

  async getImagesAsPhotoswipe(message) {
    let items = [];
    const promiseArray = []; // create an array for promises


    message.forEach((item) => {

      promiseArray.push(new Promise(resolve => {
        if (item.type == 'video') {
          items.push({
            html: '<video   class="video_player"   style="width: 100%;padding-top: 44px; max-height: 100%;"  controls src="' + item.url + '"></video>'
          })
          resolve();
        } else {

          const img = new Image();
          img.onload = function () {
            items.forEach((imgItem) => {

              if (imgItem.id == img.id) {
                imgItem.w = img.width;
                imgItem.h = img.height;

              }
            })
            resolve();
          };

          items.push({
            id: item._id,
            src: item.url,
            w: img.width,
            h: img.height
          });
          img.id = item._id
          img.src = item.url;
        }

      }));
    })
    await Promise.all(promiseArray);
    return items;
  }
}