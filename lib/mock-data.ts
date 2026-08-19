export interface Ingredient {
  id: string
  name: string
  gtin?: string
  soLo?: string
  maTem?: string
  company: string
  datChuanStatus: 'đạt' | 'không đạt'
}

export interface FoodItem {
  id: string
  name: string
  ingredients: Ingredient[]
}

export interface TimeSection {
  period: 'Buổi sáng' | 'Buổi trưa' | 'Buổi xế'
  foods: FoodItem[]
}

export interface FoodMenu {
  date: string
  timeSections: TimeSection[]
}

export interface ClassInfo {
  id: string
  name: string
  isHomeroom?: boolean
}

// 9 classes — 3 per row in class switcher
export const MOCK_CLASSES: ClassInfo[] = [
  { id: 'class-1', name: 'Lớp Mầm' },
  { id: 'class-2', name: 'Lớp Chòi' },
  { id: 'class-3', name: 'Lớp Lá' },
  { id: 'class-4', name: 'Lớp 1A' },
  { id: 'class-5', name: 'Lớp 1B' },
  { id: 'class-6', name: 'Lớp 2A' },
  { id: 'class-7', name: 'Lớp 6A2', isHomeroom: true },
  { id: 'class-8', name: '8A1' },
  { id: 'class-9', name: '8A2' },
]

// Base ingredient definitions
const ING = {
  gaoTam: (suffix: string): Ingredient => ({
    id: `ing-gao-${suffix}`,
    name: 'Gạo tấm',
    gtin: '859358645823',
    soLo: '202643-65',
    company: 'Công ty CP Lương thực Sài Gòn',
    datChuanStatus: 'đạt',
  }),
  gaTuoi: (suffix: string): Ingredient => ({
    id: `ing-ga-${suffix}`,
    name: 'Gà tươi',
    maTem: 'G592852526',
    company: 'Trang trại gà Mỹ Hào',
    datChuanStatus: 'đạt',
  }),
  trungGa: (suffix: string): Ingredient => ({
    id: `ing-trung-${suffix}`,
    name: 'Trứng gà tươi',
    gtin: '815926384756',
    soLo: '210756-42',
    company: 'Trại gà Lương Minh',
    datChuanStatus: 'đạt',
  }),
  gaoLua: (suffix: string): Ingredient => ({
    id: `ing-gaolua-${suffix}`,
    name: 'Gạo lúa ngon',
    gtin: '948273615928',
    soLo: '215843-78',
    company: 'Công ty CP Lương thực Sài Gòn',
    datChuanStatus: 'đạt',
  }),
  rauMuong: (suffix: string): Ingredient => ({
    id: `ing-rau-${suffix}`,
    name: 'Rau muống tươi',
    maTem: 'V128375926',
    company: 'Vườn rau Bình Minh',
    datChuanStatus: 'đạt',
  }),
  caDiec: (suffix: string): Ingredient => ({
    id: `ing-ca-${suffix}`,
    name: 'Cá diếc',
    gtin: '756293847561',
    soLo: '220134-51',
    company: 'Chợ cá Nha Trang',
    datChuanStatus: 'đạt',
  }),
  botMi: (suffix: string): Ingredient => ({
    id: `ing-bot-${suffix}`,
    name: 'Bột mì mịn',
    gtin: '384756928374',
    soLo: '208765-33',
    company: 'Nhà máy bột mì Bình Dương',
    datChuanStatus: 'đạt',
  }),
  suaBo: (suffix: string): Ingredient => ({
    id: `ing-sua-${suffix}`,
    name: 'Sữa bò tươi',
    gtin: '657483920156',
    soLo: '218765-64',
    company: 'Công ty sữa Vinamilk',
    datChuanStatus: 'đạt',
  }),
  chuoiTuoi: (suffix: string): Ingredient => ({
    id: `ing-chuoi-${suffix}`,
    name: 'Chuối tươi',
    maTem: 'F745839201',
    company: 'Trang trại Trái cây Bến Tre',
    datChuanStatus: 'đạt',
  }),
  thitHeo: (suffix: string): Ingredient => ({
    id: `ing-heo-${suffix}`,
    name: 'Thịt heo tươi',
    gtin: '920384756192',
    soLo: '225610-19',
    company: 'Công ty CP Chăn nuôi C.P',
    datChuanStatus: 'đạt',
  }),
  dauHu: (suffix: string): Ingredient => ({
    id: `ing-dau-${suffix}`,
    name: 'Đậu hũ trắng',
    maTem: 'T384756920',
    company: 'Cơ sở đậu hũ Bà Lan',
    datChuanStatus: 'đạt',
  }),
}

