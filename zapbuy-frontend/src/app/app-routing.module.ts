import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { SigninComponent } from './pages/signin/signin.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateProductComponent } from './pages/create-product/create-product.component';
import { ProductComponent } from './pages/product/product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { UsersComponent } from './pages/users/users.component';
import { UpdateUserComponent } from './pages/update-user/update-user.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: '', component: HomeComponent },
  { path: 'create-product', component: CreateProductComponent },
  { path: 'products', component: ProductComponent},
  { path: 'products/update/:id', component: UpdateProductComponent },
  { path: 'users', component: UsersComponent},
  { path: 'edit-user/:id', component: UpdateUserComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }