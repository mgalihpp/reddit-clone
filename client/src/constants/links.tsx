import {
  BarChart,
  BookOpen,
  BookUser,
  CircleArrowOutUpRight,
  HelpCircle,
  Home,
  Megaphone,
  Scale,
  ScrollText,
  Shield,
  Wrench,
} from 'lucide-react';

export const mainSideBarLinks = [
  {
    icon: Home,
    label: 'Home',
    path: '/home',
  },
  {
    icon: CircleArrowOutUpRight,
    label: 'Popular',
    path: '/popular',
  },
  {
    icon: BarChart,
    label: 'All',
    path: '/all',
  },
];

export const resourcesLinks = [
  {
    icon: Shield,
    label: 'About',
    path: '/about',
  },
  {
    icon: Megaphone,
    label: 'Advertise',
    path: '/advertise',
  },
  {
    icon: HelpCircle,
    label: 'Help',
    path: '/help',
  },
  {
    icon: BookOpen,
    label: 'Blogs',
    path: '/blogs',
  },
  {
    icon: Wrench,
    label: 'Carrers',
    path: '/carrers',
  },
];

export const policyLinks = [
  {
    icon: ScrollText,
    label: 'Content Policy',
    path: '/content-policy',
  },
  {
    icon: Scale,
    label: 'Privacy Policy',
    path: '/privacy-policy',
  },
  {
    icon: BookUser,
    label: 'User Agreement',
    path: '/user-agreement',
  },
];
