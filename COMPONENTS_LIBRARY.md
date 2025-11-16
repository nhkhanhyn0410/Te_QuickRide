# COMPONENTS LIBRARY - QuickRide

> Thư viện components tái sử dụng cho toàn bộ ứng dụng

## 🎯 Component Structure

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── layout/          # Layout components
│   ├── forms/           # Form components
│   ├── booking/         # Booking-specific components
│   ├── operator/        # Operator-specific components
│   └── admin/           # Admin-specific components
```

---

# 1. COMMON COMPONENTS (30 components)

## 1.1 Basic UI Elements (8 components)

### Button ⭐⭐⭐
**Path**: `src/components/common/Button.tsx`

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Usage**:
```tsx
<Button variant="primary" size="md" loading={isLoading}>
  Tìm chuyến
</Button>
```

---

### Badge
**Path**: `src/components/common/Badge.tsx`

**Props**:
```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children: React.ReactNode;
}
```

**Usage**:
```tsx
<Badge variant="success">Đã xác nhận</Badge>
<Badge variant="warning" dot>Chờ thanh toán</Badge>
```

---

### Card
**Path**: `src/components/common/Card.tsx`

**Props**:
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

---

### Alert
**Path**: `src/components/common/Alert.tsx`

**Props**:
```typescript
interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}
```

---

### Avatar
**Path**: `src/components/common/Avatar.tsx`

**Props**:
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string; // Initials
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  status?: 'online' | 'offline' | 'busy';
}
```

---

### Spinner/Loading
**Path**: `src/components/common/Spinner.tsx`

**Props**:
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
  text?: string;
}
```

---

### Divider
**Path**: `src/components/common/Divider.tsx`

**Props**:
```typescript
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  text?: string;
  textAlign?: 'left' | 'center' | 'right';
}
```

---

### Tag
**Path**: `src/components/common/Tag.tsx`

**Props**:
```typescript
interface TagProps {
  color?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

---

## 1.2 Navigation (4 components)

### Breadcrumb ⭐⭐
**Path**: `src/components/common/Breadcrumb.tsx`

**Props**:
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}
```

**Usage**:
```tsx
<Breadcrumb items={[
  { label: 'Trang chủ', href: '/' },
  { label: 'Tìm kiếm', href: '/search' },
  { label: 'Chi tiết chuyến' }
]} />
```

---

### Tabs ⭐⭐
**Path**: `src/components/common/Tabs.tsx`

**Props**:
```typescript
interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
  variant?: 'line' | 'card';
}
```

---

### Pagination ⭐⭐
**Path**: `src/components/common/Pagination.tsx`

**Props**:
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showSizeChanger?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}
```

---

### Stepper ⭐⭐
**Path**: `src/components/common/Stepper.tsx`

**Props**:
```typescript
interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}
```

**Usage**: Booking flow progress indicator

---

## 1.3 Data Display (8 components)

### Table ⭐⭐⭐
**Path**: `src/components/common/Table.tsx`

**Props**:
```typescript
interface Column<T> {
  key: keyof T;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: keyof T;
  onRowClick?: (record: T) => void;
  pagination?: PaginationProps;
}
```

---

### List
**Path**: `src/components/common/List.tsx`

**Props**:
```typescript
interface ListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  empty?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
```

---

### Empty State
**Path**: `src/components/common/EmptyState.tsx`

**Props**:
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

**Usage**:
```tsx
<EmptyState
  icon={<NoDataIcon />}
  title="Không có chuyến đi nào"
  description="Thử thay đổi bộ lọc hoặc tìm kiếm khác"
  action={<Button>Tìm kiếm lại</Button>}
/>
```

---

### Skeleton
**Path**: `src/components/common/Skeleton.tsx`

**Props**:
```typescript
interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
  animation?: 'pulse' | 'wave';
}
```

---

### Stat Card
**Path**: `src/components/common/StatCard.tsx`

**Props**:
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  loading?: boolean;
}
```

**Usage**: Dashboard statistics

---

### Timeline
**Path**: `src/components/common/Timeline.tsx`

**Props**:
```typescript
interface TimelineItem {
  time?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
}
```

**Usage**: Booking status timeline

---

### Progress Bar
**Path**: `src/components/common/ProgressBar.tsx`

**Props**:
```typescript
interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

