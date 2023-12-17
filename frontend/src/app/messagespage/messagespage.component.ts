import { Component, NgZone, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartService } from '../services/chart.service';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

interface User {
  id: number;
  name: string;
  phone: string;
  image: string;
  rooms: string[];
}



@Component({
  selector: 'app-messagespage',
  templateUrl: './messagespage.component.html',
  styleUrls: ['./messagespage.component.scss']
})



export class MessagespageComponent {
  showSpinners: boolean = true;
  
  // @ViewChild('popup', {static: false}) popup: any;

  public roomId: any
  public messageText!: any;
  public messageArray: { user: any, message: string }[] = [];
  private storageArray:any[] = [];

  public showScreen = false;
  public phone!: string;
  public currentUser:any;
  public selectedUser!:any;
  storedUser: string | null = localStorage.getItem('user_details');

  public rooms = ["room1"]
  
  public userList:any[] = []

  constructor(
    private toastr: ToastrService,
    private userService:UserService,
    private chatService: ChartService,
    private cdr: ChangeDetectorRef ,
    private zone: NgZone 
  ) {
  }


  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);

    if (this.storedUser) {
      const user = JSON.parse(this.storedUser);
      this.currentUser = user
    } else {
      console.error('User details not found in local storage');
    }


    this.userService.getSuggestions().subscribe(
      (allUsersResponse) => {
        this.userList = allUsersResponse
        console.log(allUsersResponse);
  
    
      },
      (allUsersError) => {
        this.toastr.error(`${allUsersError}`, 'Error');
        console.error('Error getting all users:', allUsersError);
      }
    );

    
    this.chatService.getMessage()
      .subscribe((data: { user: any, room: string, message: string }) => {
        this.messageArray.push(data);
       
        console.log('Message received:', data);

          setTimeout(() => {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray
              .findIndex((storage:any) => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        
      });

  }



  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find(user => user.phone_no === phone);
    if(this.currentUser){
      this.roomId = this.selectedUser.user_id;

    }
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.usernsme, this.roomId);
   
  }


  join(username: string, roomId: string): void {
    this.chatService.joinRoom({user: username, room: roomId});
  }

  sendMessage(): void {

    this.chatService.sendMessage({
      user: this.currentUser,
      room: this.roomId,
      message: this.messageText
    })
  


    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage) => storage.roomId === this.roomId);

      console.log(storeIndex);
      
    if (storeIndex > -1) {
      
        this.storageArray[storeIndex].chats.push({
          user: this.currentUser?.name,
          message: this.messageText
        });
     
 
    } else {
 
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser?.name,
          message: this.messageText
        }]
      };

  

      this.storageArray.push(updateStorage);
      
    
    }

    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
    this.zone.run(() => {
      // Update UI-related code here
      this.cdr.detectChanges(); // Trigger change detection if needed
    });
  }

  
}
