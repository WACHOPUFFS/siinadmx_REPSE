import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    data: { breadcrumb: 'Login' }
  },
  {
    path: 'password-recovery',
    loadChildren: () => import('./password-recovery/password-recovery.module').then(m => m.PasswordRecoveryPageModule),
    data: { breadcrumb: 'Recuperación de Contraseña' }
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    data: { breadcrumb: 'Inicio' }
  },
  {
    path: 'repse',
    loadChildren: () => import('./repse/repse.module').then(m => m.RepsePageModule),
    data: { breadcrumb: 'REPSE' }
  },
  {
    path: 'project-control',
    loadChildren: () => import('./project-control/project-control.module').then(m => m.ProjectControlPageModule),
    data: { breadcrumb: 'Control de Proyectos' }
  },
  {
    path: 'assign-projects',
    loadChildren: () => import('./assign-projects/assign-projects.module').then(m => m.AssignProjectsPageModule),
    data: { breadcrumb: 'Asignación de Proyectos' }
  },
  {
    path: 'employee-management',
    loadChildren: () => import('./employee-management/employee-management.module').then(m => m.EmployeeManagementPageModule),
    data: { breadcrumb: 'Gestión de Empleados' }
  },
  {
    path: 'employee-control',
    loadChildren: () => import('./employee-control/employee-control.module').then(m => m.EmployeeControlPageModule),
    data: { breadcrumb: 'Control de Empleados' }
  },
  {
    path: 'add-employee',
    loadChildren: () => import('./add-employee/add-employee.module').then(m => m.AddEmployeePageModule),
    data: { breadcrumb: 'Registrar Solicitudes de Empleados' }
  },
  {
    path: 'edit-employee',
    loadChildren: () => import('./edit-employee/edit-employee.module').then(m => m.EditEmployeePageModule),
    data: { breadcrumb: 'Editar Solicitudes de Empleados' }
  },
  {
    path: 'incident-control',
    loadChildren: () => import('./incident-control/incident-control.module').then(m => m.IncidentControlPageModule),
    data: { breadcrumb: 'Control de Incidencias' }
  },
  {
    path: 'incident-viewer',
    loadChildren: () => import('./incident-viewer/incident-viewer.module').then(m => m.IncidentViewerPageModule),
    data: { breadcrumb: 'Control de Incidencias' }
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule),
    data: { breadcrumb: 'Configuraciones' }
  },
  {
    path: 'company-settings',
    loadChildren: () => import('./company-settings/company-settings.module').then(m => m.CompanySettingsPageModule),
    data: { breadcrumb: 'Configuración de Empresa' }
  },
  {
    path: 'upload-logo',
    loadChildren: () => import('./upload-logo/upload-logo.module').then(m => m.UploadLogoPageModule),
    data: { breadcrumb: 'Asignar Logo' }
  },
  {
    path: 'code-company',
    loadChildren: () => import('./code-company/code-company.module').then(m => m.CodeCompanyPageModule),
    data: { breadcrumb: 'Código de la Empresa' }
  },
  {
    path: 'department-management',
    loadChildren: () => import('./department-management/department-management.module').then(m => m.DepartmentManagementPageModule),
    data: { breadcrumb: 'Mis Departamentos' }
  },
  {
    path: 'initial-setup',
    loadChildren: () => import('./initial-setup/initial-setup.module').then(m => m.InitialSetupPageModule),
    data: { breadcrumb: 'Configuración Inicial de Períodos' }
  },
  {
    path: 'period-configuration',
    loadChildren: () => import('./period-configuration/period-configuration.module').then(m => m.PeriodConfigurationPageModule),
    data: { breadcrumb: 'Tipos de Períodos' }
  },
  {
    path: 'period-management',
    loadChildren: () => import('./period-management/period-management.module').then(m => m.PeriodManagementPageModule),
    data: { breadcrumb: 'Catálogo de Períodos' }
  },
  {
    path: 'profile-settings',
    loadChildren: () => import('./profile-settings/profile-settings.module').then(m => m.ProfileSettingsPageModule),
    data: { breadcrumb: 'Configuración de Perfiles' }
  },
  {
    path: 'user-permissions-sections',
    loadChildren: () => import('./user-permissions-sections/user-permissions-sections.module').then(m => m.UserPermissionsSectionsPageModule),
    data: { breadcrumb: 'Secciones Visibles de los Perfiles' }
  },
  {
    path: 'business-partner-settings',
    loadChildren: () => import('./business-partner-settings/business-partner-settings.module').then(m => m.BusinessPartnerSettingsPageModule),
    data: { breadcrumb: 'Configuración de Socios Comerciales' }
  },
  {
    path: 'cp-auth',
    loadChildren: () => import('./cp-auth/cp-auth.module').then(m => m.CpAuthPageModule),
    data: { breadcrumb: 'Autorizar Socio Comercial' }
  },
  {
    path: 'edit-roles',
    loadChildren: () => import('./edit-roles/edit-roles.module').then(m => m.EditRolesPageModule),
    data: { breadcrumb: 'Editar Roles de Socios Comercial' }
  },
  {
    path: 'business-partner-register',
    loadChildren: () => import('./business-partner-register/business-partner-register.module').then(m => m.BusinessPartnerRegisterPageModule),
    data: { breadcrumb: 'Registrar Socio Comercial' }
  },
  {
    path: 'permissions-businees-partner',
    loadChildren: () => import('./permissions-businees-partner/permissions-businees-partner.module').then(m => m.PermissionsBusineesPartnerPageModule),
    data: { breadcrumb: 'Secciones Visibles de Mis Socios Comerciales' }
  },
  {
    path: 'site-settings',
    loadChildren: () => import('./site-settings/site-settings.module').then(m => m.SiteSettingsPageModule),
    data: { breadcrumb: 'Configuración de Sitio' }
  },
  {
    path: 'company-permissions-sections',
    loadChildren: () => import('./company-permissions-sections/company-permissions-sections.module').then(m => m.CompanyPermissionsSectionsPageModule),
    data: { breadcrumb: 'Secciones Visibles de Empresas' }
  },
  {
    path: 'companies-info',
    loadChildren: () => import('./companies-info/companies-info.module').then(m => m.CompaniesInfoPageModule),
    data: { breadcrumb: 'Empresas Registradas en la Página' }
  },
  {
    path: 'register-admin-s',
    loadChildren: () => import('./register-admin-s/register-admin-s.module').then(m => m.RegisterAdminSPageModule),
    data: { breadcrumb: 'Registrar Empresas' }
  },
  {
    path: 'premium-auth',
    loadChildren: () => import('./premium-auth/premium-auth.module').then(m => m.PremiumAuthPageModule),
    data: { breadcrumb: 'Confirmar Solicitudes Premium' }
  },
  {
    path: 'users-settings',
    loadChildren: () => import('./users-settings/users-settings.module').then(m => m.UsersSettingsPageModule),
    data: { breadcrumb: 'Configuración de Usuarios' }
  },
  {
    path: 'users-register',
    loadChildren: () => import('./users-register/users-register.module').then(m => m.UsersRegisterPageModule),
    data: { breadcrumb: 'Registrar Usuarios' }
  },
  {
    path: 'user-edit',
    loadChildren: () => import('./user-edit/user-edit.module').then(m => m.UserEditPageModule),
    data: { breadcrumb: 'Editar Mi Usuario' }
  },
  {
    path: 'registro-modal',
    loadChildren: () => import('./registro-modal/registro-modal.module').then(m => m.RegistroModalPageModule),
    data: { breadcrumb: 'Registro Modal' }
  },
  {
    path: 'cp-auth-modal',
    loadChildren: () => import('./cp-auth-modal/cp-auth-modal.module').then(m => m.CpAuthModalPageModule),
    data: { breadcrumb: 'Modal de Autenticación CP' }
  },
  {
    path: 'cp-auth-modal-delete',
    loadChildren: () => import('./cp-auth-modal-delete/cp-auth-modal-delete.module').then(m => m.CpAuthModalDeletePageModule),
    data: { breadcrumb: 'Modal de Eliminación de Autenticación CP' }
  },
  {
    path: 'modal-editar-empleado',
    loadChildren: () => import('./modal-editar-empleado/modal-editar-empleado.module').then(m => m.ModalEditarEmpleadoPageModule),
    data: { breadcrumb: 'Editar Empleado Modal' }
  },
  {
    path: 'modal-info-user-premium',
    loadChildren: () => import('./modal-info-user-premium/modal-info-user-premium.module').then(m => m.ModalInfoUserPremiumPageModule),
    data: { breadcrumb: 'Información Usuario Premium Modal' }
  },
  {
    path: 'registro-premium',
    loadChildren: () => import('./registro-premium/registro-premium.module').then(m => m.RegistroPremiumPageModule),
    data: { breadcrumb: 'Registro Premium' }
  },
  {
    path: 'editar-empresa-modal',
    loadChildren: () => import('./editar-empresa-modal/editar-empresa-modal.module').then(m => m.EditarEmpresaModalPageModule),
    data: { breadcrumb: 'Editar Empresa Modal' }
  },
  {
    path: 'mensual-upload',
    loadChildren: () => import('./mensual-upload/mensual-upload.module').then(m => m.MensualUploadPageModule),
    data: { breadcrumb: 'Carga Mensual' }
  },
  {
    path: 'anual-upload',
    loadChildren: () => import('./anual-upload/anual-upload.module').then(m => m.AnualUploadPageModule)
  },
  {
    path: 'mensual-review',
    loadChildren: () => import('./mensual-review/mensual-review.module').then(m => m.MensualReviewPageModule)
  },
  {
    path: 'anual-review',
    loadChildren: () => import('./anual-review/anual-review.module').then(m => m.AnualReviewPageModule)
  },
  {
    path: 'received',
    loadChildren: () => import('./received/received.module').then(m => m.ReceivedPageModule),
    data: { breadcrumb: 'Recibidos' }
  },
  {
    path: 'upload-files',
    loadChildren: () => import('./upload-files/upload-files.module').then(m => m.UploadFilesPageModule),
    data: { breadcrumb: 'Subir Archivos' }
  },
  {
    path: 'pending-requests',
    loadChildren: () => import('./pending-requests/pending-requests.module').then(m => m.PendingRequestsPageModule),
    data: { breadcrumb: 'Solicitudes Pendientes' }
  },
  {
    path: 'additional-companies',
    loadChildren: () => import('./additional-companies/additional-companies.module').then(m => m.AdditionalCompaniesPageModule),
    data: { breadcrumb: 'Empresas Adicionales' }
  },
  {
    path: 'view-files',
    loadChildren: () => import('./view-files/view-files.module').then(m => m.ViewFilesPageModule),
    data: { breadcrumb: 'Ver Archivos' }
  },
  {
    path: 'view-files/:section',
    loadChildren: () => import('./view-files/view-files.module').then(m => m.ViewFilesPageModule),
    data: { breadcrumb: 'Ver Archivos por Sección' }
  },
  {
    path: 'confirm-day',
    loadChildren: () => import('./confirm-day/confirm-day.module').then( m => m.ConfirmDayPageModule)
  },
  {
    path: 'example',
    loadChildren: () => import('./example/example.module').then( m => m.ExamplePageModule)
  },
  {
    path: 'confirm-week',
    loadChildren: () => import('./confirm-week/confirm-week.module').then( m => m.ConfirmWeekPageModule)
  },
  {
    path: 'process-weekly-lists',
    loadChildren: () => import('./process-weekly-lists/process-weekly-lists.module').then( m => m.ProcessWeeklyListsPageModule)
  },
  {
    path: 'processed-attendance',
    loadChildren: () => import('./processed-attendance/processed-attendance.module').then( m => m.ProcessedAttendancePageModule)
  },
  {
    path: 'employee-view',
    loadChildren: () => import('./employee-view/employee-view.module').then( m => m.EmployeeViewPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