---

### Rating
**Path**: `src/components/common/Rating.tsx`

**Props**:
```typescript
interface RatingProps {
  value: number; // 0-5
  max?: number;
  readonly?: boolean;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  allowHalf?: boolean;
}
```

---

## 1.4 Overlays (5 components)

### Modal ⭐⭐⭐
**Path**: `src/components/common/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  children: React.ReactNode;
}
```

---

### Drawer
**Path**: `src/components/common/Drawer.tsx`

**Props**:
```typescript
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: string | number;
  title?: string;
  children: React.ReactNode;
}
```

**Usage**: Mobile filters, mobile menu

---

### Dropdown
**Path**: `src/components/common/Dropdown.tsx`

**Props**:
```typescript
interface DropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger?: 'click' | 'hover';
  placement?: 'bottom' | 'top' | 'left' | 'right';
  children: React.ReactNode;
}
```

---

### Tooltip
**Path**: `src/components/common/Tooltip.tsx`

**Props**:
```typescript
interface TooltipProps {
  content: string | React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  children: React.ReactNode;
}
```

---

### Popover
**Path**: `src/components/common/Popover.tsx`

**Props**:
```typescript
interface PopoverProps {
  content: React.ReactNode;
  title?: string;
  trigger?: 'click' | 'hover';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}
```

---

## 1.5 Feedback (5 components)

### Toast/Notification ⭐⭐⭐
**Path**: `src/components/common/Toast.tsx`

**Usage**:
```typescript
toast.success('Đặt vé thành công!');
toast.error('Thanh toán thất bại!');
toast.warning('Ghế đang được giữ bởi người khác');
toast.info('Chuyến đi sẽ khởi hành trong 30 phút');
```

---

### Confirm Dialog
**Path**: `src/components/common/ConfirmDialog.tsx`

**Props**:
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'info' | 'warning' | 'danger';
}
```

---

### Message
**Path**: `src/components/common/Message.tsx`

**Usage**:
```typescript
message.success('Đã lưu thay đổi');
message.error('Có lỗi xảy ra');
```

---

### Loading Overlay
**Path**: `src/components/common/LoadingOverlay.tsx`

**Props**:
```typescript
interface LoadingOverlayProps {
  loading: boolean;
  text?: string;
  children: React.ReactNode;
}
```

---

### Error Boundary
**Path**: `src/components/common/ErrorBoundary.tsx`

**Props**:
```typescript
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}
```

---

# 2. FORM COMPONENTS (12 components)

## 2.1 Input Controls

### Input ⭐⭐⭐
**Path**: `src/components/forms/Input.tsx`

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  maxLength?: number;
}
```

---

### Textarea
**Path**: `src/components/forms/Textarea.tsx`

---

### Select ⭐⭐⭐
**Path**: `src/components/forms/Select.tsx`

**Props**:
```typescript
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}
```

---

### Checkbox
**Path**: `src/components/forms/Checkbox.tsx`

---

### Radio
**Path**: `src/components/forms/Radio.tsx`

---

### Switch/Toggle
**Path**: `src/components/forms/Switch.tsx`

---

### DatePicker ⭐⭐⭐
**Path**: `src/components/forms/DatePicker.tsx`

**Props**:
```typescript
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  format?: string;
}
```

---

### TimePicker
**Path**: `src/components/forms/TimePicker.tsx`

---

### DateRangePicker
**Path**: `src/components/forms/DateRangePicker.tsx`

---

### FileUpload ⭐⭐
**Path**: `src/components/forms/FileUpload.tsx`

**Props**:
```typescript
interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  maxFiles?: number;
  onUpload: (files: File[]) => void;
  error?: string;
  preview?: boolean;
}
```

---

### Autocomplete ⭐⭐⭐
**Path**: `src/components/forms/Autocomplete.tsx`

**Props**:
```typescript
interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
  error?: string;
}
```

**Usage**: Tìm kiếm thành phố (origin/destination)

---

### RangeSlider
**Path**: `src/components/forms/RangeSlider.tsx`

**Props**:
```typescript
interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  label?: string;
  formatLabel?: (value: number) => string;
}
```

**Usage**: Price filter

