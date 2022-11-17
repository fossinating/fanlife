import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DesignerComponent } from './designer/designer.component';
import { EditComponent } from './designer/edit/edit.component';
import { HomeComponent } from './home/home.component';
import { UniverseComponent } from './universe/universe.component';

const routes: Routes = [
  { path: 'universe/:id', component: UniverseComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'designer', component: DesignerComponent},
  { path: 'about', component: AboutComponent},
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
