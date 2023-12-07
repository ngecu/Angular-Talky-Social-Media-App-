import { Component } from '@angular/core';
import 'boxicons'

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  public openPopup: Function | undefined;

  setPopupAction(fn: any) {
      this.openPopup = fn;
  }

  onEnterFunction(){

    console.log("ghf")
  }

  public textArea: string = "";
  isEmojiPickerVisible: boolean | undefined;
  public addEmoji(event: { emoji: { native: any; }; }) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

}