---

# 3. LAYOUT COMPONENTS (6 components)

### Header ⭐⭐⭐
**Path**: `src/components/layout/Header.tsx`

**Variants**:
- Public Header (Logo, Navigation, Login/Register)
- Customer Header (Logo, Navigation, User menu, Notifications)
- Operator Header
- Admin Header

---

### Sidebar ⭐⭐
**Path**: `src/components/layout/Sidebar.tsx`

**Props**:
```typescript
interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  badge?: number;
}

interface SidebarProps {
  items: MenuItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}
```

---

### Footer
**Path**: `src/components/layout/Footer.tsx`

**Sections**:
- Company info
- Quick links
- Contact
- Social media
- App download
- Copyright

---

### Container
**Path**: `src/components/layout/Container.tsx`

**Props**:
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children: React.ReactNode;
}
```

---

### Grid
**Path**: `src/components/layout/Grid.tsx`

**Props**:
```typescript
interface GridProps {
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string | number;
  children: React.ReactNode;
}
```

---

### Section
**Path**: `src/components/layout/Section.tsx`

**Props**:
```typescript
interface SectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}
```

---

# 4. BOOKING COMPONENTS (15 components)

### SearchForm ⭐⭐⭐
**Path**: `src/components/booking/SearchForm.tsx`

**Props**:
```typescript
interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  variant?: 'hero' | 'inline';
}

interface SearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  passengers: number;
}
```

---

### TripCard ⭐⭐⭐
**Path**: `src/components/booking/TripCard.tsx`

**Props**:
```typescript
interface TripCardProps {
  trip: Trip;
  onSelect: (tripId: string) => void;
  variant?: 'list' | 'grid';
}
```

**Displays**:
- Operator logo & name
- Departure/Arrival time
- Route (Origin → Destination)
- Duration
- Bus type & amenities icons
- Available seats
- Price
- Rating
- "Chọn chuyến" button

---

### TripFilters ⭐⭐
**Path**: `src/components/booking/TripFilters.tsx`

**Props**:
```typescript
interface TripFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  operators: BusOperator[];
}

