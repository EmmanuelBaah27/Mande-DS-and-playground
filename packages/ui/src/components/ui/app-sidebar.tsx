"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import { springs } from "@/tokens/motion"

// ─── Mande logo ───────────────────────────────────────────────────────────────

function MandeLogoDefault() {
  return (
    <svg
      width="80"
      height="20"
      viewBox="0 0 80 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="mande"
    >
      <rect width="20" height="20" rx="5" fill="#C6EB52" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2832 5.27106H11.7115C11.7948 5.27106 11.8662 5.3365 11.8662 5.42574C11.89 6.55015 12.1637 7.65076 12.6634 8.66214C13.1572 9.65567 14.6564 10.8336 15.9057 11.2679C15.9117 11.2679 15.9176 11.2739 15.9236 11.2739C16.0307 11.3274 16.0247 11.488 15.9176 11.5416L14.6386 12.2495C14.591 12.2733 14.5612 12.315 14.5493 12.3685L14.1686 13.8796C14.1507 13.951 14.0793 14.0046 14.0079 13.9927C13.9841 13.9867 13.9603 13.9808 13.9425 13.9629C12.6337 12.9516 11.5747 11.6606 10.837 10.1792C10.7061 9.91743 10.5871 9.65567 10.48 9.38795C10.3729 9.65567 10.2539 9.91743 10.1231 10.1792C9.38535 11.6606 8.32043 12.9516 7.01754 13.9629C6.93425 14.0284 6.80932 13.9629 6.79742 13.8618L6.62489 12.3923C6.61894 12.3269 6.5773 12.2733 6.52375 12.2495L5.04833 11.5416C4.94125 11.488 4.92935 11.3274 5.03644 11.2739C5.04238 11.2679 5.04833 11.2679 5.05428 11.262C6.26793 10.8277 7.7612 9.64972 8.26094 8.65619C8.76068 7.65076 9.03434 6.5442 9.05814 5.41979C9.05814 5.3365 9.12953 5.26511 9.21282 5.26511H9.68281H11.2832V5.27106Z"
        fill="#0F1010"
      />
      <path
        d="M28 15.8356V7.45205H30.4164V9.42466H30.4658V15.8356H28ZM33.6384 15.8356V10.5096C33.6384 10.0822 33.5233 9.76986 33.2932 9.5726C33.074 9.36438 32.7616 9.26027 32.3562 9.26027C32.0055 9.26027 31.6822 9.34247 31.3863 9.50685C31.1014 9.66027 30.8767 9.88493 30.7123 10.1808C30.5479 10.4658 30.4658 10.8055 30.4658 11.2L30.2521 9.30959C30.526 8.69589 30.9205 8.20822 31.4356 7.84658C31.9616 7.47397 32.5918 7.28767 33.326 7.28767C34.2027 7.28767 34.8822 7.53425 35.3644 8.0274C35.8575 8.52055 36.1041 9.13973 36.1041 9.88493V15.8356H33.6384ZM39.2767 15.8356V10.5096C39.2767 10.0822 39.1616 9.76986 38.9315 9.5726C38.7123 9.36438 38.4 9.26027 37.9945 9.26027C37.6438 9.26027 37.3205 9.34247 37.0247 9.50685C36.7397 9.66027 36.5151 9.88493 36.3507 10.1808C36.1863 10.4658 36.1041 10.8055 36.1041 11.2L35.726 9.30959C36 8.69589 36.4055 8.20822 36.9425 7.84658C37.4904 7.47397 38.1479 7.28767 38.9151 7.28767C39.8247 7.28767 40.5205 7.54521 41.0027 8.06027C41.4959 8.56438 41.7425 9.2274 41.7425 10.0493V15.8356H39.2767Z"
        fill="#0F1010"
      />
      <path
        d="M48.1945 15.8356C48.1288 15.5945 48.0795 15.337 48.0466 15.063C48.0247 14.789 48.0137 14.4712 48.0137 14.1096H47.9479V10.1479C47.9479 9.80822 47.8329 9.54521 47.6027 9.3589C47.3836 9.16164 47.0548 9.06301 46.6164 9.06301C46.2 9.06301 45.8658 9.13425 45.6137 9.27671C45.3726 9.41918 45.2137 9.6274 45.137 9.90137H42.7863C42.8959 9.14521 43.2849 8.52055 43.9534 8.0274C44.6219 7.53425 45.537 7.28767 46.6986 7.28767C47.9041 7.28767 48.8247 7.55616 49.4603 8.09315C50.0959 8.63014 50.4137 9.40274 50.4137 10.411V14.1096C50.4137 14.3836 50.4301 14.663 50.463 14.9479C50.5068 15.2219 50.5726 15.5178 50.6603 15.8356H48.1945ZM45.2685 16C44.4356 16 43.7726 15.7918 43.2795 15.3753C42.7863 14.9479 42.5397 14.3836 42.5397 13.6822C42.5397 12.9041 42.8301 12.2795 43.411 11.8082C44.0027 11.326 44.8247 11.0137 45.8767 10.8712L48.326 10.526V11.9562L46.2877 12.2685C45.8493 12.3342 45.526 12.4548 45.3178 12.6301C45.1096 12.8055 45.0055 13.0466 45.0055 13.3534C45.0055 13.6274 45.1041 13.8356 45.3014 13.9781C45.4986 14.1205 45.7616 14.1918 46.0904 14.1918C46.6055 14.1918 47.0438 14.0548 47.4055 13.7808C47.7671 13.4959 47.9479 13.1671 47.9479 12.7945L48.1781 14.1096C47.937 14.7342 47.5699 15.2055 47.0767 15.5233C46.5836 15.8411 45.9808 16 45.2685 16Z"
        fill="#0F1010"
      />
      <path
        d="M51.8157 15.8356V7.45205H54.2321V9.42466H54.2815V15.8356H51.8157ZM57.6513 15.8356V10.6411C57.6513 10.1808 57.5308 9.83562 57.2897 9.60548C57.0595 9.37534 56.7198 9.26027 56.2705 9.26027C55.8869 9.26027 55.5417 9.34795 55.2349 9.52329C54.939 9.69863 54.7034 9.93973 54.528 10.2466C54.3637 10.5534 54.2815 10.9151 54.2815 11.3315L54.0678 9.30959C54.3417 8.69589 54.7417 8.20822 55.2678 7.84658C55.8048 7.47397 56.4623 7.28767 57.2404 7.28767C58.1719 7.28767 58.8842 7.55068 59.3774 8.07671C59.8705 8.59178 60.1171 9.28767 60.1171 10.1644V15.8356H57.6513Z"
        fill="#0F1010"
      />
      <path
        d="M67.4345 15.8356V13.9781L67.5988 14.011C67.4893 14.6137 67.1605 15.0959 66.6125 15.4575C66.0756 15.8192 65.429 16 64.6728 16C63.9057 16 63.2372 15.8247 62.6673 15.474C62.1084 15.1123 61.6756 14.6082 61.3687 13.9616C61.0619 13.3151 60.9084 12.5534 60.9084 11.6767C60.9084 10.789 61.0673 10.0164 61.3851 9.3589C61.703 8.70137 62.1468 8.19178 62.7166 7.83014C63.2975 7.46849 63.9714 7.28767 64.7386 7.28767C65.5386 7.28767 66.1851 7.47397 66.6783 7.84658C67.1824 8.21918 67.4783 8.72877 67.566 9.37534L67.3851 9.39178V4H69.8509V15.8356H67.4345ZM65.4619 14.0274C66.0427 14.0274 66.5139 13.8247 66.8756 13.4192C67.2372 13.0027 67.418 12.411 67.418 11.6438C67.418 10.8767 67.2317 10.2904 66.8591 9.88493C66.4975 9.46849 66.0208 9.26027 65.429 9.26027C64.8591 9.26027 64.3879 9.46849 64.0153 9.88493C63.6536 10.3014 63.4728 10.8932 63.4728 11.6603C63.4728 12.4274 63.6536 13.0137 64.0153 13.4192C64.3879 13.8247 64.8701 14.0274 65.4619 14.0274Z"
        fill="#0F1010"
      />
      <path
        d="M75.2744 16C74.3429 16 73.5319 15.8192 72.8415 15.4575C72.1511 15.0849 71.6141 14.5699 71.2306 13.9123C70.858 13.2548 70.6717 12.4986 70.6717 11.6438C70.6717 10.7781 70.858 10.0219 71.2306 9.37534C71.6141 8.71781 72.1456 8.20822 72.8251 7.84658C73.5045 7.47397 74.2936 7.28767 75.1922 7.28767C76.058 7.28767 76.8086 7.46301 77.4443 7.8137C78.0799 8.16438 78.573 8.65205 78.9237 9.27671C79.2744 9.90137 79.4497 10.6356 79.4497 11.4795C79.4497 11.6548 79.4443 11.8192 79.4333 11.9726C79.4223 12.1151 79.4059 12.2521 79.384 12.3836H72.1182V10.7562H77.3949L76.9676 11.0521C76.9676 10.3726 76.8032 9.87397 76.4744 9.55616C76.1566 9.2274 75.7182 9.06301 75.1593 9.06301C74.5128 9.06301 74.0086 9.28219 73.647 9.72055C73.2963 10.1589 73.121 10.8164 73.121 11.6932C73.121 12.5479 73.2963 13.1836 73.647 13.6C74.0086 14.0164 74.5456 14.2247 75.258 14.2247C75.6525 14.2247 75.9922 14.1589 76.2771 14.0274C76.5621 13.8959 76.7758 13.6822 76.9182 13.3863H79.236C78.9621 14.1973 78.4908 14.8384 77.8223 15.3096C77.1648 15.7699 76.3155 16 75.2744 16Z"
        fill="#0F1010"
      />
    </svg>
  )
}