// Build one full-day menu for a given date+suffix combo
function buildMenu(dateStr: string, variant: number, classId: string): FoodMenu {
  const s = `${classId}-${dateStr}`
  const menus: FoodMenu[] = [
    {
      date: dateStr,
      timeSections: [
        {
          period: 'Buổi sáng',
          foods: [
            { id: `f-${s}-1`, name: 'Cháo gà', ingredients: [ING.gaoTam(s + '1'), ING.gaTuoi(s + '2')] },
            { id: `f-${s}-2`, name: 'Sữa tươi', ingredients: [ING.suaBo(s + '3')] },
          ],
        },
        {
          period: 'Buổi trưa',
          foods: [
            { id: `f-${s}-3`, name: 'Cơm trắng', ingredients: [ING.gaoLua(s + '4')] },
            { id: `f-${s}-4`, name: 'Canh cá', ingredients: [ING.caDiec(s + '5')] },
            { id: `f-${s}-5`, name: 'Rau muống xào', ingredients: [ING.rauMuong(s + '6')] },
          ],
        },
        {
          period: 'Buổi xế',
          foods: [
            { id: `f-${s}-6`, name: 'Trái cây tươi', ingredients: [ING.chuoiTuoi(s + '7')] },
          ],
        },
      ],
    },
    {
      date: dateStr,
      timeSections: [
        {
          period: 'Buổi sáng',
          foods: [
            { id: `f-${s}-1`, name: 'Bánh mì thịt', ingredients: [ING.botMi(s + '1'), ING.thitHeo(s + '2')] },
            { id: `f-${s}-2`, name: 'Sữa tươi', ingredients: [ING.suaBo(s + '3')] },
          ],
        },
        {
          period: 'Buổi trưa',
          foods: [
            { id: `f-${s}-3`, name: 'Cơm trắng', ingredients: [ING.gaoLua(s + '4')] },
            { id: `f-${s}-4`, name: 'Đậu hũ chiên', ingredients: [ING.dauHu(s + '5')] },
            { id: `f-${s}-5`, name: 'Canh rau muống', ingredients: [ING.rauMuong(s + '6')] },
          ],
        },
        {
          period: 'Buổi xế',
          foods: [
            { id: `f-${s}-6`, name: 'Trứng cuộn', ingredients: [ING.trungGa(s + '7')] },
          ],
        },
      ],
    },
    {
      date: dateStr,
      timeSections: [
        {
          period: 'Buổi sáng',
          foods: [
            { id: `f-${s}-1`, name: 'Cháo thịt heo', ingredients: [ING.gaoTam(s + '1'), ING.thitHeo(s + '2')] },
          ],
        },
        {
          period: 'Buổi trưa',
          foods: [
            { id: `f-${s}-3`, name: 'Cơm trắng', ingredients: [ING.gaoLua(s + '4')] },
            { id: `f-${s}-4`, name: 'Canh cá', ingredients: [ING.caDiec(s + '5')] },
            { id: `f-${s}-5`, name: 'Đậu hũ sốt cà', ingredients: [ING.dauHu(s + '6')] },
          ],
        },
        {
          period: 'Buổi xế',
          foods: [
            { id: `f-${s}-6`, name: 'Trái cây tươi', ingredients: [ING.chuoiTuoi(s + '7')] },
            { id: `f-${s}-7`, name: 'Sữa tươi', ingredients: [ING.suaBo(s + '8')] },
          ],
        },
      ],
    },
  ]
  return menus[variant % 3]
}

// TODAY is 30/06/2026. Generate 15 days: -7 … +7 relative to today.
const TODAY = new Date(2026, 5, 30) // month is 0-indexed

function dateOffset(offset: number): string {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offset)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

function buildClassMenus(classId: string, variantOffset: number): Record<string, FoodMenu> {
  const result: Record<string, FoodMenu> = {}
  for (let i = -7; i <= 7; i++) {
    const dateStr = dateOffset(i)
    result[dateStr] = buildMenu(dateStr, i + variantOffset, classId)
  }
  return result
}

export const MOCK_FOOD_MENUS: Record<string, Record<string, FoodMenu>> = {
  'class-1': buildClassMenus('class-1', 0),
  'class-2': buildClassMenus('class-2', 1),
  'class-3': buildClassMenus('class-3', 2),
  'class-4': buildClassMenus('class-4', 3),
  'class-5': buildClassMenus('class-5', 4),
  'class-6': buildClassMenus('class-6', 5),
  'class-7': buildClassMenus('class-7', 6),
  'class-8': buildClassMenus('class-8', 7),
  'class-9': buildClassMenus('class-9', 8),
}

