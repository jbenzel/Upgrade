import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import { ResetEmailComponent } from './login/reset-email/reset-email.component';
import { EmailServiceService } from './login/reset-email/email-service.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    MatCardModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ResetEmailComponent,
  ],
  entryComponents:[
    
  ],
  providers: [
    EmailServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
