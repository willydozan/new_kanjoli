export type UserRole =
  | 'superadmin'
  | 'admin_pekppp'
  | 'admin_perencanaan'
  | 'admin_litbang'
  | 'admin_sekretariat'
  | 'pimpinan'

export type UserProfile = {
  id: string
  fullName: string
  email: string
  role: UserRole
}