interface FilterState {
  priceRange: [number, number];
  timeRange: [number, number]; // Hours (0-24)
  busTypes: string[];
  operators: string[];
  amenities: string[];
  minRating: number;
}
```

---

### SeatMap ⭐⭐⭐
**Path**: `src/components/booking/SeatMap.tsx`

**Props**:
```typescript
interface SeatMapProps {
  layout: string[][];
  occupiedSeats: string[];
  lockedSeats: string[];
  selectedSeats: string[];
  onSeatSelect: (seatNumber: string) => void;
  maxSeats?: number;
}
```

**Legend**:
- Available (green)
- Selected (blue)
- Occupied (gray)
- Locked (yellow)

---

### PassengerForm ⭐⭐⭐
**Path**: `src/components/booking/PassengerForm.tsx`

**Props**:
```typescript
interface PassengerFormProps {
  seatNumber: string;
  passenger?: Passenger;
  onChange: (passenger: Passenger) => void;
  savedPassengers?: Passenger[];
}
```

---

### BookingSummary ⭐⭐⭐
**Path**: `src/components/booking/BookingSummary.tsx`

**Props**:
```typescript
interface BookingSummaryProps {
  trip: Trip;
  seats: string[];
  passengers: Passenger[];
  pricing: PricingBreakdown;
  sticky?: boolean;
}
```

**Displays**:
- Trip details (Route, time, bus)
- Selected seats
- Passengers
- Pricing breakdown
- Total amount

---

### PaymentMethodSelector ⭐⭐⭐
**Path**: `src/components/booking/PaymentMethodSelector.tsx`

**Props**:
```typescript
interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  amount: number;
}
```

**Methods**:
- MoMo (logo + description)
- VNPay
- ZaloPay
- ShopeePay
- ATM/Visa/Mastercard
- COD (if enabled)

---

### BookingCard
**Path**: `src/components/booking/BookingCard.tsx`

**Props**:
```typescript
interface BookingCardProps {
  booking: Booking;
  onViewDetail: () => void;
  onCancel?: () => void;
  onDownloadTicket?: () => void;
}
```

---

### TicketCard ⭐⭐
**Path**: `src/components/booking/TicketCard.tsx`

**Props**:
```typescript
interface TicketCardProps {
  ticket: Ticket;
  showQR?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onDownload?: () => void;
}
```

---

### PickupDropoffSelector
**Path**: `src/components/booking/PickupDropoffSelector.tsx`

**Props**:
```typescript
interface PickupDropoffSelectorProps {
  type: 'pickup' | 'dropoff';
  points: Point[];
  selectedPoint?: Point;
  onSelect: (point: Point) => void;
}
```

---

### VoucherInput
**Path**: `src/components/booking/VoucherInput.tsx`

**Props**:
```typescript
interface VoucherInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  loading?: boolean;
  error?: string;
  discount?: {
    amount: number;
    voucherCode: string;
  };
}
```

---

### AmenityIcons
**Path**: `src/components/booking/AmenityIcons.tsx`

**Props**:
```typescript
interface AmenityIconsProps {
  amenities: string[];
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**Icons**: WiFi, AC, Toilet, Water, Blanket, TV, USB Charger, Reading Light

---

### RouteMap
**Path**: `src/components/booking/RouteMap.tsx`

**Props**:
```typescript
interface RouteMapProps {
  origin: Location;
  destination: Location;
  pickupPoints?: Point[];
  dropoffPoints?: Point[];
  height?: string;
}
```

---

### QRCodeDisplay
**Path**: `src/components/booking/QRCodeDisplay.tsx`

**Props**:
```typescript
interface QRCodeDisplayProps {
  data: string;
  size?: number;
  logo?: string;
}
```

---

### BookingTimeline
**Path**: `src/components/booking/BookingTimeline.tsx`

**Props**:
```typescript
interface BookingTimelineProps {
  status: BookingStatus;
  createdAt: Date;
  paidAt?: Date;
  checkedInAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}
```

---

# 5. OPERATOR COMPONENTS (8 components)

### BusCard
**Path**: `src/components/operator/BusCard.tsx`

---

### RouteCard
**Path**: `src/components/operator/RouteCard.tsx`

---

### TripTable
**Path**: `src/components/operator/TripTable.tsx`

---

### SeatLayoutEditor ⭐⭐
**Path**: `src/components/operator/SeatLayoutEditor.tsx`

**Props**:
```typescript
interface SeatLayoutEditorProps {
  layout: string[][];
  onLayoutChange: (layout: string[][]) => void;
  floors: number;
  rows: number;
  columns: number;
}
```

**Features**:
- Drag & drop seats
- Mark as empty (X)
- Auto-number seats
- Preview mode

---

### RevenueChart ⭐⭐
**Path**: `src/components/operator/RevenueChart.tsx`

**Props**:
```typescript
interface RevenueChartProps {
  data: RevenueData[];
  dateRange: [Date, Date];
  type?: 'line' | 'bar';
}
```

---

### BookingTable
**Path**: `src/components/operator/BookingTable.tsx`

---

### ReviewCard
**Path**: `src/components/operator/ReviewCard.tsx`

**Props**:
```typescript
interface ReviewCardProps {
  review: Review;
  onRespond?: (response: string) => void;
}
```

---

### StaffForm
**Path**: `src/components/operator/StaffForm.tsx`

---

# 6. ADMIN COMPONENTS (5 components)

### OperatorTable
**Path**: `src/components/admin/OperatorTable.tsx`

**Columns**:
- Company name
- Email, Phone
- Verification status
- Total trips, revenue
- Rating
- Actions (Approve/Reject/Suspend)

---

### UserTable
**Path**: `src/components/admin/UserTable.tsx`

---

### AnalyticsDashboard ⭐⭐
**Path**: `src/components/admin/AnalyticsDashboard.tsx`

---

### VoucherForm
**Path**: `src/components/admin/VoucherForm.tsx`

---

### SystemSettingsForm
**Path**: `src/components/admin/SystemSettingsForm.tsx`

---

# 🎨 ICON LIBRARY

**Recommended**: Heroicons, Feather Icons, or Lucide

### Categories:

**Navigation**:
- Home, Search, Menu, ChevronLeft, ChevronRight, ChevronDown, ChevronUp

**Actions**:
- Plus, Minus, Edit, Delete, Download, Upload, Share, Send

**UI**:
- Close, Check, X, Info, Warning, Error, Question

**Booking**:
- Calendar, Clock, Location, Map, Seat, Ticket, QRCode

**Payment**:
- CreditCard, Wallet, Bank, Money

**User**:
- User, UserGroup, Login, Logout, Profile, Settings

**Business**:
- Bus, Route, Trip, Chart, Analytics, Report

**Communication**:
- Phone, Email, Message, Notification, Bell

**Amenities**:
- WiFi, AC, Toilet, Water, Blanket, TV, USB, Light

---

# 🔧 UTILITY HOOKS

### useDebounce
**Path**: `src/hooks/useDebounce.ts`

```typescript
const debouncedValue = useDebounce(value, 500);
```

---

### useLocalStorage
**Path**: `src/hooks/useLocalStorage.ts`

```typescript
const [savedPassengers, setSavedPassengers] = useLocalStorage('savedPassengers', []);
```

---

### useMediaQuery
**Path**: `src/hooks/useMediaQuery.ts`

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
```

---

### useOnClickOutside
**Path**: `src/hooks/useOnClickOutside.ts`

**Usage**: Close dropdown/modal when clicking outside

---

### useInfiniteScroll
**Path**: `src/hooks/useInfiniteScroll.ts`

**Usage**: Infinite scroll for trip list

---

### useCopyToClipboard
**Path**: `src/hooks/useCopyToClipboard.ts`

**Usage**: Copy booking code, ticket code

---

### useCountdown
**Path**: `src/hooks/useCountdown.ts`

**Usage**: Seat lock countdown timer

---

# 📦 THIRD-PARTY LIBRARIES

## UI Components
- **@headlessui/react** - Headless UI components
- **@radix-ui/react-*** - Radix primitives
- **framer-motion** - Animations

## Forms
- **react-hook-form** - Form management
- **zod** - Schema validation
- **@hookform/resolvers** - Zod resolver for RHF

## Date/Time
- **date-fns** - Date utilities
- **react-datepicker** - Date picker component

## Maps
- **leaflet** + **react-leaflet** - Interactive maps
- OR **mapbox-gl** + **react-map-gl** - Mapbox maps

## Charts
- **recharts** - Chart library
- OR **chart.js** + **react-chartjs-2**

## QR Code
- **qrcode.react** - QR code generator

## Rich Text (if needed)
- **@tiptap/react** - Rich text editor

## File Upload
- **react-dropzone** - Drag & drop file upload

## Notifications
- **react-hot-toast** - Toast notifications
- OR **sonner** - Modern toast library

## State Management
- **@reduxjs/toolkit** - Redux state management
- **@tanstack/react-query** - Server state management

---

# 🎯 COMPONENT DEVELOPMENT PRIORITY

## Phase 1 (Week 1-4)

**Critical Components**:
1. Button, Input, Select, DatePicker ⭐⭐⭐
2. Card, Badge, Spinner ⭐⭐⭐
3. Modal, Toast ⭐⭐⭐
4. Header, Footer, Container ⭐⭐⭐
5. SearchForm ⭐⭐⭐
6. TripCard, TripFilters ⭐⭐⭐
7. SeatMap ⭐⭐⭐
8. PassengerForm ⭐⭐⭐
9. BookingSummary ⭐⭐⭐
10. PaymentMethodSelector ⭐⭐⭐

---

## Phase 2 (Week 5-8)

**Medium Priority**:
1. Sidebar, Breadcrumb, Tabs ⭐⭐
2. Table, Pagination ⭐⭐
3. Autocomplete, FileUpload ⭐⭐
4. SeatLayoutEditor ⭐⭐
5. BookingCard, TicketCard ⭐⭐
6. RevenueChart ⭐⭐

---

## Phase 3 (Week 9-12)

**Advanced Components**:
1. Timeline, Rating
2. Drawer, Dropdown, Tooltip
3. ReviewCard
4. AnalyticsDashboard
5. RouteMap

---

## Phase 4 (Week 13-16)

**Premium Components**:
1. Rich text editor (Blog)
2. Advanced charts
3. Voucher components
4. System settings components

---

**Version**: 1.0
**Last Updated**: 2025-01-16
