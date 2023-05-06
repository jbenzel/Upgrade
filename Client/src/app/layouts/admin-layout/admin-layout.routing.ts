import { Routes } from '@angular/router';
import { LoginComponent } from 'app/login/login.component';
import { StudentDashboardComponent } from 'app/student-dashboard/student-dashboard.component';
import { DetailedViewComponent } from 'app/detailed-view/detailed-view.component';
import { PassResetPageComponent } from 'app/pass-reset-page/pass-reset-page.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'student-dashboard', component: StudentDashboardComponent },
    { path: 'detailed-view',  component: DetailedViewComponent },
    { path: 'pass-reset', component: PassResetPageComponent},
];