export const TODAY_STR = dateOffset(0) // '30/06/2026'

// ─── Điểm danh (Attendance) Types ──────────────────────────────────────────
//
// AttendanceStatus/CheckoutStatus encode the underlying record; badge *labels*
// shown in the UI are derived from these (see attendance/shared.tsx) — some
// labels intentionally diverge from the status name (see diem-danh-flow-spec
// Open Question #3: "Trả học sinh" keeps the literal "Chưa đón" wording).

export type AttendanceStatus = 'chưa-đón' | 'có-mặt' | 'đến-muộn' | 'vắng-có-phép' | 'vắng-không-phép'
export type CheckoutStatus = 'chưa-về' | 'đã-về' | 'vắng-có-phép' | 'vắng-không-phép'
export type AbsenceRequestStatus = 'chờ-duyệt' | 'đã-duyệt' | 'đã-huỷ'

export interface DiemDanhStudent {
  id: string
  name: string
  avatar?: string
  studentCode: string
}

export interface CheckInRecord {
  studentId: string
  date: string
  checkInTime?: string // HH:MM format
  status: AttendanceStatus
  note?: string
}

export interface CheckOutRecord {
  studentId: string
  date: string
  checkOutTime?: string // HH:MM format
  status: CheckoutStatus
  note?: string
}

export interface AbsenceRequest {
  id: string
  studentId: string
  date: string
  reason: string
  requestedAt: string // ISO timestamp
  requestStatus: AbsenceRequestStatus
}

// School operation times — also the threshold used to auto-derive "Đến muộn"
// vs "Có mặt" at check-in time (diem-danh-flow-spec Open Question #5).
export const SCHOOL_CHECK_IN_TIME = '08:00'
export const SCHOOL_CHECK_OUT_TIME = '16:30'

// Classes the teacher can switch between in the "Chọn lớp" sheet (Lớp 6A2 is
// their homeroom class; 8A1/8A10 are subject classes with no secondary label
// per Open Question #7). Scoped to the Điểm danh feature — MOCK_CLASSES above
// is a separate, larger list used by Thực đơn lớp and isn't touched here.
export const DIEM_DANH_CLASSES: ClassInfo[] = [
  { id: 'class-7', name: 'Lớp 6A2', isHomeroom: true },
  { id: 'class-8', name: '8A1' },
  { id: 'class-10', name: '8A10' },
]

// Fixed 3-student roster per diem-danh-flow-spec sample data.
export const DIEM_DANH_STUDENTS: DiemDanhStudent[] = [
  { id: 'dd-student-1', name: 'Nguyễn Hoàng Huyền Diệu', avatar: '/placeholder-user.jpg', studentCode: 'KID0005' },
  { id: 'dd-student-2', name: 'Phạm Thu Trang', studentCode: 'KID0006' },
  { id: 'dd-student-3', name: 'Hoàng Thanh Trúc', studentCode: 'KID0008' },
]

export function createInitialCheckInRecords(date: string): Record<string, CheckInRecord> {
  const records: Record<string, CheckInRecord> = {}
  DIEM_DANH_STUDENTS.forEach((s) => {
    records[s.id] = { studentId: s.id, date, status: 'chưa-đón' }
  })
  return records
}

export function createInitialCheckOutRecords(date: string): Record<string, CheckOutRecord> {
  const records: Record<string, CheckOutRecord> = {}
  DIEM_DANH_STUDENTS.forEach((s) => {
    records[s.id] = { studentId: s.id, date, status: 'chưa-về' }
  })
  return records
}

// No sample absence-request data is defined in diem-danh-flow-spec (Diem danh
// 6 only illustrates the empty state) — starts empty.
export const DIEM_DANH_ABSENCE_REQUESTS: AbsenceRequest[] = []

// ─── Messaging Types ──────────────────────────────────────────────────────────

export type MessageType = 'text' | 'request'
export type RequestType = 'medicine' | 'absence' | 'pickup' | 'note'
export type RequestStatus = 'pending' | 'acknowledged' | 'rejected'

export interface MessageRequest {
  id: string
  type: RequestType
  title: string
  description: string
  appliesDate?: string
  status: RequestStatus
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: 'teacher' | 'parent'
  timestamp: string
  messageType: MessageType
  text?: string
  request?: MessageRequest
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  participantIds: string[]
  displayName: string
  displayAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  // Short class code ('6A2' | '8A1' | '7B1') the conversation belongs to —
  // used by the "Trao đổi" tab filter (and "Tất cả" when unset/empty).
  classFilter?: string
  // Direct (1:1) conversations only — the list row shows student name (used
  // for search) above the smaller parent name, instead of a single displayName.
  studentName?: string
  parentName?: string
}

