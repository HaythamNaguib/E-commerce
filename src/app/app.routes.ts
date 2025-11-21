import { Routes } from '@angular/router';
import path from 'path';
import { AuthLayoutComponent } from './core/layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './core/layout/blank-layout/blank-layout.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductsComponent } from './features/products/products.component';
import { BrandsComponent } from './features/brands/brands.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { DetailsComponent } from './features/details/details.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { NotfoundComponent } from './features/notfound/notfound.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: 'login', component: LoginComponent, title: "login page" },
      { path: 'register', component: RegisterComponent, title: "register page" }
    ]
  },
  {
    path: '', component: BlankLayoutComponent, children: [
      { path: 'home', component: HomeComponent, title: "Home page" },
      { path: 'cart', component: CartComponent, title: "cart page" },
      { path: 'products', component: ProductsComponent, title: "products page" },
      { path: 'brands', component: BrandsComponent, title: "brands page" },
      { path: 'categories', component: CategoriesComponent, title: "categories page" },
      { path: 'details', component: DetailsComponent, title: "details page" },
      { path: 'checkout', component: CheckoutComponent, title: "checkout page" },
      { path: '""', component: NotfoundComponent, title: "not found page" },


    ]
  },
];
