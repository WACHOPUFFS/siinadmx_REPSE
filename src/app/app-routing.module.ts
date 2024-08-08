import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'upload-files',
    loadChildren: () => import('./upload-files/upload-files.module').then( m => m.UploadFilesPageModule)
  },
  {
    path: 'received',
    loadChildren: () => import('./received/received.module').then( m => m.ReceivedPageModule)
  },
  {
    path: 'register-admin-s',
    loadChildren: () => import('./register-admin-s/register-admin-s.module').then( m => m.RegisterAdminSPageModule)
  },
  {
    path: 'company-request',
    loadChildren: () => import('./company-request/company-request.module').then( m => m.CompanyRequestPageModule)
  },
  {
    path: 'pending-requests',
    loadChildren: () => import('./pending-requests/pending-requests.module').then( m => m.PendingRequestsPageModule)
  },
  {
    path: 'register-admin-company',
    loadChildren: () => import('./register-admin-company/register-admin-company.module').then( m => m.RegisterAdminCompanyPageModule)
  },
  {
    path: 'user-settings',
    loadChildren: () => import('./user-settings/user-settings.module').then( m => m.UserSettingsPageModule)
  },
  {
    path: 'user-setting-select',
    loadChildren: () => import('./user-setting-select/user-setting-select.module').then( m => m.UserSettingSelectPageModule)
  },
  {
    path: 'password-recovery',
    loadChildren: () => import('./password-recovery/password-recovery.module').then( m => m.PasswordRecoveryPageModule)
  },
  {
    path: 'code-person',
    loadChildren: () => import('./code-person/code-person.module').then( m => m.CodePersonPageModule)
  },
  {
    path: 'add-person',
    loadChildren: () => import('./add-person/add-person.module').then( m => m.AddPersonPageModule)
  },
  {
    path: 'registro-modal',
    loadChildren: () => import('./registro-modal/registro-modal.module').then( m => m.RegistroModalPageModule)
  },
  {
    path: 'cp-auth',
    loadChildren: () => import('./cp-auth/cp-auth.module').then( m => m.CpAuthPageModule)
  },
  {
    path: 'user-info-modal-component',
    loadChildren: () => import('./user-info-modal-component/user-info-modal-component.module').then( m => m.UserInfoModalComponentPageModule)
  },
  {
    path: 'cp-auth-modal',
    loadChildren: () => import('./cp-auth-modal/cp-auth-modal.module').then( m => m.CpAuthModalPageModule)
  },
  {
    path: 'example',
    loadChildren: () => import('./example/example.module').then( m => m.ExamplePageModule)
  },
  {
    path: 'edit-roles',
    loadChildren: () => import('./edit-roles/edit-roles.module').then( m => m.EditRolesPageModule)
  },
  {
    path: 'cambiar-rol-modal',
    loadChildren: () => import('./cambiar-rol-modal/cambiar-rol-modal.module').then( m => m.CambiarRolModalPageModule)
  },
  {
    path: 'cp-auth-modal-delete',
    loadChildren: () => import('./cp-auth-modal-delete/cp-auth-modal-delete.module').then( m => m.CpAuthModalDeletePageModule)
  },
  {
    path: 'modal-editar-empleado',
    loadChildren: () => import('./modal-editar-empleado/modal-editar-empleado.module').then( m => m.ModalEditarEmpleadoPageModule)
  },
  {
    path: 'modal-info-user-premium',
    loadChildren: () => import('./modal-info-user-premium/modal-info-user-premium.module').then( m => m.ModalInfoUserPremiumPageModule)
  },
  {
    path: 'registro-premium',
    loadChildren: () => import('./registro-premium/registro-premium.module').then( m => m.RegistroPremiumPageModule)
  },
  {
    path: 'premium-auth',
    loadChildren: () => import('./premium-auth/premium-auth.module').then( m => m.PremiumAuthPageModule)
  },
  {
    path: 'companies-info',
    loadChildren: () => import('./companies-info/companies-info.module').then( m => m.CompaniesInfoPageModule)
  },
  {
    path: 'editar-empresa-modal',
    loadChildren: () => import('./editar-empresa-modal/editar-empresa-modal.module').then( m => m.EditarEmpresaModalPageModule)
  },
  {
    path: 'view-files',
    loadChildren: () => import('./view-files/view-files.module').then( m => m.ViewFilesPageModule)
  },
  {
    path: 'user-permissions-sections',
    loadChildren: () => import('./user-permissions-sections/user-permissions-sections.module').then( m => m.UserPermissionsSectionsPageModule)
  },
  {
    path: 'upload-logo',
    loadChildren: () => import('./upload-logo/upload-logo.module').then( m => m.UploadLogoPageModule)
  },
  {
    path: 'additional-companies',
    loadChildren: () => import('./additional-companies/additional-companies.module').then( m => m.AdditionalCompaniesPageModule)
  },
  {
    path: 'generate-share-code',
    loadChildren: () => import('./generate-share-code/generate-share-code.module').then( m => m.GenerateShareCodePageModule)
  },
  {
    path: 'test-page',
    loadChildren: () => import('./test-page/test-page.module').then( m => m.TestPagePageModule)
  },
  {
    path: 'company-settings',
    loadChildren: () => import('./company-settings/company-settings.module').then( m => m.CompanySettingsPageModule)
  },
  {
    path: 'repse',
    loadChildren: () => import('./repse/repse.module').then( m => m.RepsePageModule)
  },
  {
    path: 'company-permissions-sections',
    loadChildren: () => import('./company-permissions-sections/company-permissions-sections.module').then( m => m.CompanyPermissionsSectionsPageModule)
  },
  {
    path: 'view-files/:section',
    loadChildren: () => import('./view-files/view-files.module').then(m => m.ViewFilesPageModule)
  },
  {
    path: 'permissions-businees-partner',
    loadChildren: () => import('./permissions-businees-partner/permissions-businees-partner.module').then( m => m.PermissionsBusineesPartnerPageModule)
  },
  {
    path: 'user-business-partner-sections',
    loadChildren: () => import('./user-business-partner-sections/user-business-partner-sections.module').then( m => m.UserBusinessPartnerSectionsPageModule)
  },
  {
    path: 'document-upload',
    loadChildren: () => import('./document-upload/document-upload.module').then( m => m.DocumentUploadPageModule)
  },
  {
    path: 'document-review',
    loadChildren: () => import('./document-review/document-review.module').then( m => m.DocumentReviewPageModule)
  },
  {
    path: 'mensual-upload',
    loadChildren: () => import('./mensual-upload/mensual-upload.module').then( m => m.MensualUploadPageModule)
  },
  {
    path: 'control-works',
    loadChildren: () => import('./control-works/control-works.module').then( m => m.ControlWorksPageModule)
  },
  {
    path: 'add-employee',
    loadChildren: () => import('./add-employee/add-employee.module').then( m => m.AddEmployeePageModule)
  },
  {
    path: 'edit-employee',
    loadChildren: () => import('./edit-employee/edit-employee.module').then( m => m.EditEmployeePageModule)
  },
  {
    path: 'manage-weeks',
    loadChildren: () => import('./manage-weeks/manage-weeks.module').then( m => m.ManageWeeksPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
