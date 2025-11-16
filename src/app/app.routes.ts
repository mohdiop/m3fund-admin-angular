import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Dashboard } from './components/home/dashboard/dashboard';
import { Users } from './components/home/users/users';
import { Administrators } from './components/home/administrators/administrators';
import { Projects } from './components/home/projects/projects';
import { Payments } from './components/home/payments/payments';
import { Histories } from './components/home/histories/histories';
import { Settings } from './components/home/settings/settings';
import { Help } from './components/home/help/help';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },

    { path: 'home', component: Home, children: 
        [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

            { path: 'dashboard', component: Dashboard},

            { path: 'users', component: Users},

            { path: 'administrators', component: Administrators},

            { path: 'projects', component: Projects},

            { path: 'payments', component: Payments},

            { path: 'histories', component: Histories},

            { path: 'settings', component: Settings},

            { path: 'help', component: Help},

            { path: '**', redirectTo: 'dashbord', pathMatch: 'full' },
        ]
     },

    { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
