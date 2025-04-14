import {
  Bell,
  BookOpen,
  Calendar,
  CheckSquare,
  Grid,
  Heart,
  Layout,
  List,
  PieChart,
  Sliders,
  MapPin,
  Users,
  Share,
  ArrowRightCircle,
  Code,
  Globe,
  Info,
  Mail,
  Shield,  
} from "react-feather";

const pagesSection = [
  {
    href: "/leave",
    icon: Grid,
    title: "Leave Management",
    name: "LEAVE_MANAGEMENT",
    children: [
      {
        href: "/leave/default",
        title: "Leave Dashboard",
      },
      // {
      //   href: "/leave/Manager",
      //   title: "Manager View",
      // },
      {
        href: "/leave/leaveconfigurationsetup",
        title: "Leave Configuration Setup",
      },
      {
        href: "/leave/holidaysetup",
        title: "Holiday Calendar Setup",
      },
      {
        href: "/leave/holidayuserview",
        title: "Holiday Calendar",
      },
    ],
  },
  {
    href: "/timesheet",
    icon: Calendar,
    title: "Timesheet Management",
    name: "TS_MANAGEMENT",
    children: [
      {
        href: "/timesheet/default",
        title: "Default",
      },
      {
        href: "/timesheet/Manager",
        title: "Manager View",
      },
      {
        href: "/timesheet/HR",
        title: "HR View",
      },
      {
        href: "/timesheet/Admin",
        title: "System Admin",
      },
    ],
  },
  {
    href: "/employee",
    icon: Users,
    title: "Employee Management",
    name: "EMP_MANAGEMENT",
    children: [
      {
        href: "/employee/profile",
        title: "Profile",
      },
      {
        href: "/employee/settings",
        title: "Settings",
      },
      {
        href: "/employee/contactdetails",
        title: "Contact Details",
      },
      {
        href: "/employee/bankdetails",
        title: "Bank Details",
      },

      {
        href: "/employee/skills",
        title: "Skills",
      },
      {
        href: "/employee/documents",
        title: "Documents",
      },
      {
        href: "/employee/jobhistory",
        title: "Job History",
      },
      {
        href: "/employee/references",
        title: "References",
      },
      {
        href: "/employee/educational",
        title: "Educational Details",
      },
      {
        href: "/employee/certifications",
        title: "Certifications",
      },
      {
        href: "/employee/family",
        title: "Family Details",
      },
      {
        href: "/employee/emergency",
        title: "Emergency Contact Details",
      },
    ],
  },
  // {
  //   href: "/pages",
  //   icon: Globe,
  //   title: "GRC Library",
  //   children: [
  //     {
  //       href: "/pages/process",
  //       title: "Process",
  //     },
  //     {
  //       href: "/pages/risk",
  //       title: "Risk",
  //     },
  //     {
  //       href: "/pages/control",
  //       title: "Control",
  //     },
  //     {
  //       href: "/pages/requirement",
  //       title: "Requirement",
  //     },
  //     {
  //       href: "/pages/regulatorybody",
  //       title: "Regulatory Body",
  //     },
  //     {
  //       href: "/pages/areaofcompliance",
  //       title: "Areas of compliance",
  //     },
  //   ],
  // },
  // {
  //   href: "/pages",
  //   icon: CheckSquare,
  //   title: "Compliance Management",
  //   children: [
  //     {
  //       href: "/pages/testing",
  //       title: "Control Testing",
  //     },
  //     {
  //       href: "/pages/testingoverview",
  //       title: "Overview",
  //     },
  //   ],
  // },
];

const AdminSection = [
  {
    href: "/pages",
    icon: Layout,
    title: "Setup",
    name: "SETUP",
    children: [
      {
        href: "/pages/pages",
        title: "Pages",
      },
      {
        href: "/pages/user",
        title: "Users",
      },
      {
        href: "/pages/privileges",
        title: "Privileges",
      },
      {
        href: "/pages/roles",
        title: "Roles",
      },
      {
        href: "/pages/businessentity",
        title: "Business Entity",
      },
      {
        href: "/pages/picklist",
        title: "Picklist",
      },
    ],
  },
  {
    href: "/pages",
    icon: Code,
    title: "Development Tools",
    name: "DEV_TOOLS",
    children: [
      {
        href: "/pages/workflow",
        title: "Workflows",
      },
      {
        href: "/pages/modules",
        title: "Modules",
      },
      {
        href: "/pages/forms",
        title: "Forms",
      },
      
    ],
  },
  
];

const navItems = [
  {
    title: "Applications",
    pages: pagesSection,
  },
  {
    title: "Administration",
    pages: AdminSection,
  },
];

export default navItems;
