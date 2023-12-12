import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartService } from '../chart.service';
import { ChangeDetectorRef } from '@angular/core';

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
  public currentUser!:User | undefined;
  public selectedUser!:any;

  public rooms = ["room1"]

  public userList = [
    {
      id: 1,
      name: 'The Swag Coder',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      rooms: this.rooms
    },
    {
      id: 2,
      name: 'Wade Warren',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      rooms: this.rooms
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      rooms: this.rooms
    },
    {
      id: 4,
      name: 'Dianne Russell',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      rooms: this.rooms
    }
    ,
    {
      id: 1,
      name: 'The Swag Coder',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      rooms: this.rooms
    },
    {
      id: 2,
      name: 'Wade Warren',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      rooms: this.rooms
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      rooms: this.rooms
    },
    {
      id: 4,
      name: 'Dianne Russell',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      rooms: this.rooms
    },
    {
      id: 1,
      name: 'The Swag Coder',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      rooms: this.rooms
    },
    {
      id: 2,
      name: 'Wade Warren',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      rooms: this.rooms
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      rooms: this.rooms
    },
    {
      id: 4,
      name: 'Dianne Russell',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      rooms: this.rooms
    },

    {
      id: 2,
      name: 'Wade Warren',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      rooms: this.rooms
    },
    {
      id: 3,
      name: 'Albert Flores',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      rooms: this.rooms
    },
    {
      id: 4,
      name: 'Dianne Russell',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      rooms: this.rooms
    }
  ];

  constructor(
 
    private chatService: ChartService,
    private cdr: ChangeDetectorRef  
  ) {
  }


  ngOnInit() {
    // Set a timeout to hide the spinners after 5 seconds
    setTimeout(() => {
      this.showSpinners = false;
    }, 3000);

    
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
    this.selectedUser = this.userList.find(user => user.phone === phone);
    if(this.currentUser){
      this.roomId = this.selectedUser.roomId[this.currentUser.id];

    }
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }
   
  }



  sendMessage(): void {

    this.chatService.sendMessage({
      user: "Robinson",
      room: "this.roomId",
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
    this.cdr.detectChanges();
  }

  
}