// Mock parent data
const PARENTS = [
  { id: 'parent-1', name: 'Lê Thị Hoa', studentName: 'Minh An', studentId: 'student-class-7-2' },
  { id: 'parent-2', name: 'Trần Văn Hùng', studentName: 'Quỳnh Anh', studentId: 'student-class-7-7' },
  { id: 'parent-3', name: 'Nguyễn Thị Thu', studentName: 'Đăng Khôi', studentId: 'student-class-7-4' },
  { id: 'parent-4', name: 'Phạm Minh Hiếu', studentName: 'Bảo Châu', studentId: 'student-class-7-9' },
  { id: 'parent-5', name: 'Võ Thanh Hoa', studentName: 'Gia Hân', studentId: 'student-class-7-14' },
]

// Mock conversations list
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    type: 'group',
    participantIds: ['teacher-1', ...PARENTS.map((p) => p.id)],
    displayName: 'Nhóm Lớp 6A2',
    unreadCount: 0,
    classFilter: '6A2',
    lastMessage: 'Bạn: 7h30 tập trung ở sân trường nhé.',
    lastMessageTime: '08:50',
  },
  {
    id: 'conv-2',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-1'],
    displayName: 'PH bé Minh An',
    studentName: 'Nguyễn Minh An',
    parentName: 'Lê Thị Hoa',
    classFilter: '6A2',
    lastMessage: '💊 Dặn thuốc — Paracetamol 250mg',
    lastMessageTime: '10:02',
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-2'],
    displayName: 'PH bé Quỳnh Anh',
    studentName: 'Trần Quỳnh Anh',
    parentName: 'Trần Văn Hùng',
    classFilter: '6A2',
    lastMessage: 'Dạ em cảm ơn cô nhiều ạ',
    lastMessageTime: '09:15',
    unreadCount: 0,
  },
  {
    id: 'conv-4',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-3'],
    displayName: 'PH bé Đăng Khôi',
    studentName: 'Lê Đăng Khôi',
    parentName: 'Nguyễn Thị Thu',
    classFilter: '6A2',
    lastMessage: 'Nhờ cô để ý bé giúp em ạ',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
  },
  {
    id: 'conv-5',
    type: 'direct',
    participantIds: ['teacher-1', 'parent-5'],
    displayName: 'PH bé Gia Hân',
    studentName: 'Võ Gia Hân',
    parentName: 'Võ Thanh Hoa',
    classFilter: '6A2',
    lastMessage: 'Bé nay nghỉ ốm cô nhé',
    lastMessageTime: 'T3',
    unreadCount: 0,
  },
]

// Mock messages for direct conversation with parent-1 (Minh An)
export const MOCK_MESSAGES_DIRECT: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'parent-1',
    senderName: 'Mẹ bé Minh An',
    senderRole: 'parent',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    messageType: 'text',
    text: 'Chào cô, sáng nay bé hơi sốt nhẹ ạ.',
  },
  {
    id: 'msg-2',
    senderId: 'parent-1',
    senderName: 'Mẹ bé Minh An',
    senderRole: 'parent',
    timestamp: new Date(Date.now() - 118 * 60000).toISOString(),
    messageType: 'request',
    request: {
      id: 'req-1',
      type: 'medicine',
      title: 'Dặn thuốc',
      description: 'Paracetamol 250mg — sau bữa trưa, 1 gói. Áp dụng hôm nay.',
      appliesDate: TODAY_STR,
      status: 'pending',
    },
  },
  {
    id: 'msg-3',
    senderId: 'teacher-1',
    senderName: 'Cô Nguyễn Hồng',
    senderRole: 'teacher',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    messageType: 'text',
    text: 'Cảm ơn, cô sẽ chú ý cho bé ạ.',
  },
]

// Mock messages for group conversation
export const MOCK_MESSAGES_GROUP: ChatMessage[] = [
  {
    id: 'gmsg-1',
    senderId: 'teacher-1',
    senderName: 'Cô Nguyễn Hồng · GVCN',
    senderRole: 'teacher',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    messageType: 'text',
    text: '7h30 tập trung ở sân trường nhé.',
  },
  {
    id: 'gmsg-2',
    senderId: 'parent-5',
    senderName: 'Mẹ bé Gia Hân',
    senderRole: 'parent',
    timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
    messageType: 'text',
    text: 'Dạ cô, cảm ơn cô ạ',
  },
]

export const MOCK_TEACHER_INFO = {
  id: 'teacher-1',
  name: 'Cô Nguyễn Hồng',
  classId: 'class-7',
  className: 'Lớp 6A2',
  studentCount: 32,
}
