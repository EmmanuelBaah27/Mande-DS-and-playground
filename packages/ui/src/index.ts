// ── Primitives ────────────────────────────────────────────────────────────────
export { Icon } from "./components/ui/icon"
export type { IconProps, IconSize, IconFill } from "./components/ui/icon"

// ── Motion tokens ─────────────────────────────────────────────────────────────
export { springs, durations, easings } from "./tokens/motion"
export type { SpringName, DurationName, EasingName } from "./tokens/motion"

// ── Form ──────────────────────────────────────────────────────────────────────
export { Button, buttonVariants } from "./components/ui/button"
export type { ButtonProps } from "./components/ui/button"

export { Input, inputVariants } from "./components/ui/input"

export { Textarea } from "./components/ui/textarea"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select"

export { Checkbox } from "./components/ui/checkbox"
export type { CheckboxProps } from "./components/ui/checkbox"

export { InputWithLabel } from "./components/ui/input-with-label"
export type { InputWithLabelProps } from "./components/ui/input-with-label"

export { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"

export { Switch } from "./components/ui/switch"

export { Slider } from "./components/ui/slider"

export { Toggle, toggleVariants } from "./components/ui/toggle"

export { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./components/ui/input-otp"

export { Label } from "./components/ui/label"

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from "./components/ui/form"

// ── Display ───────────────────────────────────────────────────────────────────
export { Badge, badgeVariants } from "./components/ui/badge"
export type { BadgeProps } from "./components/ui/badge"

export { Chip, chipVariants } from "./components/ui/chip"
export type { ChipProps } from "./components/ui/chip"

export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar"
export type { AvatarVariant } from "./components/ui/avatar"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/ui/card"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table"

export { Skeleton } from "./components/ui/skeleton"

export { Progress } from "./components/ui/progress"

export { Separator } from "./components/ui/separator"

export { AspectRatio } from "./components/ui/aspect-ratio"

export { Calendar, CalendarDayButton } from "./components/ui/calendar"

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "./components/ui/chart"
export type { ChartConfig } from "./components/ui/chart"

// ── Navigation ────────────────────────────────────────────────────────────────
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/ui/breadcrumb"

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
} from "./components/ui/menubar"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./components/ui/pagination"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar"

// ── Overlays ──────────────────────────────────────────────────────────────────
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog"

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog"

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet"

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./components/ui/drawer"

export { Popover, PopoverTrigger, PopoverContent } from "./components/ui/popover"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./components/ui/tooltip"

export { HoverCard, HoverCardTrigger, HoverCardContent } from "./components/ui/hover-card"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./components/ui/context-menu"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./components/ui/command"

// ── Feedback ──────────────────────────────────────────────────────────────────
export { Alert, AlertTitle, AlertDescription } from "./components/ui/alert"

export { Toaster } from "./components/ui/sonner"

// ── Layout ────────────────────────────────────────────────────────────────────
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/ui/accordion"

export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./components/ui/collapsible"

export { ScrollArea, ScrollBar } from "./components/ui/scroll-area"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./components/ui/resizable"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./components/ui/carousel"
export type { CarouselApi } from "./components/ui/carousel"

// ── Utilities ─────────────────────────────────────────────────────────────────
export { cn } from "./lib/utils"
