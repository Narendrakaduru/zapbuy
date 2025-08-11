import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignupComponent } from './pages/signup/signup.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninComponent } from './pages/signin/signin.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { FooterComponent } from './components/footer/footer.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { FormsModule } from '@angular/forms';
import { ProductComponent } from './pages/product/product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { UsersComponent } from './pages/users/users.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UpdateUserComponent } from './pages/update-user/update-user.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CartDialogComponent } from './components/cart-dialog/cart-dialog.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SignupComponent,
    SigninComponent,
    HomeComponent,
    CreateProductComponent,
    FooterComponent,
    ProductComponent,
    UpdateProductComponent,
    UsersComponent,
    ConfirmDialogComponent,
    UpdateUserComponent,
    CartDialogComponent,
    CartItemComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ProductDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    NgSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSidenavModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
