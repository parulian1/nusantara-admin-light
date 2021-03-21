import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteSettingsComponent } from './website-settings.component';
import {BlogFeedComponent, BlogFeedResolver} from '@nusantara/pages/config/blog-feed';
import {RequireIsEnterpriseGuard} from '@nusantara/auth';
import {ResellerComponent, ResellerProviderResolver, ResellerProviderTypeResolver} from '@nusantara/pages/config';
import {
  AuthSocialComponent,
  AuthSocialListComponent,
  AuthSocialListResolver, AuthSocialResolver
} from '@nusantara/pages/config/auth-social';
import {AuthSocialTypeResolver} from '@nusantara/pages/config/auth-social/auth-social-type.resolver';

const routes: Routes = [
  {
    path: '',
    component: WebsiteSettingsComponent,
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'blog-feed',
    children: [
      {
        path: '',
        redirectTo: 'settings',
      },
      {
        path: 'settings',
        component: BlogFeedComponent,
        resolve: { entity: BlogFeedResolver },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  },
  {
    path: 'reseller',
    canActivate: [RequireIsEnterpriseGuard],
    component: ResellerComponent,
    resolve: {
      entity: ResellerProviderResolver,
      types: ResellerProviderTypeResolver,
    },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'auth-social',
    children: [
      {
        path: '',
        component: AuthSocialListComponent,
        resolve: {
          page: AuthSocialListResolver
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'new',
        component: AuthSocialComponent,
        resolve: {
          authType: AuthSocialTypeResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      },
      {
        path: ':slug',
        component: AuthSocialComponent,
        resolve: {
          entity: AuthSocialResolver,
          authType: AuthSocialTypeResolver,
        },
        runGuardsAndResolvers: 'always',
        data: { animation: 'Detail', },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteSettingsRoutingModule {}
