import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { DealService } from 'src/app/services/deal.service';
import { Deal } from 'src/app/models/deal';
import { ToastService } from 'src/app/services/toast.service';
import { element } from 'protractor';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-itservice-request',
  templateUrl: './itservice-request.page.html',
  styleUrls: ['./itservice-request.page.scss'],
})
export class ITServiceRequestPage implements OnInit {

  private filteredDeals: Deal[];

  constructor(
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
    private dealService: DealService,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router
  ) {
    this.firebaseService.getDealsArray();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.filteredDeals = [];
    this.dealService.dealList.forEach( element => {

      console.log('Deal To : ' + element.To);
      console.log('Current User : ' + this.authService.userDetails().uid);

      if ( element.To === this.authService.userDetails().uid ) {
        this.filteredDeals.push(element);
      }
    });
  }

  generateReceipt(deal: Deal) {
    const navigationExtras: NavigationExtras = {
      state: {
        Deal: deal
      }
    }

    this.router.navigate(['final-deal'], navigationExtras);
  }

  acceptDeal(deal: Deal) {
    deal.Status = 'Accepted';
    deal.ChangeDate = Date.now();
    this.firebaseService.updateDeal(deal.Id, deal);
    this.toastService.presentToast('Deal Accepted');
  }

   rejectDeal(deal: Deal) {
     deal.Status = 'Rejected';
     deal.ChangeDate = Date.now();
     this.firebaseService.updateDeal(deal.Id, deal);
     this.toastService.presentToast('Deal Rejected');
   }

  back() {
    this.navCtrl.pop();
  }

}