// ─── SideNavItem ──────────────────────────────────────────────────────────────

export type SideNavItemProps = {
  label: string
  icon?: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function SideNavItem({ label, icon, selected = false, onClick, className }: SideNavItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={cn(
        "group flex items-center gap-2 px-2 py-1.5 rounded-2 w-full text-left relative overflow-hidden",
        "[transition:background-color_150ms_ease]",
        selected
          ? "bg-muted text-foreground"
          : "bg-background text-muted-foreground hover:bg-subtle",
        className
      )}
    >
      {icon}
      <span className={cn("whitespace-nowrap min-w-0", selected ? "text-base-medium" : "text-base-regular")}>
        {label}
      </span>
      {/* Base fader — always visible, matches the resting bg */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-0 inset-y-0 w-8 bg-gradient-to-l to-transparent",
          selected ? "from-muted" : "from-background"
        )}
      />
      {/* Hover fader — fades in via opacity so the gradient color crossfades smoothly */}
      {!selected && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-subtle to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        />
      )}
    </motion.button>
  )
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────

export type SectionTitleProps = {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function SectionTitle({ label, defaultOpen = true, children }: SectionTitleProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-0.5 px-2 py-0.5 select-none text-left rounded-1 hover:bg-subtle [transition:background-color_150ms_ease]"
      >
        <span className="text-small-regular text-muted-foreground whitespace-nowrap">{label}</span>
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={reduceMotion ? { duration: 0 } : springs.crisp}
          className="inline-flex text-muted-foreground"
        >
          <Icon name="IconChevronDownSmall" size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            }
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── AccountSelector ──────────────────────────────────────────────────────────

export type AccountSelectorProps = {
  name: string
  initials: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function AccountSelector({ name, initials, selected = false, onClick, className }: AccountSelectorProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className={cn(
        "inline-flex items-center gap-2 p-1 rounded-2 text-left",
        "[transition:background-color_150ms_ease]",
        selected ? "bg-muted" : "hover:bg-subtle",
        className
      )}
    >
      <div
        className="size-5 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200"
        style={{ borderWidth: "0.5px" }}
      >
        <span className="text-small-medium text-neutral-700 leading-none select-none">
          {initials.slice(0, 2)}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <span className="text-base-medium text-muted-foreground whitespace-nowrap">{name}</span>
        <Icon name="IconChevronDownSmall" size={16} className="text-muted-foreground" />
      </div>
    </motion.button>
  )
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

export type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

export type ChatGroup = {
  label: string
  items: Array<{ id: string; label: string }>
}

export type AppSidebarProps = {
  activeItem?: string
  onNavigate?: (id: string) => void
  navItems?: NavItem[]
  chatGroups?: ChatGroup[]
  announcementCard?: React.ReactNode
  user?: { name: string; initials: string }
  logo?: React.ReactNode
  onCollapse?: () => void
  className?: string
}

export function AppSidebar({
  activeItem,
  onNavigate,
  navItems = [],
  chatGroups = [],
  announcementCard,
  user,
  logo,
  onCollapse,
  className,
}: AppSidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-[220px] h-full bg-background rounded-3 overflow-hidden border border-neutral-200",
        className
      )}
      style={{ borderWidth: "0.5px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pl-4 pr-3 py-3 shrink-0">
        {logo ?? <MandeLogoDefault />}
        <motion.button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse sidebar"
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="flex items-center justify-center p-1 rounded-2 text-muted-foreground hover:bg-subtle shrink-0 [transition:background-color_150ms_ease]"
        >
          <Icon name="IconSidebarSimpleLeftWide" size={20} fill="filled" />
        </motion.button>
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 flex flex-col gap-6 p-2 overflow-y-auto min-h-0">
        {navItems.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <SideNavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                selected={activeItem === item.id}
                onClick={() => onNavigate?.(item.id)}
              />
            ))}
          </div>
        )}

        {chatGroups.map((group) => (
          <SectionTitle key={group.label} label={group.label}>
            {group.items.map((item) => (
              <SideNavItem
                key={item.id}
                label={item.label}
                selected={activeItem === item.id}
                onClick={() => onNavigate?.(item.id)}
              />
            ))}
          </SectionTitle>
        ))}
      </div>

      {/* Bottom */}
      <div className="shrink-0 px-3 py-2.5 flex flex-col gap-2 items-start">
        {announcementCard}
        {user && <AccountSelector name={user.name} initials={user.initials} />}
      </div>
    </div>
  )
}
