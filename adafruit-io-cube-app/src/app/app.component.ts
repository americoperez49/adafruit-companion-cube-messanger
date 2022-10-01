import { Component, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('label') buttonLabel!: any;
  @ViewChild('loading') loadingIndicator!: any;
  @ViewChild('label2') buttonLabel2!: any;
  @ViewChild('loading2') loadingIndicator2!: any;

  config = {
    host: 'io.adafruit.com',
    port: 8883,
    path: 'ws',
    ssl: true,

    user: 'burneremail',
    pass: 'aio_IawR27dccZM1NoOda4P00rRe7gI0',

    subscribe: ['burneremail/feeds/message-status'],
    publish: ['burneremail/feeds/message-status'],

    keepalive: 10,
  };

  mouse = false;
  color = 'cyan';

  wordsUrl = 'Feed';
  pixelsUrl =
    'Feed';
  statusUrl =
    'Feed';
  adafruit_io_key = 'API Key';

  cubeMessage = '';
  messageStatus = '';

  constructor(private http: HttpClient) {  }

  ngOnInit(): void {
  
  }

  mouseDragStart($event: any) {
    this.mouse = true;
    // console.log(this.mouse);
  }

  mouseDragEnd($event: any) {
    this.mouse = false;
    // console.log(this.mouse);
  }

  check(box: any) {
    // console.log();
    if (this.mouse) {
      box.checked = !box.checked;
    }
  }

  chooseColor(radio: any) {
    let classList: string[] = Array.from(radio.classList);
    let filteredList: string[] = classList.filter((cl) => cl !== 'picker');
    this.color = filteredList[0];
  }

  updateCubeMessage(input: any) {
    this.cubeMessage = input.value;
  }

  handleSend = async () => {
    this.isLoading(true);

    let filledPixels = Array.from(
      document.querySelectorAll('input[type="checkbox"]')
    )
      .filter((pixel: any) => pixel.checked)
      .map((pix: any) => [pix.dataset.pixelX, pix.dataset.pixelY].join(':'));

    let data = [this.color.toUpperCase(), filledPixels.join(',')].join('-');
    console.log(data);

    console.log(filledPixels);
    await Promise.all([
      this.postData(this.wordsUrl, {
        value: '{"message":"' + this.cubeMessage + '"}',
      }),
      this.postData(this.pixelsUrl, {
        value: data,
      }),
      this.postData(this.statusUrl, {
        value: 'Sent',
      }),
    ]);

    this.cubeMessage = '';
    this.messageStatus = "Sent"

    this.isLoading(false);
  };

  isLoading(loading: boolean) {
    if (loading) {
      this.buttonLabel.nativeElement.classList.add('hidden');
      this.loadingIndicator.nativeElement.classList.remove('hidden');
    } else {
      this.buttonLabel.nativeElement.classList.remove('hidden');
      this.loadingIndicator.nativeElement.classList.add('hidden');
    }
  }

  isLoading2(loading: boolean) {
    if (loading) {
      this.buttonLabel2.nativeElement.classList.add('hidden');
      this.loadingIndicator2.nativeElement.classList.remove('hidden');
    } else {
      this.buttonLabel2.nativeElement.classList.remove('hidden');
      this.loadingIndicator2.nativeElement.classList.add('hidden');
    }
  }

  postData = async (url = '', data = {}) => {
    // Default options are marked with *
    let reqBody = JSON.stringify(data);
    console.log(reqBody);
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-AIO-Key': this.adafruit_io_key,
      },
      body: reqBody,
    });
    return response.json();
  };

  getMessageStatus = async () => {
    this.isLoading2(true);
    let headers= {
      'Content-Type': 'application/json',
      'X-AIO-Key':this.adafruit_io_key
    }
    this.http.get<any>(this.statusUrl+"/last?include=value",{headers:headers}).subscribe(
      (response)=>{
      this.messageStatus = response.value
      this.isLoading2(false);
    }),
    (error:any) => {                              //Error callback
      console.error('Request failed with error')
      alert(error);
    }
  };
}
