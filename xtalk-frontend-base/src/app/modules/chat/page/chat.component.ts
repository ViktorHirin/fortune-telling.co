import { Component, OnInit, ElementRef, Input, AfterViewInit, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import { ChatService } from "@/_servies/chat.service";
import { AlertService } from '@/_servies/alert.service';
import { AuthenticationService } from '@/_servies/authentication.service';
import { ImageHelper } from '@/_helpers/image';
import { SocketService } from '@/_servies/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, } from 'rxjs';
import { User, Chat, EventSocket } from '@/_models';
import { Socket } from 'net';
import { Router } from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  isNewConv: boolean = false;
  toogleChatClicked: boolean = false;
  currentTotalMessage: number = 0;
  canLoadMessage: boolean = true;
  reqId: String;
  to: User = new User();
  listRoom = [];
  roomId: String;
  listFriend: User[];
  user: User;
  queryString: any;
  isScroll: Boolean = false;
  message: String = '';
  messages: Chat[] = [];
  listMessages = new Map();
  loadedMessage = new Map();
  imageHelper: ImageHelper = new ImageHelper();
  searchableRoom = [
    'firstName', 'lastName'
  ];
  @ViewChild('listChat', { static: false }) listChat: ElementRef;
  @ViewChild('imgupload', { static: false }) imgupload: ElementRef;
  @ViewChild('toogleChat', { static: true }) toogleChat: ElementRef;
  @ViewChild('chatMain', { static: true }) chatMain: ElementRef;
  constructor(private chatService: ChatService, private authentication: AuthenticationService
    , private alertService: AlertService, private route: Router, private socketService: SocketService,
    private router: ActivatedRoute,) {
    this.user = this.authentication.currentUserValue;
    this.chatService.currentRoom.subscribe(data => {
      this.roomId = data;
    })
    this.router.params.subscribe(params => {
      this.reqId = params.id;
      if (this.reqId) {
        this.chatService.setCurrentRoom('room-' + this.user.id + '-' + this.reqId);
      }
    });
      //Event revice msg from socket
   
  }
  @Input() name: string = "Kim Amana";
  myName = "test Name";
  ngOnInit() {
    this.chatService.newMessage().subscribe(msg=> {
      console.log("new message in chatpage");
      console.log(msg);
      msg= new Chat().deserialize(msg);
      if (msg && msg.from) {
        var msgRevice = msg;
        if (msgRevice.from != this.user.id) {
          if (msgRevice.roomId == this.roomId) {
            this.messages.push(msgRevice);
          }
          else {
            var messageTmp = this.listMessages.get(msgRevice.roomId) ? this.listMessages.get(msgRevice.roomId) : [];
            messageTmp.push(msgRevice);
            this.listMessages.set(msgRevice.roomId, messageTmp);
            this.loadedMessage.set(msgRevice.roomId, false);
          }
        }
      }

    }, error => {
      this.alertService.error('Failed');
    });
    this.getListRoom();
    this.chatService.inChatPage = true;
  
    //this.scrollToBottom();
    var bodyEle = document.getElementsByTagName('body')[0];
    // bodyEle.scrollIntoView();
    this.toogleChat.nativeElement.on('click', (event) => {
      this.toogleChatClicked = !this.toogleChatClicked;
    })

  }

  public sendMessage() {
    this.message = this.message.substring(0, this.message.length - 1);

    if (this.message === "" || this.message.length == 0) {
      return
    }
    else {
      if (this.to.id) {
        var msgSend = new Chat();
        msgSend.text = this.message;
        // msgSend.to['_id']=this.to.id;
        msgSend.type = "text";
        msgSend.user = this.user;
        msgSend.createdAt = new Date();
        msgSend.roomId = this.roomId;
        msgSend.to = this.to;
        msgSend.from = this.user;
        msgSend.isNew = true;
        this.messages.push(msgSend);
        this.listMessages.set(this.roomId, this.messages);
        this.message = '';
      }
    }
    
  }

  public startChat(toId) {
    this.to.id = toId;
    this.chatService.startChat({
      to: this.to,
      text: 'text send messge',
      roomId: this.roomId,
      user: this.user,
    });
  }

  public getListRoom() {
    this.chatService.listRoom$.subscribe(data => {
      if (data) {
        this.listRoom = [];
        var list: String[] = [];
        if (this.roomId) {
          this.isNewConv = true;
          data.forEach((roomItem) => {
            if (this.roomId == roomItem['id']) {
              this.isNewConv = false;
              if (this.user.role == 'model' && roomItem['userId']) {
                this.to = new User().deserialize(roomItem['userId']);

              }
              if (this.user.role == 'member' && roomItem['modelId']) {
                this.to = new User().deserialize(roomItem['modelId']);
              }
            }
            if (this.user.role == 'model') {
              if (roomItem['userId']) {
                this.listRoom.push(roomItem);
                list.push(roomItem['id']);
                this.listMessages.set(roomItem['id'], new Array<Chat>());
              }
            }
            if (this.user.role == 'member') {
              if (roomItem['modelId']) {
                this.listRoom.push(roomItem);
                list.push(roomItem['id']);
                this.listMessages.set(roomItem['id'], new Array<Chat>());
              }
            }
            this.chatService.joinRoom(new Chat().deserialize({roomId:roomItem['id']}))
          });
          setTimeout(() => {
            this.setTo();

          }, 300);
        }
        else {
          this.isNewConv = false;
          data.forEach(roomItem => {
            if (this.user.role == 'model') {
              if (roomItem['userId']) {
                this.listRoom.push(roomItem);
                list.push(roomItem['id']);
                this.listMessages.set(roomItem['id'], new Array<Chat>());
              }
            }
            if (this.user.role == 'member') {
              if (roomItem['modelId']) {
                this.listRoom.push(roomItem);
                list.push(roomItem['id']);
                this.listMessages.set(roomItem['id'], new Array<Chat>());
              }
            }
            this.chatService.joinRoom(new Chat().deserialize({roomId:roomItem['id']}))
          });
          this.setTo();
        }
      }
    }, error => {

      this.alertService.error(error.msg);
    });

  }

  public beginRoom(roomId: String, userId: User) {
    if (!roomId) {
      if (this.user.role == 'model') {
        roomId = 'room-' + userId + '-' + this.user.id;
      }
      else {
        roomId = 'room-' + this.user.id + '-' + userId;
      }
    }
    else {
      this.to = userId;
      this.chatService.setCurrentRoom(roomId);
      var request = new Chat();
      request.roomId = this.roomId;
      request.from = this.user.id;
      this.chatService.joinRoom(request);
      // if(!this.loadedMessage.get(roomId))
      // {

      // }
      // else{
      //   this.messages=this.listMessages.get(roomId);
      // }
      this.canLoadMessage = true;
      this.loadedMessageInCurrentRoom();
    }
    // this.scrollToBottom();

  }

  public setTo() {

    if (this.isNewConv) {
      this.chatService.getUserInfo(this.reqId).subscribe(user => {

        this.to = new User().deserialize(user['data']);
        if (this.to.role == 'model' && this.user.role == 'model') {
          this.route.navigate(['/home']);
        };
      }, err => {
        this.alertService.error(err.msg);
      });

    }
    else {
      if (this.listRoom.length) {
        this.chatService.setCurrentRoom(this.listRoom[this.listRoom.length - 1].id);
        if (this.user.role == 'model') {
          this.to = this.listRoom[this.listRoom.length - 1].userId;
        }
        else {
          this.to = this.to = this.listRoom[this.listRoom.length - 1].modelId;
        }
        this.beginRoom(this.roomId, this.to);
      }
    }

    //this.scrollToLAstMsg();
  }

  public loadMoreMessage() {
    let skip = this.listMessages.get(this.roomId).length;
    this.loadedMessageInCurrentRoom(skip);
  }

  private loadedMessageInCurrentRoom(skip: number = 0) {
    this.chatService.loadMessageinRoom(this.roomId, this.listMessages.get(this.roomId).length, 30).subscribe(data => {
      var messageInRoom = this.listMessages.get(this.roomId);
      var unreadMesg: Chat[] = [];
      data['data'].forEach(mes => {
        unreadMesg.push(mes);
      });
      unreadMesg.reverse();
      messageInRoom = [...unreadMesg, ...messageInRoom];
      if (data['total'] && messageInRoom.length >= data['total']) {
        this.canLoadMessage = false;
      }
      this.listMessages.set(this.roomId, messageInRoom);
      this.messages = this.listMessages.get(this.roomId) ? this.listMessages.get(this.roomId) : [];
      //  this.messages.reverse();
      this.loadedMessage.set(this.roomId, true);

    });
  }

  public attachMessage() {
    this.imgupload.nativeElement.click();
  }

  public attachImg($e) {

    if (this.to.id) {
      let file = <File>$e.target.files[0];
      var msgSend = new Chat();
      // msgSend.text = this.message;
      // // msgSend.to['_id']=this.to.id;
      msgSend.type = "image";
      msgSend.user = this.user;
      msgSend.createdAt = new Date();
      msgSend.roomId = this.roomId;
      msgSend.to = this.to;
      msgSend.isNew = true;
      msgSend.file = { data: file, inProgress: false, progress: 0 };
      msgSend.from = this.user;
      this.messages.push(msgSend);
      // this.preview(msgSend.data,this.messages.length-1);
      this.listMessages.set(this.roomId, this.messages);
      this.message = '';
    }
  }

  public goModelDetail(){
    if(this.to && this.user.role == "member"){
      this.route.navigateByUrl('model-detail/'+this.to.id);
    }
    return ;
  }
  ngOnDestroy() {
    console.log('run ng on destroy');
    this.chatService.inChatPage = false;
    //this.chatService.currentRoom.unsubscribe();
  }

}
