import { ProductServiceService } from 'src/app/services/product-service.service.';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from 'src/app/models/product';
import { WishlistServiceService } from 'src/app/services/wishlist-service.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  styleUrls: ['./wishlist-page.component.css']
})
export class WishlistPageComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private dialog: MatDialog,private productService: ProductServiceService, private wishlistService: WishlistServiceService) { }

  wishlist: Product[];
  selectedValue: string;
  ngOnInit(): void {

    this._getWishlist();
  }


  _getWishlist(){
    this.wishlistService.returnWishlist().then(() =>{
      this.wishlist = this.wishlistService.wishlist;
    })

  }


  selectOrder(){
    switch (this.selectedValue) {
      case 'price':
        this._orderByPrice();
        break;

      case 'name':
        this._orderByName();
        break;
    }
  }
  _orderByPrice(){
    this.wishlist = this.wishlist.sort((a,b) => (a.price > b.price) ? -1 : ((b.price > a.price) ? 1 : 0));
  }

  _orderByName(){
    this.wishlist = this.wishlist.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

  }





  openBuyDialog(product: Product){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        this.productService.buyProduct(product.id).subscribe(() =>{
          this.showSnackBarProductBought(product.name, 'annuler');
          this._getWishlist();
        })
      }
    });

  }

    showSnackBarProductBought(productName: string, action: string) {
      this._snackBar.open(
        'Vous avez achet?? le produit |' + productName + '|' +
        " Nous envoyons un message de confirmation ?? votre email",
        action,


        {
          duration: 5000,
        }
      );
    }

  addProductInYourWishlist(product: Product){
    this.wishlistService.addProductInWishlist(product.id).subscribe(() =>{
      this.showSnackBarProductAddedAgain(product, 'annuler');
      this._getWishlist();
    })
  }

  removeProductFromWishlist(product: Product){
    this.wishlistService.removeProductFromWishlist(product.id).subscribe(() =>{
      this.showSnackBarProductRemoved(product, 'annuler');
      this._getWishlist();

    })
  }

  showSnackBarProductAddedAgain(product: Product, action: string) {
   this._snackBar.open(
      'Ajouter le produit:|' + product.name + '| dans vos favoris encore',
      action,

      {
        duration: 3000,
      }
    );
  }

  showSnackBarProductRemoved(product: Product, action: string) {
    let snackBarRef = this._snackBar.open(
      'Vous avez retir?? le produit: |' + product.name + '| Depuis vos Favoris',
      action,

      {
        duration: 3000,
      }
    );
    snackBarRef.onAction().subscribe(()=> this.addProductInYourWishlist(product));
  }

}
