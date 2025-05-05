import { Routes } from '@angular/router';
import { HomepageComponent } from './components//homepage/homepage.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductDetailComponent } from './components/productdetail/productdetail.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CategoryComponent } from './components/category/category.component';
import { FavoritesComponent } from './components/favorites/favorites.component';



export const routes: Routes = [
    { path: 'login', component: LoginpageComponent},
    /*{ path: '', component: TopbarComponent},*/
    { path: 'signup', component: SignupComponent},
    { path: '', component: HomepageComponent},
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'home', component: HomepageComponent},
    { path: 'category/:category', component: CategoryComponent },
    { path: "favorites", component: FavoritesComponent},
    
];
