export interface ShellMenuItem {
  id: string;
  label: string;
  desc: string;
  icon: string;
  route?: string;
  soon: boolean;
  fav: boolean;
}

export interface ShellCategory {
  id: string;
  label: string;
  icon: string;
  soon: boolean;
  items: ShellMenuItem[];
}

export interface ShellUser {
  username: string;
  name: string;
  roleName: string;
  initials: string;
}

export interface DemoRoleOption {
  roleName: string;
  username: string;
  current: boolean;
}

export interface MemberSearchHit {
  id: string;
  name: string;
  dept: string;
  status: "active" | "pending" | "resigned";
}

export interface ShellModel {
  user: ShellUser;
  categories: ShellCategory[];
  searchItems: ShellMenuItem[];
  canSearchMembers: boolean;
  demoRoles: DemoRoleOption[];
  idleMinutes: number;
}
